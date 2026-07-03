"use client";

import * as React from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { PremiumButton } from "@/components/ui/PremiumButton";
import {
  Trophy,
  Zap,
  TrendingUp,
  Brain,
  AlertCircle,
  Play,
  ArrowRight,
  Target,
  Clock,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";

interface MasteryNode {
  name: string;
  score: number;
  status: "STRONG" | "WEAK" | "AVERAGE";
}

const MOCK_NODES: MasteryNode[] = [
  { name: "IPv4 Headers & Protocols", score: 91, status: "STRONG" },
  { name: "Dijkstra Dijkstra's Paths", score: 42, status: "WEAK" },
  { name: "Normal Forms (1NF-BCNF)", score: 86, status: "STRONG" },
  { name: "Relational Mapping Rules", score: 72, status: "AVERAGE" },
];

export default function AssessmentDashboard() {
  return (
    <div className="space-y-8 select-none">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
          <Link href="/mission-control" className="hover:text-foreground flex items-center gap-1">
            <ArrowLeft size={12} /> Mission Control
          </Link>
          <span>/</span>
          <span className="text-foreground">Assessment Intelligence</span>
        </div>
        <h2 className="text-2xl font-bold font-heading tracking-tight text-foreground">
          Assessment Intelligence
        </h2>
        <p className="text-xs text-muted-foreground">
          Adaptive testing, automated VTU simulator sessions, and concept mastery diagnostics.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-5 border border-glass-border">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] uppercase font-bold tracking-wider">Estimated VTU Score</span>
            <Trophy size={16} className="text-primary" />
          </div>
          <p className="text-3xl font-extrabold font-heading tracking-tighter mt-2 text-foreground">
            86.4%
          </p>
          <div className="text-[9px] text-muted-foreground mt-2 flex items-center gap-1">
            <TrendingUp size={12} className="text-emerald-500" />
            <span className="text-emerald-500 font-semibold">+3.2%</span> based on 4 mock cycles
          </div>
        </GlassCard>

        <GlassCard className="p-5 border border-glass-border">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] uppercase font-bold tracking-wider">Passing Probability</span>
            <Target size={16} className="text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold font-heading tracking-tighter mt-2 text-emerald-500">
            99.2%
          </p>
          <div className="text-[9px] text-muted-foreground mt-2 font-semibold">
            Confident bounds threshold matched
          </div>
        </GlassCard>

        <GlassCard className="p-5 border border-glass-border">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] uppercase font-bold tracking-wider">Unresolved Mistakes</span>
            <AlertCircle size={16} className="text-red-500" />
          </div>
          <p className="text-3xl font-extrabold font-heading tracking-tighter mt-2 text-red-500">
            5 Items
          </p>
          <div className="text-[9px] text-muted-foreground mt-2 font-semibold">
            4 calculation errors logged
          </div>
        </GlassCard>

        <GlassCard className="p-5 border border-glass-border">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] uppercase font-bold tracking-wider">Testing Speed</span>
            <Clock size={16} className="text-primary" />
          </div>
          <p className="text-3xl font-extrabold font-heading tracking-tighter mt-2 text-foreground">
            42s / q
          </p>
          <div className="text-[9px] text-muted-foreground mt-2 font-semibold">
            12% faster than class average
          </div>
        </GlassCard>
      </div>

      {/* Main split dashboard view */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Knowledge Nodes & Simulator lists (takes 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Knowledge Nodes Graph Panel */}
          <GlassCard className="border border-glass-border p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Concept Mastery Knowledge Graph
            </h3>

            {/* List representing nodes in the graph */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOCK_NODES.map((node) => (
                <div
                  key={node.name}
                  className="p-4 rounded-xl border border-border bg-secondary/15 flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-xs font-bold text-foreground font-heading">{node.name}</span>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="w-24 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={`h-full ${
                            node.status === "STRONG"
                              ? "bg-emerald-500"
                              : node.status === "WEAK"
                              ? "bg-red-500"
                              : "bg-indigo-500"
                          }`}
                          style={{ width: `${node.score}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono font-semibold">{node.score}%</span>
                    </div>
                  </div>

                  <span
                    className={`text-[8px] px-1.5 py-0.5 rounded font-semibold border ${
                      node.status === "STRONG"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                        : node.status === "WEAK"
                        ? "bg-red-500/10 border-red-500/20 text-red-500"
                        : "bg-indigo-500/10 border-indigo-500/20 text-indigo-500"
                    }`}
                  >
                    {node.status}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Active Simulators list */}
          <GlassCard className="border border-glass-border p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Active Assessment Simulators
            </h3>

            <div className="divide-y divide-border/60">
              <div className="py-4 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-foreground font-heading">Computer Networks VTU Practice Simulator</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">MCQ + Coding • 10 Questions • 30 mins</p>
                </div>
                <Link href="/mission-control/exam-intelligence/session/session-cn-sim">
                  <PremiumButton variant="primary" className="text-xs py-1.5 h-8 flex items-center gap-1.5">
                    <Play size={12} className="fill-current" /> Launch Simulator
                  </PremiumButton>
                </Link>
              </div>

              <div className="py-4 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-foreground font-heading">DBMS Semester Mock Assessment</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">MCQ • 20 Questions • 45 mins</p>
                </div>
                <Link href="/mission-control/exam-intelligence/session/session-dbms-sim">
                  <PremiumButton variant="primary" className="text-xs py-1.5 h-8 flex items-center gap-1.5">
                    <Play size={12} className="fill-current" /> Launch Simulator
                  </PremiumButton>
                </Link>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right column: Adaptive Quick actions & mistakes redirection (1 col) */}
        <div className="space-y-6">
          <GlassCard className="border border-glass-border p-6 flex flex-col justify-between h-fit gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Sparkles className="text-primary" size={18} />
                <h4 className="font-heading font-extrabold text-sm text-foreground">AI Daily Predictions</h4>
              </div>

              <div className="space-y-3 text-xs text-muted-foreground leading-normal">
                <div className="flex items-start gap-2.5">
                  <Zap size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    Your score on **Dijkstra paths** has remained below average (42%). We recommend starting an adaptive quick quiz focused on Dijkstra edge properties.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-3">
              <Link href="/mission-control/exam-intelligence/mistakes" className="block">
                <PremiumButton variant="glass" className="w-full text-xs py-2 h-9 flex items-center justify-center gap-1.5">
                  Mistake Command Vault <ArrowRight size={14} />
                </PremiumButton>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
