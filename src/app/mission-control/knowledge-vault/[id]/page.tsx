"use client";

import * as React from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { SpotlightInput } from "@/components/ui/SpotlightInput";
import {
  ArrowLeft,
  Sparkles,
  Send,
  BookOpen,
  Bookmark,
  Share2,
  FileText,
  Minimize2,
  Maximize2,
  HelpCircle
} from "lucide-react";
import { motion } from "framer-motion";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  pageCitation?: number;
}

export default function DocumentWorkspacePage() {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [chatInput, setChatInput] = React.useState("");
  const [difficulty, setDifficulty] = React.useState<"EL5" | "Standard" | "Expert">("Standard");
  
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Hello Alex! I have fully indexed this module notes. How can I guide you today? You can select explanation difficulty using the toggle below.",
    },
  ]);

  const handleSend = () => {
    if (!chatInput.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: "user", text: chatInput };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    // Simulate AI citation response based on difficulty
    setTimeout(() => {
      let explanation = "";
      if (difficulty === "EL5") {
        explanation = "Dijkstra's algorithm is like finding the shortest path to different cities by letting water flow down all roads at the same speed. The city that gets wet first is the closest one [Page 4]!";
      } else if (difficulty === "Expert") {
        explanation = "Dijkstra's algorithm operates on a directed graph G=(V,E) with non-negative edge weights. It maintains a priority queue of vertices sorted by key values d[v], running in O(|E| + |V| log |V|) when implemented via Fibonacci Heaps [Page 4].";
      } else {
        explanation = "Dijkstra's algorithm calculates the shortest path from a single source node to all other nodes. It repeatedly selects the vertex with the minimum distance estimate, updates its neighbors (relaxation), and marks it visited [Page 4].";
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: explanation,
        pageCitation: 4,
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  };

  const handleSuggestion = (prompt: string) => {
    setChatInput(prompt);
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col gap-6 select-none">
      {/* Workspace Header metadata */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/mission-control/knowledge-vault"
            className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h3 className="text-base font-bold font-heading tracking-tight leading-tight">
              Routing Algorithms & IPv4 Protocol
            </h3>
            <p className="text-[10px] text-muted-foreground">
              Computer Networks (21CS52) • Module 3 • Prof. Rupert Giles
            </p>
          </div>
        </div>

        {/* Toolbar buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              isBookmarked
                ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
                : "bg-secondary/35 border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bookmark size={16} className={isBookmarked ? "fill-current" : ""} />
          </button>
          <button className="p-2 rounded-lg border bg-secondary/35 border-border text-muted-foreground hover:text-foreground cursor-pointer">
            <Share2 size={16} />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg border bg-secondary/35 border-border text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Split Screens Layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-hidden">
        {/* Left column: PDF Document Viewer */}
        <div className="flex-1 bg-card/65 border border-glass-border rounded-xl flex flex-col overflow-hidden min-h-[300px] lg:min-h-0">
          {/* Document Header panel */}
          <div className="h-10 border-b border-border bg-secondary/25 px-4 flex items-center justify-between text-xs text-muted-foreground shrink-0">
            <span className="flex items-center gap-1.5 font-semibold"><FileText size={14} /> cn-module-3-routing.pdf</span>
            <span>Page 4 of 24</span>
          </div>

          {/* Draggable Document viewport mockup */}
          <div className="flex-1 overflow-y-auto p-6 bg-secondary/15 flex flex-col items-center gap-8">
            {/* Visual Slide mockup representing Page 4 */}
            <div className="w-full max-w-2xl bg-card border border-border/80 shadow-md rounded-lg p-8 aspect-[4/3] flex flex-col justify-between relative group">
              <div className="flex justify-between items-start border-b border-border/40 pb-4">
                <div>
                  <p className="text-[10px] text-primary uppercase font-bold tracking-wider font-heading">Computer Networks</p>
                  <h4 className="text-base font-extrabold font-heading text-foreground tracking-tight mt-0.5">Dijkstra&apos;s Shortest Path Algorithm</h4>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">Slide 04</span>
              </div>

              {/* Slide content area */}
              <div className="flex-1 flex flex-col justify-center space-y-3 font-sans text-xs text-foreground leading-relaxed py-6">
                <p>• Given a graph $G = (V, E)$ and a source node $s \in V$:</p>
                <div className="p-3 bg-secondary/35 border border-border rounded-md font-mono text-[11px] text-indigo-500 dark:text-indigo-400">
                  Initialize: d[v] = ∞ for all v ≠ s, d[s] = 0, S = ∅
                </div>
                <p>• Iteratively choose a vertex $u \notin S$ with minimum estimate $d[u]$, add $u$ to $S$.</p>
                <p>• Relax adjacent edges: $d[v] = \min(d[v], d[u] + w(u,v))$.</p>
              </div>

              <div className="border-t border-border/40 pt-3 flex justify-between items-center text-[9px] text-muted-foreground font-medium">
                <span>VTU Curricular Syllabus • Module 3</span>
                <span>Page 4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: AI Mentor Conversation sidebar */}
        <div className="w-full lg:w-96 bg-card/65 border border-glass-border rounded-xl flex flex-col overflow-hidden shrink-0 h-[450px] lg:h-auto min-h-0">
          <div className="p-4 border-b border-border bg-secondary/15 flex items-center justify-between shrink-0">
            <h4 className="font-heading font-extrabold text-sm flex items-center gap-1.5">
              <Sparkles size={16} className="text-primary" /> AI Mentor Copilot
            </h4>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-semibold select-none">
              RAG INDEX READY
            </span>
          </div>

          {/* Chat Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] ${
                  msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                }`}
              >
                <div
                  className={`rounded-xl p-3 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/45 border border-border text-foreground"
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                {msg.pageCitation && (
                  <span className="text-[9px] text-primary hover:underline font-bold mt-1 cursor-pointer select-none">
                    Reference Slide: Slide {msg.pageCitation}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Quick chips Suggestions */}
          <div className="px-4 py-2 border-t border-border flex gap-1.5 overflow-x-auto scrollbar-none shrink-0 bg-secondary/10">
            <button
              onClick={() => handleSuggestion("Summarize slide 4 parameters")}
              className="px-2.5 py-1 rounded bg-card border border-border hover:bg-secondary text-[9px] font-semibold text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
            >
              Summarize slide 4
            </button>
            <button
              onClick={() => handleSuggestion("Explain Dijkstra relaxation steps")}
              className="px-2.5 py-1 rounded bg-card border border-border hover:bg-secondary text-[9px] font-semibold text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
            >
              Explain relaxation
            </button>
          </div>

          {/* Difficulty Toggles & Input controls */}
          <div className="p-4 border-t border-border bg-card/90 space-y-3 shrink-0">
            {/* Difficulty slider */}
            <div className="flex items-center justify-between gap-2 border border-border rounded-lg p-1 bg-secondary/20 text-[10px]">
              <span className="text-muted-foreground pl-2 flex items-center gap-1">
                <HelpCircle size={12} /> Explain depth:
              </span>
              <div className="flex gap-1">
                {(["EL5", "Standard", "Expert"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setDifficulty(lvl)}
                    className={`px-2 py-1 rounded font-semibold cursor-pointer transition-colors ${
                      difficulty === lvl
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Message input */}
            <div className="flex items-center gap-2">
              <SpotlightInput
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about equations, formulas, concepts..."
                className="pr-10"
                containerClassName="flex-1"
              />
              <PremiumButton
                variant="primary"
                onClick={handleSend}
                className="w-9 h-9 p-0 rounded-lg flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Send size={16} />
              </PremiumButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
