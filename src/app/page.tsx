import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Database, Network } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-radial from-[#080d24] via-background to-background text-foreground py-20 px-6 relative overflow-hidden min-h-screen">
      {/* Light glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Landing Wrapper */}
      <main className="w-full max-w-4xl text-center space-y-12 z-10 flex flex-col items-center">
        {/* Brand Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-semibold w-fit animate-pulse select-none">
          <Sparkles size={12} />
          <span>V1.0 Live: The Academic Operating System</span>
        </div>

        {/* Hero Title & Subtext */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold font-heading tracking-tight bg-gradient-to-b from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent leading-none">
            NEXORA
          </h1>
          <p className="text-lg md:text-xl font-medium tracking-tight text-indigo-400 font-heading">
            The Academic Operating System.
          </p>
          <p className="max-w-xl mx-auto text-sm md:text-base text-muted-foreground leading-relaxed">
            Eliminate cognitive clutter. Manage lectures, attendance, tasks, flashcards, quizzes, and placements from a single premium workstation designed for engineering students.
          </p>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link
            href="/mission-control"
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-6 transition-all duration-200 shadow-lg shadow-indigo-600/20 w-48 group cursor-pointer"
          >
            Enter Workspace
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-secondary/35 border border-border hover:bg-secondary/75 text-foreground font-semibold text-sm px-6 transition-colors duration-200 w-48 cursor-pointer"
          >
            Documentation
          </a>
        </div>

        {/* High-Fidelity Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-border/60 w-full">
          <div className="p-5 rounded-xl border border-glass-border bg-card/45 backdrop-blur-md text-left space-y-2 select-none">
            <Cpu className="text-indigo-400" size={20} />
            <h3 className="text-sm font-bold text-foreground font-heading">AI-Powered Copilot</h3>
            <p className="text-xs text-muted-foreground leading-normal">
              Summarize textbooks, generate mock practice tests, and ask technical questions directly from module PDF sheets.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-glass-border bg-card/45 backdrop-blur-md text-left space-y-2 select-none">
            <Database className="text-indigo-400" size={20} />
            <h3 className="text-sm font-bold text-foreground font-heading">Cognitive SRS Engine</h3>
            <p className="text-xs text-muted-foreground leading-normal">
              Automatically schedules revisions and flashcards based on concept complexity and target exam dates.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-glass-border bg-card/45 backdrop-blur-md text-left space-y-2 select-none">
            <Network className="text-indigo-400" size={20} />
            <h3 className="text-sm font-bold text-foreground font-heading">Academic Analytics</h3>
            <p className="text-xs text-muted-foreground leading-normal">
              Predict SGPA and calculate safe lecture-cut schedules with interactive simulation systems.
            </p>
          </div>
        </div>
      </main>

      {/* Tiny Footer */}
      <footer className="absolute bottom-6 text-[10px] text-muted-foreground select-none z-10">
        Designed with Apple-level spacing & Linear.app precision. Powered by Vercel.
      </footer>
    </div>
  );
}
