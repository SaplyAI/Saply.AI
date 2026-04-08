import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Choose Your Domain",
    description:
      "Select an industry and role, or let AI surprise you. Pick Beginner or Advanced difficulty.",
    color: "bg-saply-mint",
  },
  {
    step: "02",
    title: "Start the Interview",
    description:
      "The AI interviewer asks dynamic questions. Respond naturally via your camera and microphone.",
    color: "bg-saply-peach",
  },
  {
    step: "03",
    title: "Get Real-time Analysis",
    description:
      "AI analyzes your speech, expressions, and answer quality simultaneously while you speak.",
    color: "bg-saply-lavender",
  },
  {
    step: "04",
    title: "Review Your Report",
    description:
      "Receive a detailed feedback report with scores, graphs, and actionable improvement tips.",
    color: "bg-saply-sky",
  },
];

export function HowItWorksSection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl md:text-4xl">
            How <span className="text-primary">Saply</span> Works
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Four simple steps to transform your interview performance
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="flex gap-5 rounded-2xl border bg-card p-6"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.color} text-lg font-bold text-foreground`}
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                {item.step}
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
