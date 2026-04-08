import { useState } from "react";
import { Home, Sparkles, HelpCircle, Settings, Menu, X } from "lucide-react";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { Button } from "@/components/ui/button";
import logoImg from "/Logo.jpeg";

const tabs = [
  { title: "Home", icon: Home },
  { title: "Features", icon: Sparkles },
  { type: "separator" as const },
  { title: "How it Works", icon: HelpCircle },
  { title: "Settings", icon: Settings },
];

export function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <img
            src={logoImg}
            alt="Saply.ai"
            className="h-9 w-9 rounded-lg object-cover"
          />
          <span className="text-xl font-bold text-primary" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Saply.ai
          </span>
        </div>

        <div className="hidden md:block">
          <ExpandableTabs tabs={tabs} />
        </div>

        <div className="hidden md:block">
          <Button size="sm" className="rounded-full px-6">
            Get Started
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="border-t bg-card px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {tabs
              .filter((t) => !("type" in t && t.type === "separator"))
              .map((tab) => (
                <button
                  key={tab.title}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {tab.icon && <tab.icon size={18} />}
                  {tab.title}
                </button>
              ))}
            <Button size="sm" className="mt-2 rounded-full">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
