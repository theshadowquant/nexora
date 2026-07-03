"use client";

import * as React from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { PremiumButton } from "@/components/ui/PremiumButton";
import {
  ArrowLeft,
  Sparkles,
  TrendingUp,
  DollarSign,
  Cpu,
  Activity,
  CheckCircle,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  ThumbsUp,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";

interface FlagItem {
  key: string;
  status: "ON" | "OFF" | "BETA" | "INTERNAL";
  description: string;
}

const INITIAL_FLAGS: FlagItem[] = [
  { key: "AI_MENTOR", status: "ON", description: "RAG citation tutor sidebar active inside notes views." },
  { key: "FLASHCARDS", status: "ON", description: "Spaced repetition SM-2 flashcard generator loops." },
  { key: "EXAM_INTELLIGENCE", status: "INTERNAL", description: "Subject mastery analytics, timers and mock simulators (internal only)." },
];

export default function AdminAnalyticsPage() {
  const [flags, setFlags] = React.useState<FlagItem[]>(INITIAL_FLAGS);

  const toggleFlag = (key: string) => {
    setFlags((prev) =>
      prev.map((flag) => {
        if (flag.key === key) {
          const nextStatusMap: Record<string, FlagItem["status"]> = {
            ON: "OFF",
            OFF: "BETA",
            BETA: "INTERNAL",
            INTERNAL: "ON",
          };
          return { ...flag, status: nextStatusMap[flag.status] };
        }
        return flag;
      })
    );
  };

  return (
    <div className="space-y-8 select-none">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
          <Link href="/mission-control" className="hover:text-foreground flex items-center gap-1">
            <ArrowLeft size={12} /> Mission Control
          </Link>
          <span>/</span>
          <span className="text-foreground">Admin Observatory</span>
        </div>
        <h2 className="text-2xl font-bold font-heading tracking-tight text-foreground">
          AI Cost & Observability
        </h2>
        <p className="text-xs text-muted-foreground">
          Audit OpenAI token rates, track system execution latency, evaluate feature flags, and view RAG feedback loops.
        </p>
      </div>

      {/* Observability Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-5 border border-glass-border">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] uppercase font-bold tracking-wider">Accumulated Cost</span>
            <DollarSign size={16} className="text-primary" />
          </div>
          <p className="text-3xl font-extrabold font-heading tracking-tighter mt-2 text-foreground">
            $1.4258
          </p>
          <div className="text-[9px] text-muted-foreground mt-2 flex items-center gap-1">
            <TrendingUp size={12} className="text-emerald-500" />
            <span className="text-emerald-500 font-semibold">+8.4%</span> since yesterday
          </div>
        </GlassCard>

        <GlassCard className="p-5 border border-glass-border">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] uppercase font-bold tracking-wider">Total LLM Calls</span>
            <Cpu size={16} className="text-indigo-500" />
          </div>
          <p className="text-3xl font-extrabold font-heading tracking-tighter mt-2 text-foreground">
            184
          </p>
          <div className="text-[9px] text-muted-foreground mt-2 font-semibold">
            Avg. 1.2M monthly volume scope
          </div>
        </GlassCard>

        <GlassCard className="p-5 border border-glass-border">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] uppercase font-bold tracking-wider">Average Latency</span>
            <Activity size={16} className="text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold font-heading tracking-tighter mt-2 text-foreground">
            780ms
          </p>
          <div className="text-[9px] text-muted-foreground mt-2 font-semibold">
            OpenAI API chat completions metrics
          </div>
        </GlassCard>

        <GlassCard className="p-5 border border-glass-border">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] uppercase font-bold tracking-wider">Embedding Cache Hits</span>
            <CheckCircle size={16} className="text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold font-heading tracking-tighter mt-2 text-foreground">
            84.2%
          </p>
          <div className="text-[9px] text-muted-foreground mt-2 font-semibold">
            Local vector chunk retrieval savings
          </div>
        </GlassCard>
      </div>

      {/* Main Grid Splitting: Flags vs. Feedback Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Feature flag configs */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="border border-glass-border p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                Feature Flag Rollouts
              </h3>

              <div className="divide-y divide-border/60">
                {flags.map((flag) => (
                  <div key={flag.key} className="py-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground font-heading font-mono">{flag.key}</span>
                        <span
                          className={`text-[8px] px-1.5 py-0.5 rounded font-semibold select-none border ${
                            flag.status === "ON"
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                              : flag.status === "OFF"
                              ? "bg-red-500/10 border-red-500/20 text-red-500"
                              : flag.status === "BETA"
                              ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-500"
                              : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                          }`}
                        >
                          {flag.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 max-w-lg leading-relaxed">
                        {flag.description}
                      </p>
                    </div>

                    <PremiumButton
                      variant="glass"
                      onClick={() => toggleFlag(flag.key)}
                      className="text-[10px] py-1.5 h-8 font-semibold shrink-0 cursor-pointer"
                    >
                      Cycle Status
                    </PremiumButton>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Model rates table */}
          <GlassCard className="border border-glass-border p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              LLM Model Pricing Breakdown
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-muted-foreground">
                <thead className="text-[10px] uppercase font-bold text-muted-foreground/80 border-b border-border/80 pb-2">
                  <tr>
                    <th className="py-2">Model</th>
                    <th className="py-2">Calls</th>
                    <th className="py-2">Input Tokens</th>
                    <th className="py-2">Output Tokens</th>
                    <th className="py-2">Calculated USD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-mono text-[11px] text-foreground">
                  <tr className="hover:bg-secondary/10">
                    <td className="py-2.5 font-bold font-sans">gpt-4o-mini</td>
                    <td className="py-2.5">142</td>
                    <td className="py-2.5">384,120</td>
                    <td className="py-2.5">192,400</td>
                    <td className="py-2.5 text-indigo-500 font-bold">$0.1730</td>
                  </tr>
                  <tr className="hover:bg-secondary/10">
                    <td className="py-2.5 font-bold font-sans">text-embedding-3-small</td>
                    <td className="py-2.5">42</td>
                    <td className="py-2.5">84,000</td>
                    <td className="py-2.5">0</td>
                    <td className="py-2.5 text-indigo-500 font-bold">$0.00168</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: RAG Feedback Logs (1 col) */}
        <div>
          <GlassCard className="border border-glass-border p-6 flex flex-col justify-between h-fit">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <ThumbsUp className="text-primary" size={18} />
                <h4 className="font-heading font-extrabold text-sm text-foreground">Student RAG Feedback</h4>
              </div>

              {/* Feed logs */}
              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-border bg-secondary/15 space-y-1.5">
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="font-bold text-foreground">Alex M. • DBMS Deck</span>
                    <span className="text-red-500 font-semibold flex items-center gap-1"><AlertTriangle size={10} /> WRONG</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-normal font-sans">
                    &quot;Card definition on relational integrity constraint doesn&apos;t mention entity integrity rules [Page 5].&quot;
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-border bg-secondary/15 space-y-1.5">
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="font-bold text-foreground">Clara O. • CN Slide 4</span>
                    <span className="text-emerald-500 font-semibold">HELPFUL</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-normal font-sans">
                    &quot;AI Mentor correctly citation referenced routing table configuration steps.&quot;
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
