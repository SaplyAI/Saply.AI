import { motion } from "framer-motion";
import { ArrowRight, Mic, Video, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImg from "/Logo.jpeg";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 py-24 md:py-32">
      {/* Pastel blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-saply-mint opacity-40 blur-3xl" />
        <div className="absolute top-32 right-0 h-80 w-80 rounded-full bg-saply-peach opacity-30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-saply-lavender opacity-25 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8 flex justify-center">
            <img
              src={logoImg}
              alt="Saply.ai logo"
              className="h-20 w-20 rounded-2xl object-cover shadow-md"
            />
          </div>

          <h1 className="mb-6 text-4xl leading-tight md:text-6xl lg:text-7xl">
            Grow Your Voice with{" "}
            <span className="text-primary">Saply.ai</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            An AI-powered mock interview & public speaking trainer that helps you
            build confidence, clarity, and communication skills — one session at a time.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="gap-2 rounded-full px-8 text-base">
              Start Practicing <ArrowRight size={18} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 text-base"
            >
              Watch Demo
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-6"
        >
          {[
            { icon: Mic, label: "Speech Analysis" },
            { icon: Video, label: "Facial Expression" },
            { icon: Brain, label: "AI Follow-ups" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-full border bg-card px-5 py-3 shadow-sm"
            >
              <item.icon size={20} className="text-primary" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
