"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Search, Sparkles, BookOpen, Clock, FileText } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface CommandItem {
  id: string;
  category: "notes" | "ai" | "recent";
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

const SEARCH_ITEMS: CommandItem[] = [
  { id: "1", category: "notes", title: "Discrete Structures - Module 3 Notes", subtitle: "CSE Sem 5 - Relations & Graphs", icon: BookOpen },
  { id: "2", category: "notes", title: "Computer Networks Question Bank 2025", subtitle: "Solved papers by cohort", icon: FileText },
  { id: "3", category: "ai", title: "Generate Revision Summary for DBMS", subtitle: "AI Tutor active task", icon: Sparkles },
  { id: "4", category: "ai", title: "Create Practice Quiz on OSI Model", subtitle: "AI Quiz engine task", icon: Sparkles },
  { id: "5", category: "recent", title: "Log attendance: Advanced Algorithms", subtitle: "Log class log", icon: Clock },
];

export function CommandK() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const filteredItems = SEARCH_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      {/* Visual shortcut info label */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-between border border-border bg-card/50 hover:bg-card/80 transition-colors duration-200 px-3 py-1.5 rounded-lg text-xs text-muted-foreground w-48 shadow-sm cursor-pointer select-none"
      >
        <span className="flex items-center gap-1.5"><Search size={14} /> Search commands...</span>
        <kbd className="bg-secondary px-1.5 py-0.5 rounded border border-border text-[9px] font-mono">⌘K</kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/45 backdrop-blur-md"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative w-full max-w-lg border border-glass-border bg-card/90 dark:bg-card/75 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden z-10 m-4 flex flex-col"
            >
              {/* Input Header */}
              <div className="flex items-center px-4 py-3 border-b border-border gap-3">
                <Search className="text-muted-foreground" size={18} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a syllabus topic, note code, or AI trigger..."
                  className="flex-1 bg-transparent border-none text-foreground placeholder:text-muted-foreground outline-none text-sm ring-0"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[10px] bg-secondary px-1.5 py-0.5 rounded border border-border text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  ESC
                </button>
              </div>

              {/* Suggestions feed */}
              <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
                {filteredItems.length === 0 ? (
                  <div className="py-6 text-center text-xs text-muted-foreground">
                    No results found for &ldquo;{query}&rdquo;.
                  </div>
                ) : (
                  filteredItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setIsOpen(false)}
                        className="w-full text-left flex items-start gap-3 p-2.5 rounded-lg hover:bg-secondary/75 transition-colors duration-200 cursor-pointer group"
                      >
                        <div className="p-2 rounded bg-secondary/50 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors duration-200">
                          <Icon size={16} />
                        </div>
                        <div className="truncate flex-1">
                          <p className="text-xs font-semibold text-foreground">{item.title}</p>
                          <p className="text-[10px] text-muted-foreground">{item.subtitle}</p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Command Footer */}
              <div className="px-4 py-2 bg-secondary/25 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Use arrows to navigate, enter to run action</span>
                <span className="flex items-center gap-1">
                  <span>Categories:</span>
                  <span className="px-1 py-0.2 bg-secondary rounded border border-border text-[9px]">Notes</span>
                  <span className="px-1 py-0.2 bg-secondary rounded border border-border text-[9px]">AI</span>
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
