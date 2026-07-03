"use client";

import * as React from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { PremiumButton } from "@/components/ui/PremiumButton";
import {
  Brain,
  Zap,
  TrendingUp,
  Sparkles,
  Play,
  Layers,
  ArrowLeft,
  Calendar,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

export default function MemoryForgeDashboard() {
  // Generate dummy review density data for retention heatmap (28 days)
  const heatmapData = Array.from({ length: 28 }, (_, i) => {
    // Random counts to simulate reviews completed
    const counts = [0, 4, 12, 8, 0, 16, 22, 5, 0, 8, 14, 0, 6, 18, 25, 0, 4, 10, 15, 0, 8, 12, 0, 9, 20, 32, 10, 0];
    return {
      day: i + 1,
      count: counts[i % counts.length],
    };
  });

  return (
    <div className="space-y-8 select-none">
      {/* Navigation Headers */}
      <div>
        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
          <Link href="/mission-control" className="hover:text-foreground flex items-center gap-1">
            <ArrowLeft size={12} /> Mission Control
          </Link>
          <span>/</span>
          <span className="text-foreground">Memory Forge</span>
        </div>
        <h2 className="text-2xl font-bold font-heading tracking-tight text-foreground">
          Memory Forge
        </h2>
        <p className="text-xs text-muted-foreground">
          Active recall flashcards, spaced repetition schedules (SM-2), and memory retention analytics.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-5 border border-glass-border">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] uppercase font-bold tracking-wider">Retention Rate</span>
            <Brain size={16} className="text-primary" />
          </div>
          <p className="text-3xl font-extrabold font-heading tracking-tighter mt-2 text-foreground">
            92.4%
          </p>
          <div className="text-[9px] text-muted-foreground mt-2 flex items-center gap-1">
            <TrendingUp size={12} className="text-emerald-500" />
            <span className="text-emerald-500 font-semibold">+1.8%</span> since last week
          </div>
        </GlassCard>

        <GlassCard className="p-5 border border-glass-border">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] uppercase font-bold tracking-wider">Pending Reviews</span>
            <Zap size={16} className="text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold font-heading tracking-tighter mt-2 text-amber-500">
            18 Cards
          </p>
          <div className="text-[9px] text-muted-foreground mt-2 font-semibold">
            Due in 2 active decks
          </div>
        </GlassCard>

        <GlassCard className="p-5 border border-glass-border">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] uppercase font-bold tracking-wider">Mastered Items</span>
            <Layers size={16} className="text-primary" />
          </div>
          <p className="text-3xl font-extrabold font-heading tracking-tighter mt-2 text-foreground">
            64 Cards
          </p>
          <div className="text-[9px] text-muted-foreground mt-2 font-semibold">
            Intervals &gt; 21 days (SM-2)
          </div>
        </GlassCard>

        <GlassCard className="p-5 border border-glass-border">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] uppercase font-bold tracking-wider">Daily Velocity</span>
            <Calendar size={16} className="text-primary" />
          </div>
          <p className="text-3xl font-extrabold font-heading tracking-tighter mt-2 text-foreground">
            32 / day
          </p>
          <div className="text-[9px] text-muted-foreground mt-2 font-semibold">
            Average reviews completed daily
          </div>
        </GlassCard>
      </div>

      {/* Main content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Heatmap and Stats (Takes 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Retention Heatmap */}
          <GlassCard className="border border-glass-border flex flex-col justify-between p-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                Memory Consolidation Heatmap
              </h3>
              
              {/* Heat grid layout */}
              <div className="flex flex-wrap gap-1.5 py-2">
                {heatmapData.map((data) => {
                  let colorClass = "bg-secondary/20 border border-border/10";
                  if (data.count > 0 && data.count <= 6) colorClass = "bg-indigo-600/20 border border-indigo-500/10";
                  else if (data.count > 6 && data.count <= 15) colorClass = "bg-indigo-600/40 border border-indigo-500/20";
                  else if (data.count > 15 && data.count <= 25) colorClass = "bg-indigo-600/70 border border-indigo-500/30";
                  else if (data.count > 25) colorClass = "bg-indigo-600 border border-indigo-500/40 shadow-sm shadow-indigo-600/10";

                  return (
                    <div
                      key={data.day}
                      className={`w-7 h-7 rounded flex items-center justify-center text-[9px] font-mono transition-colors duration-200 ${colorClass}`}
                      title={`${data.count} reviews completed`}
                    >
                      {data.count > 0 ? data.count : ""}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-muted-foreground border-t border-border pt-4 mt-6">
              <span>Grid displays reviews completed over the last 28 days</span>
              <span className="flex items-center gap-1">
                Less <span className="w-2.5 h-2.5 rounded bg-secondary/20" />
                <span className="w-2.5 h-2.5 rounded bg-indigo-600/30" />
                <span className="w-2.5 h-2.5 rounded bg-indigo-600/70" />
                <span className="w-2.5 h-2.5 rounded bg-indigo-600" /> More
              </span>
            </div>
          </GlassCard>

          {/* Decks shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <GlassCard className="p-6 border border-glass-border hover:border-indigo-500/25 transition-all duration-200">
              <h4 className="text-sm font-bold font-heading text-foreground tracking-tight">Database Systems Deck</h4>
              <p className="text-[10px] text-muted-foreground mt-0.5">21CS51 • 24 Flashcards</p>
              <p className="text-xs text-muted-foreground mt-4 leading-relaxed line-clamp-2">
                Relational keys, joins, index allocations, normalization templates.
              </p>
              <div className="flex gap-2 mt-6">
                <Link href="/mission-control/memory-forge/decks/deck-dbms/review" className="flex-1">
                  <PremiumButton variant="primary" className="w-full text-xs py-1.5 h-8 flex items-center gap-1.5">
                    <Play size={12} className="fill-current" /> Start Study (8 due)
                  </PremiumButton>
                </Link>
              </div>
            </GlassCard>

            <GlassCard className="p-6 border border-glass-border hover:border-indigo-500/25 transition-all duration-200">
              <h4 className="text-sm font-bold font-heading text-foreground tracking-tight">Computer Networks Deck</h4>
              <p className="text-[10px] text-muted-foreground mt-0.5">21CS52 • 15 Flashcards</p>
              <p className="text-xs text-muted-foreground mt-4 leading-relaxed line-clamp-2">
                ISO OSI layer parameters, IP calculations, routing states.
              </p>
              <div className="flex gap-2 mt-6">
                <Link href="/mission-control/memory-forge/decks/deck-cn/review" className="flex-1">
                  <PremiumButton variant="primary" className="w-full text-xs py-1.5 h-8 flex items-center gap-1.5">
                    <Play size={12} className="fill-current" /> Start Study (10 due)
                  </PremiumButton>
                </Link>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Right Column: AI Insights & Recommendation (1 col) */}
        <div className="space-y-6">
          <GlassCard className="border border-glass-border p-6 flex flex-col justify-between h-fit">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Sparkles className="text-primary" size={18} />
                <h4 className="font-heading font-extrabold text-sm text-foreground">Memory Insights</h4>
              </div>

              {/* Insights list */}
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-muted-foreground leading-normal">
                  <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    Your retention on **Dijkstra&apos;s shortest path** concept has decayed to **64%**. We recommend starting the queue immediately.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-muted-foreground leading-normal">
                  <AlertCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    Great job! You have fully consolidated all **normalization keys** concepts. Next recall is scheduled in 18 days.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border space-y-3">
              <Link href="/mission-control/memory-forge/decks">
                <PremiumButton variant="glass" className="w-full text-xs py-2 h-9 flex items-center justify-center gap-1">
                  Browse Decks Vault
                </PremiumButton>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
