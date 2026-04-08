import { Sprout } from "lucide-react";

export function FooterSection() {
  return (
    <footer className="border-t bg-card px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <Sprout size={24} className="text-primary" />
            <span className="text-xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Saply.ai
            </span>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Like a sapling growing into a strong tree, Saply helps you grow your
            voice, confidence, and communication skills step by step.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <span className="cursor-pointer transition-colors hover:text-foreground">About</span>
            <span className="cursor-pointer transition-colors hover:text-foreground">Privacy</span>
            <span className="cursor-pointer transition-colors hover:text-foreground">Terms</span>
            <span className="cursor-pointer transition-colors hover:text-foreground">Contact</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 Saply.ai — Built with 🌱
          </p>
        </div>
      </div>
    </footer>
  );
}
