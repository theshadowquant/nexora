"use client";

import * as React from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { PremiumButton } from "@/components/ui/PremiumButton";
import {
  Sparkles,
  ArrowLeft,
  X,
  FileText,
  Bookmark,
  Layers,
  ChevronRight,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Deck {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  cardCount: number;
  dueCount: number;
  description: string;
}

const MOCK_DECKS: Deck[] = [
  {
    id: "deck-dbms",
    title: "Database Systems Deck",
    subjectCode: "21CS51",
    subjectName: "Database Management Systems",
    cardCount: 24,
    dueCount: 8,
    description: "Keys, integrity constraints, indexing strategies, functional dependencies, and normal forms.",
  },
  {
    id: "deck-cn",
    title: "Computer Networks Deck",
    subjectCode: "21CS52",
    subjectName: "Computer Networks",
    cardCount: 15,
    dueCount: 10,
    description: "Layers properties, routing algorithms, network security models, TCP/UDP headers and parameters.",
  },
];

export default function DecksBrowserPage() {
  const [isGenerateOpen, setIsGenerateOpen] = React.useState(false);
  const [selectedNote, setSelectedNote] = React.useState<string>("");
  const [cardCount, setCardCount] = React.useState(5);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerate = () => {
    if (!selectedNote) return;
    setIsGenerating(true);
    // Simulate API compile times
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerateOpen(false);
      // Mock success callback
    }, 2000);
  };

  return (
    <div className="space-y-8 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Link href="/mission-control/memory-forge" className="hover:text-foreground flex items-center gap-1">
              <ArrowLeft size={12} /> Memory Forge
            </Link>
            <span>/</span>
            <span className="text-foreground">Decks Vault</span>
          </div>
          <h2 className="text-2xl font-bold font-heading tracking-tight text-foreground">
            Study Decks
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage subject study cards and configure active recall metrics.
          </p>
        </div>

        <PremiumButton
          variant="primary"
          className="flex items-center gap-2 text-xs py-2 h-9 self-start sm:self-auto"
          onClick={() => setIsGenerateOpen(true)}
        >
          <Plus size={14} /> Forge AI Decks
        </PremiumButton>
      </div>

      {/* Grid of Decks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_DECKS.map((deck) => (
          <GlassCard key={deck.id} className="h-64 flex flex-col justify-between border border-glass-border">
            <div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold mb-2">
                <span className="px-2 py-0.5 rounded bg-secondary border border-border">
                  {deck.subjectCode}
                </span>
                <span className="flex items-center gap-1"><Layers size={10} /> {deck.cardCount} cards</span>
              </div>
              <h3 className="text-sm font-bold text-foreground font-heading leading-tight truncate">
                {deck.title}
              </h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {deck.subjectName}
              </p>
              <p className="text-xs text-muted-foreground mt-3 line-clamp-3 leading-relaxed">
                {deck.description}
              </p>
            </div>

            <div className="pt-3 border-t border-border flex items-center gap-3">
              <Link href={`/mission-control/memory-forge/decks/${deck.id}/review`} className="flex-1">
                <PremiumButton variant="primary" className="w-full text-xs py-1.5 h-8 flex items-center justify-center gap-1">
                  Start Study {deck.dueCount > 0 && `(${deck.dueCount} due)`}
                </PremiumButton>
              </Link>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Forge AI Deck Overlay Modal */}
      <AnimatePresence>
        {isGenerateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isGenerating && setIsGenerateOpen(false)}
              className="fixed inset-0 bg-background/55 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="relative w-full max-w-md border border-glass-border bg-card/85 dark:bg-card/75 backdrop-blur-xl rounded-xl shadow-2xl p-6 overflow-hidden z-10 flex flex-col gap-5"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-heading font-extrabold text-base flex items-center gap-2">
                  <Sparkles size={18} className="text-primary" /> Forge AI Flashcards
                </h3>
                <button
                  onClick={() => !isGenerating && setIsGenerateOpen(false)}
                  className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
                  disabled={isGenerating}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Note Selection */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Select Source Note</label>
                <div className="relative rounded-lg border border-border p-1 bg-secondary/10">
                  <select
                    value={selectedNote}
                    onChange={(e) => setSelectedNote(e.target.value)}
                    className="w-full bg-transparent border-0 text-xs px-2 py-1.5 text-foreground outline-none cursor-pointer focus:ring-0"
                    disabled={isGenerating}
                  >
                    <option value="" className="bg-card">-- Choose parsed note --</option>
                    <option value="note-1" className="bg-card">Relational Data Model & ER Diagrams (DBMS)</option>
                    <option value="note-2" className="bg-card">Routing Algorithms & IPv4 Protocol (CN)</option>
                  </select>
                </div>
              </div>

              {/* Slider for count selection */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  <span>Number of cards</span>
                  <span className="text-primary">{cardCount} Cards</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="3"
                    max="10"
                    value={cardCount}
                    onChange={(e) => setCardCount(parseInt(e.target.value))}
                    className="flex-1 accent-indigo-600 h-1 rounded-lg cursor-pointer bg-secondary"
                    disabled={isGenerating}
                  />
                </div>
              </div>

              <div className="p-3 rounded bg-secondary/15 border border-border flex items-start gap-2.5 text-[10px] text-muted-foreground leading-normal">
                <FileText size={14} className="text-primary shrink-0 mt-0.5" />
                <span>
                  Uses context blocks from the selected PDF notes to synthesize conceptual active-recall flashcard queries.
                </span>
              </div>

              <div className="flex gap-2 justify-end border-t border-border pt-4">
                <PremiumButton variant="glass" className="text-xs h-9" onClick={() => setIsGenerateOpen(false)} disabled={isGenerating}>
                  Cancel
                </PremiumButton>
                <PremiumButton variant="primary" className="text-xs h-9" onClick={handleGenerate} isLoading={isGenerating}>
                  {isGenerating ? "Forging Cards..." : "Forge Deck"}
                </PremiumButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
