import { motion } from "framer-motion";
import {
  MessageSquare,
  BarChart3,
  Sparkles,
  Target,
  Headphones,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Marquee } from "@/components/ui/marquee";

const marqueeData = [
  "How do I answer behavioral questions?",
  "What's the STAR method?",
  "How do I handle tough follow-ups?",
  "How can I sound more confident?",
  "What body language impresses interviewers?",
  "How do I structure technical answers?",
  "How to manage nervousness?",
  "What makes eye contact effective?",
  "How do I pace my speech better?",
];

const features = [
  {
    icon: MessageSquare,
    title: "Conversational Mock Interviews",
    description:
      "Dynamic AI-driven interview sessions that adapt to your responses with contextual follow-up questions.",
    color: "bg-saply-mint",
  },
  {
    icon: BarChart3,
    title: "Real-time Performance Metrics",
    description:
      "Get instant scores on clarity, confidence, relevance, and technical depth as you speak.",
    color: "bg-saply-peach",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Feedback Reports",
    description:
      "Comprehensive post-session reports with actionable insights, trend graphs, and personalized tips.",
    color: "bg-saply-lavender",
  },
  {
    icon: Target,
    title: "Domain-Specific Practice",
    description:
      "Choose from Software Engineering, Marketing, Data Science, and more — or let AI pick for you.",
    color: "bg-saply-cream",
  },
  {
    icon: Headphones,
    title: "Speech & Vocal Analysis",
    description:
      "Advanced analysis of pace, tone, pauses, and prosody to help you master your vocal delivery.",
    color: "bg-saply-sky",
  },
  {
    icon: Eye,
    title: "Non-verbal Cue Detection",
    description:
      "Computer vision evaluates eye contact, facial expressions, and engagement to improve your presence.",
    color: "bg-saply-mint",
  },
];

export function FeaturesSection() {
  const m1 = marqueeData.slice(0, 3);
  const m2 = marqueeData.slice(3, 6);
  const m3 = marqueeData.slice(6);

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        {/* Marquee */}
        <div className="mb-16 overflow-hidden rounded-2xl border bg-card p-6">
          <div className="mb-4 text-center">
            <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1 text-xs font-medium uppercase tracking-wider">
              Common Questions We Help With
            </Badge>
          </div>
          <div className="space-y-3">
            <Marquee duration="25s" pauseOnHover>
              {m1.map((q) => (
                <span key={q} className="inline-block whitespace-nowrap rounded-full border bg-secondary px-4 py-2 text-sm text-secondary-foreground">
                  {q}
                </span>
              ))}
            </Marquee>
            <Marquee duration="30s" reverse pauseOnHover>
              {m2.map((q) => (
                <span key={q} className="inline-block whitespace-nowrap rounded-full border bg-secondary px-4 py-2 text-sm text-secondary-foreground">
                  {q}
                </span>
              ))}
            </Marquee>
            <Marquee duration="20s" pauseOnHover>
              {m3.map((q) => (
                <span key={q} className="inline-block whitespace-nowrap rounded-full border bg-secondary px-4 py-2 text-sm text-secondary-foreground">
                  {q}
                </span>
              ))}
            </Marquee>
          </div>
        </div>

        {/* Feature heading */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl md:text-4xl">
            Everything you need to{" "}
            <span className="text-primary">ace your next interview</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Powered by multimodal AI that analyzes your speech, expressions, and
            answers in real-time to give you the most comprehensive feedback.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group rounded-2xl border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <div className={`mb-4 inline-flex rounded-xl ${feature.color} p-3`}>
                  <Icon size={24} className="text-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
