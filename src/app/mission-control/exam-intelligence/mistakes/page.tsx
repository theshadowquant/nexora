"use client";

import * as React from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { PremiumButton } from "@/components/ui/PremiumButton";
import {
  ArrowLeft,
  BookOpen,
  RefreshCw,
  CheckCircle,
  HelpCircle,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";

interface MistakeItem {
  id: string;
  subjectCode: string;
  subjectName: string;
  questionText: string;
  wrongAnswer: string;
  correctAnswer: string;
  reason: "CONCEPTUAL" | "CALCULATION" | "CARELESS" | "SYNTAX";
  notesRecommendation: { id: string; name: string } | null;
  cardsRecommendation: { id: string; name: string } | null;
  resolved: boolean;
}

const INITIAL_MISTAKES: MistakeItem[] = [
  {
    id: "m-1",
    subjectCode: "21CS52",
    subjectName: "Computer Networks",
    questionText: "What is the primary constraint of Dijkstra's algorithm?",
    wrongAnswer: "Requires binary heaps",
    correctAnswer: "Fails on graphs with negative edge weights",
    reason: "CONCEPTUAL",
    notesRecommendation: { id: "note-cn-m3", name: "Routing Algorithms & IPv4 Protocol Note" },
    cardsRecommendation: { id: "deck-cn", name: "Computer Networks Flashcard Deck" },
    resolved: false,
  },
  {
    id: "m-2",
    subjectCode: "21CS51",
    subjectName: "Database Management Systems",
    questionText: "Calculate the total size in bytes of a block holding 4 key index records.",
    wrongAnswer: "1024",
    correctAnswer: "2048",
    reason: "CALCULATION",
    notesRecommendation: { id: "note-dbms-m1", name: "Relational Data Model Note" },
    cardsRecommendation: { id: "deck-dbms", name: "Database Systems Flashcard Deck" },
    resolved: false,
  },
];

export default function MistakesVaultPage() {
  const [mistakes, setMistakes] = React.useState<MistakeItem[]>(INITIAL_MISTAKES);

  const toggleResolve = (id: string) => {
    setMistakes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, resolved: !item.resolved } : item))
    );
  };

  return (
    <div className="space-y-8 select-none">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
          <Link href="/mission-control/exam-intelligence" className="hover:text-foreground flex items-center gap-1">
            <ArrowLeft size={12} /> Assessment Intelligence
          </Link>
          <span>/</span>
          <span className="text-foreground">Mistake Command Vault</span>
        </div>
        <h2 className="text-2xl font-bold font-heading tracking-tight text-foreground">
          Mistake Command Vault
        </h2>
        <p className="text-xs text-muted-foreground">
          Diagnosed study gaps, careless slips, code syntax bugs, and targeted revision shortcuts.
        </p>
      </div>

      {/* Mistakes list */}
      <div className="space-y-6">
        {mistakes.map((item) => (
          <GlassCard
            key={item.id}
            className={`border transition-all duration-200 ${
              item.resolved ? "border-emerald-500/20 bg-emerald-500/5 opacity-75" : "border-glass-border hover:border-border"
            }`}
          >
            <div className="p-6 flex flex-col justify-between gap-6">
              {/* Header metrics */}
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground font-semibold px-2 py-0.5 rounded bg-secondary border border-border">
                    {item.subjectCode}
                  </span>
                  <span className="text-[10px] text-muted-foreground ml-2 font-medium">
                    {item.subjectName}
                  </span>
                </div>

                <span
                  className={`text-[8px] px-1.5 py-0.5 rounded font-semibold border ${
                    item.reason === "CONCEPTUAL"
                      ? "bg-red-500/10 border-red-500/20 text-red-500"
                      : item.reason === "CALCULATION"
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                      : "bg-indigo-500/10 border-indigo-500/20 text-indigo-500"
                  }`}
                >
                  {item.reason} ERROR
                </span>
              </div>

              {/* QA Details */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-foreground leading-relaxed">
                  Question: {item.questionText}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-[11px] font-mono">
                  <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg text-red-500">
                    <span className="text-[8px] uppercase font-bold text-red-500 block mb-1">Your Answer</span>
                    {item.wrongAnswer}
                  </div>
                  <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-emerald-500">
                    <span className="text-[8px] uppercase font-bold text-emerald-500 block mb-1">Correct Answer</span>
                    {item.correctAnswer}
                  </div>
                </div>
              </div>

              {/* Recommendations Row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border/40 pt-4">
                <div className="flex flex-wrap gap-3">
                  {item.notesRecommendation && (
                    <Link href={`/mission-control/knowledge-vault/${item.notesRecommendation.id}`}>
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-primary hover:underline">
                        <BookOpen size={12} /> {item.notesRecommendation.name}
                      </div>
                    </Link>
                  )}
                  {item.cardsRecommendation && (
                    <Link href={`/mission-control/memory-forge/decks/${item.cardsRecommendation.id}/review`}>
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-primary hover:underline">
                        <RefreshCw size={12} /> {item.cardsRecommendation.name}
                      </div>
                    </Link>
                  )}
                </div>

                <PremiumButton
                  variant="glass"
                  onClick={() => toggleResolve(item.id)}
                  className="text-[10px] py-1.5 h-8 font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle size={12} className={item.resolved ? "text-emerald-500" : "text-muted-foreground"} />
                  {item.resolved ? "Mark Unresolved" : "Mark Resolved"}
                </PremiumButton>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
