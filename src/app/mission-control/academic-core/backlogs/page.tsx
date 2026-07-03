"use client";

import * as React from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  ArrowLeft,
  AlertTriangle,
  Play,
  TrendingUp,
  Award
} from "lucide-react";
import { PremiumButton } from "@/components/ui/PremiumButton";

interface BacklogItem {
  id: string;
  subjectCode: string;
  subjectName: string;
  credits: number;
  targetSemester: number;
  isCleared: boolean;
  priority: "HIGH" | "MEDIUM" | "LOW";
  recommendedHoursPerWeek: number;
}

const MOCK_BACKLOGS: BacklogItem[] = [
  {
    id: "bl-1",
    subjectCode: "21CS41",
    subjectName: "Design and Analysis of Algorithms (DAA)",
    credits: 4,
    targetSemester: 6,
    isCleared: false,
    priority: "HIGH",
    recommendedHoursPerWeek: 4,
  },
];

export default function BacklogsTrackerPage() {
  return (
    <div className="space-y-8 select-none">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
          <Link href="/mission-control/academic-core" className="hover:text-foreground flex items-center gap-1">
            <ArrowLeft size={12} /> Academic Command Center
          </Link>
          <span>/</span>
          <span className="text-foreground">Backlog Vault</span>
        </div>
        <h2 className="text-2xl font-bold font-heading tracking-tight text-foreground">
          Uncleared Backlogs Vault
        </h2>
        <p className="text-xs text-muted-foreground">
          Track outstanding backlog courses and view AI study recovery strategies to clear them next semester.
        </p>
      </div>

      {/* Backlogs Cards Grid */}
      <div className="space-y-6">
        {MOCK_BACKLOGS.map((item) => (
          <GlassCard key={item.id} className="border border-glass-border p-6 flex flex-col justify-between gap-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground font-semibold px-2 py-0.5 rounded bg-secondary border border-border">
                  {item.subjectCode}
                </span>
                <span className="text-xs font-bold text-foreground font-heading ml-2">{item.subjectName}</span>
              </div>

              <span
                className={`text-[8px] px-1.5 py-0.5 rounded font-semibold border ${
                  item.priority === "HIGH"
                    ? "bg-red-500/10 border-red-500/20 text-red-500"
                    : "bg-indigo-500/10 border-indigo-500/20 text-indigo-500"
                }`}
              >
                {item.priority} PRIORITY
              </span>
            </div>

            {/* Recovery advice */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-muted-foreground leading-normal">
              <div className="p-4 rounded-xl border border-border bg-secondary/15 space-y-1">
                <span className="text-[8px] uppercase font-bold text-muted-foreground tracking-wider block">Course Credits</span>
                <span className="text-sm font-extrabold text-foreground block">{item.credits} Credits</span>
              </div>

              <div className="p-4 rounded-xl border border-border bg-secondary/15 space-y-1">
                <span className="text-[8px] uppercase font-bold text-muted-foreground tracking-wider block">Target Semester</span>
                <span className="text-sm font-extrabold text-foreground block">Semester {item.targetSemester} Exam</span>
              </div>

              <div className="p-4 rounded-xl border border-border bg-secondary/15 space-y-1">
                <span className="text-[8px] uppercase font-bold text-muted-foreground tracking-wider block">Study Routine</span>
                <span className="text-sm font-extrabold text-foreground block">{item.recommendedHoursPerWeek} hrs / week</span>
              </div>
            </div>

            {/* Study deck mapping redirection */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border/40 pt-4">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <AlertTriangle size={14} className="text-amber-500" />
                <span>Clearance requires matching threshold grades. We recommend linking study routine items.</span>
              </div>

              <Link href="/mission-control/memory-forge/decks">
                <PremiumButton variant="primary" className="text-xs h-8 py-1 px-3 flex items-center gap-1.5 cursor-pointer">
                  <Award size={12} /> Open Flashcards Decks
                </PremiumButton>
              </Link>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
