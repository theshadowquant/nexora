"use client";

import * as React from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { ArrowLeft, Sparkles, RefreshCw, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Card {
  id: string;
  front: string;
  back: string;
}

const MOCK_QUEUE: Card[] = [
  {
    id: "card-1",
    front: "What is Dijkstra's algorithm used for?",
    back: "It is a shortest-path algorithm that finds the shortest path from a single source node to all other nodes in a graph with non-negative edge weights.",
  },
  {
    id: "card-2",
    front: "Why does Dijkstra's algorithm fail on negative edge weights?",
    back: "Because it assumes once a vertex is marked visited, its shortest path estimate is finalized. Negative weights could yield a smaller path afterwards, violating this assumption.",
  },
  {
    id: "card-3",
    front: "Explain the relaxation step in shortest-path algorithms.",
    back: "Relaxation checks if the shortest path to vertex v can be improved by going through vertex u: if d[v] > d[u] + w(u,v), we update d[v] = d[u] + w(u,v).",
  },
];

export default function ReviewWorkspacePage() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [sessionFinished, setSessionFinished] = React.useState(false);
  const [history, setHistory] = React.useState<Array<{ id: string; rating: string }>>([]);

  const currentCard = MOCK_QUEUE[currentIndex];
  const progressPercent = Math.round((currentIndex / MOCK_QUEUE.length) * 100);

  const handleRating = (ratingLabel: "AGAIN" | "HARD" | "GOOD" | "EASY") => {
    setHistory((prev) => [...prev, { id: currentCard.id, rating: ratingLabel }]);
    setIsFlipped(false);

    setTimeout(() => {
      if (currentIndex + 1 >= MOCK_QUEUE.length) {
        setSessionFinished(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }, 200);
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col gap-6 select-none max-w-2xl mx-auto justify-between">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/mission-control/memory-forge/decks"
            className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h3 className="text-base font-bold font-heading tracking-tight leading-tight">
              Active Recall Session
            </h3>
            <p className="text-[10px] text-muted-foreground">
              Study Deck: Database Systems
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-muted-foreground">
          {currentIndex + 1} / {MOCK_QUEUE.length} cards
        </span>
      </div>

      {/* Progress tracker bar */}
      <div className="w-full bg-secondary h-1 rounded-full overflow-hidden shrink-0">
        <motion.div
          className="h-full bg-indigo-600"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex-1 flex flex-col justify-center py-6">
        <AnimatePresence mode="wait">
          {!sessionFinished ? (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="relative w-full aspect-[4/3] cursor-pointer"
              onClick={() => setIsFlipped(!isFlipped)}
              style={{ perspective: 1000 }}
            >
              {/* Card Container holding 3D faces */}
              <motion.div
                className="w-full h-full relative"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Front Side */}
                <div
                  className="absolute inset-0 bg-card border border-glass-border rounded-xl p-8 flex flex-col justify-between items-center text-center shadow-mdBack font-sans"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground">Concept Prompt</span>
                  <p className="text-sm font-semibold text-foreground max-w-md py-4">
                    {currentCard?.front}
                  </p>
                  <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                    <RefreshCw size={10} /> Click card to flip
                  </span>
                </div>

                {/* Back Side */}
                <div
                  className="absolute inset-0 bg-card border border-glass-border rounded-xl p-8 flex flex-col justify-between items-center text-center shadow-md font-sans"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <span className="text-[9px] uppercase font-bold tracking-wider text-primary">Consolidated Answer</span>
                  <p className="text-xs text-muted-foreground max-w-md leading-relaxed py-4">
                    {currentCard?.back}
                  </p>
                  <span className="text-[9px] text-muted-foreground">Click card to show prompt</span>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full aspect-[4/3] bg-card border border-glass-border rounded-xl p-8 flex flex-col justify-center items-center text-center gap-6 shadow-md"
            >
              <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <Trophy size={32} />
              </div>
              <div>
                <h4 className="font-heading font-extrabold text-base text-foreground">Session Complete!</h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm leading-relaxed">
                  Excellent work! You have finished studying all due cards in this queue. Your memory retention rating has been consolidated in Performance Hub.
                </p>
              </div>
              <Link href="/mission-control/memory-forge">
                <PremiumButton variant="primary" className="text-xs h-9">
                  Back to Dashboard
                </PremiumButton>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Spaced repetition rating controls */}
      <div className="h-20 shrink-0 border-t border-border/60 pt-4 bg-background">
        <AnimatePresence>
          {isFlipped && !sessionFinished && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="grid grid-cols-4 gap-3 w-full"
            >
              <PremiumButton
                variant="glass"
                className="border-red-500/20 hover:bg-red-500/5 text-red-500 text-xs py-2 h-10 flex flex-col justify-center items-center cursor-pointer"
                onClick={() => handleRating("AGAIN")}
              >
                <span>Again</span>
                <span className="text-[8px] opacity-75 font-normal">Reset</span>
              </PremiumButton>
              <PremiumButton
                variant="glass"
                className="border-amber-500/20 hover:bg-amber-500/5 text-amber-500 text-xs py-2 h-10 flex flex-col justify-center items-center cursor-pointer"
                onClick={() => handleRating("HARD")}
              >
                <span>Hard</span>
                <span className="text-[8px] opacity-75 font-normal">Slower</span>
              </PremiumButton>
              <PremiumButton
                variant="glass"
                className="border-indigo-500/20 hover:bg-indigo-500/5 text-indigo-500 text-xs py-2 h-10 flex flex-col justify-center items-center cursor-pointer"
                onClick={() => handleRating("GOOD")}
              >
                <span>Good</span>
                <span className="text-[8px] opacity-75 font-normal">Standard</span>
              </PremiumButton>
              <PremiumButton
                variant="primary"
                className="text-xs py-2 h-10 flex flex-col justify-center items-center cursor-pointer"
                onClick={() => handleRating("EASY")}
              >
                <span>Easy</span>
                <span className="text-[8px] opacity-90 font-normal">Faster</span>
              </PremiumButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
