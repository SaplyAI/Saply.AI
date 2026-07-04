import os
import queue
from pathlib import Path

import numpy as np
import sounddevice as sd
from faster_whisper import WhisperModel

samplerate = 16000
block_duration = 2.5
block_size = int(samplerate * block_duration)
overlap_duration = 0.5
overlap_size = int(samplerate * overlap_duration)

cache_dir = Path(__file__).resolve().parent / ".cache" / "huggingface"
cache_dir.mkdir(parents=True, exist_ok=True)
os.environ.setdefault("HF_HOME", str(cache_dir))
os.environ.setdefault("HF_HUB_DISABLE_TELEMETRY", "1")

print("Loading Whisper model. This may take a moment on the first run...")
model = WhisperModel(
    "small.en",
    device="cpu",
    compute_type="int8",
    download_root=str(cache_dir),
)
q = queue.Queue()


def callback(indata, frames, time, status):
    q.put(indata.copy())


def normalize_audio(audio):
    audio = audio.astype(np.float32)
    peak = np.max(np.abs(audio))
    if peak > 0:
        audio = audio / peak
    return audio


print("🎤 Speak now... (Ctrl+C to stop)")

with sd.InputStream(samplerate=samplerate, channels=1, dtype="float32", callback=callback):
    buffer = np.zeros((0, 1), dtype="float32")
    previous_text = ""

    while True:
        data = q.get()
        buffer = np.concatenate((buffer, data))

        if len(buffer) >= block_size:
            audio_chunk = buffer[:block_size]
            buffer = buffer[block_size - overlap_size:]

            audio_chunk = normalize_audio(audio_chunk.flatten())

            segments, _ = model.transcribe(
                audio_chunk,
                language="en",
                beam_size=5,
                best_of=3,
                vad_filter=True,
                vad_parameters={"threshold": 0.35, "min_speech_duration_ms": 500},
                no_speech_threshold=0.6,
                log_prob_threshold=-1.0,
                compression_ratio_threshold=2.4,
                condition_on_previous_text=True,
                temperature=0.0,
            )

            for segment in segments:
                text = segment.text.strip()
                if text and text.lower() != previous_text.lower():
                    print("📝", text)
                    previous_text = text.lower()
