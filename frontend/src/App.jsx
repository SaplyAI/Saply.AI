import { useEffect, useRef, useState } from 'react';

export default function App() {
  // Navigation steps: 'LANDING' -> 'CONFIG' -> 'INTERVIEW' -> 'END'
  const [step, setStep] = useState('LANDING'); 
  const [interviewType, setInterviewType] = useState(''); // 'technical' or 'hr'
  const [role, setRole] = useState('SDE');
  const [resumeFile, setResumeFile] = useState(null);
  
  // Chat state management
  const [chatHistory, setChatHistory] = useState([]); // Array of { role: 'assistant'|'user', content: string }
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      setVoiceSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(' ')
        .trim();

      if (transcript) {
        setUserInput((prev) => (prev ? `${prev} ${transcript}`.trim() : transcript));
      }
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    setVoiceSupported(true);

    return () => {
      recognition.stop();
    };
  }, []);

  const handleVoiceToggle = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  };

  // Endpoint 1: Triggers the backend initialization
  const handleStartInterview = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('interview_type', interviewType);
    formData.append('role', role);
    if (resumeFile) {
      formData.append('resume', resumeFile);
    }

    try {
      const response = await fetch('http://localhost:8000/api/start-interview', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      if (data.success) {
        // Feed the first question directly into our interface state
        setChatHistory([{ role: 'assistant', content: data.first_question }]);
        setStep('INTERVIEW');
      }
    } catch (err) {
      console.error("Error launching interview session:", err);
    } finally {
      setLoading(false);
    }
  };

  // Endpoint 2: Sends the typed answer and gets the next question back
  const handleSendAnswer = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || loading) return;

    // 1. Instantly append user's response locally to show it on screen
    const incomingHistory = [...chatHistory, { role: 'user', content: userInput }];
    setChatHistory(incomingHistory);
    const currentInput = userInput;
    setUserInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/next-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interview_type: interviewType,
          role: role,
          chat_history: incomingHistory
        })
      });
      const data = await response.json();
      
      if (data.success) {
        setChatHistory([...incomingHistory, { role: 'assistant', content: data.next_question }]);
      }
    } catch (err) {
      console.error("Error communicating next question:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl">
        <header className="border-b border-slate-700 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-indigo-400">SaplyAI</h1>
          <p className="text-xs text-slate-400">Phase 1 Minimal Text-Only Loop</p>
        </header>

        {/* STEP 1: LANDING */}
        {step === 'LANDING' && (
          <div className="space-y-6 py-4 text-center">
            <h2 className="text-xl font-semibold">Select your interview track:</h2>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => { setInterviewType('technical'); setStep('CONFIG'); }}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium tracking-wide transition"
              >
                Technical Interview
              </button>
              <button 
                onClick={() => { setInterviewType('hr'); setStep('CONFIG'); }}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium tracking-wide transition"
              >
                HR Interview
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CONFIGURATION */}
        {step === 'CONFIG' && (
          <div className="space-y-5">
            
            {/* Only show the role selector if it's a technical interview */}
            {interviewType === 'technical' && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">Target Role Profile</label>
                  <select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="SDE">Software Development Engineer (SDE)</option>
                    <option value="AI/ML Engineer">AI/ML Engineer</option>
                    <option value="Data Scientist">Data Scientist</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">Resume Source (.txt file only)</label>
                  <input 
                    type="file" 
                    accept=".txt" 
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-slate-200 hover:file:bg-slate-600 cursor-pointer"
                  />
                </div>
              </>
            )}

            {/* If it's an HR interview, we can display a clean, simple message instead */}
            {interviewType === 'hr' && (
              <p className="text-sm text-slate-400 italic">
                The HR path focus entirely on behavioral and situational competencies. No role customization or resume required for this baseline session.
              </p>
            )}

            <div className="pt-4 flex gap-3">
              <button 
                onClick={() => setStep('LANDING')}
                className="w-1/3 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition"
              >
                Back
              </button>
              <button 
                onClick={handleStartInterview}
                disabled={loading}
                className="w-2/3 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg text-sm font-medium transition"
              >
                {loading ? 'Initializing Agent...' : 'Launch Interview'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: THE LIVE INTERVIEW STREAM */}
        {step === 'INTERVIEW' && (
          <div className="flex flex-col h-[500px]">
            {/* Scrollable Chat Area */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-3 bg-slate-900 rounded-xl border border-slate-700">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed shadow ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-none'
                  }`}>
                    <span className="block text-[10px] uppercase font-bold tracking-wider mb-1 opacity-60">
                      {msg.role === 'user' ? 'Candidate' : 'Interviewer'}
                    </span>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="text-xs text-indigo-400 italic animate-pulse px-1">
                  Interviewer is preparing next evaluation track...
                </div>
              )}
            </div>

            {/* Answer Input Submission */}
            <form onSubmit={handleSendAnswer} className="flex flex-col gap-2 mb-3">
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type your response here..."
                  className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-500"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  disabled={loading || !voiceSupported}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isListening
                      ? 'bg-rose-600 hover:bg-rose-500'
                      : 'bg-slate-700 hover:bg-slate-600'
                  } disabled:opacity-50`}
                  title={voiceSupported ? 'Speak your answer' : 'Voice input not supported in this browser'}
                >
                  {isListening ? 'Stop' : '🎤'}
                </button>
                <button 
                  type="submit" 
                  disabled={loading || !userInput.trim()} 
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:opacity-50 rounded-lg text-sm font-medium transition"
                >
                  Submit
                </button>
              </div>
              {!voiceSupported && (
                <p className="text-[11px] text-slate-500">Voice input works best in Chrome or Edge browsers.</p>
              )}
            </form>

            <button 
              onClick={() => setStep('END')}
              className="w-full py-2 bg-transparent hover:bg-rose-950 border border-rose-800 text-rose-400 rounded-lg text-xs font-medium transition"
            >
              End Interview Early
            </button>
          </div>
        )}

        {/* STEP 4: INTERVIEW CONCLUSION */}
        {step === 'END' && (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-950 border border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-2">
              ✓
            </div>
            <h2 className="text-xl font-bold">Interview Block Completed</h2>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              You successfully closed the Phase 1 iteration loop. No analytics were run for this text test.
            </p>
            <button 
              onClick={() => {
                setStep('LANDING');
                setChatHistory([]);
                setResumeFile(null);
              }}
              className="mt-2 px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition"
            >
              Restart Simulation
            </button>
          </div>
        )}

      </div>
    </div>
  );
}