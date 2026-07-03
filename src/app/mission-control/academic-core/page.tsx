"use client";

import * as React from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { PremiumButton } from "@/components/ui/PremiumButton";
import {
  Calendar,
  AlertTriangle,
  CheckCircle,
  GraduationCap,
  Users,
  Compass,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  Settings,
  HelpCircle,
  Play
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TimetableSlot {
  time: string;
  subjectCode: string;
  subjectName: string;
  classroom: string;
  faculty: string;
  meetingLink: string;
  color: string;
}

const MOCK_TIMETABLE: TimetableSlot[] = [
  {
    time: "09:00 - 09:55",
    subjectCode: "21CS51",
    subjectName: "Database Systems",
    classroom: "L-304",
    faculty: "Dr. Clara Oswald",
    meetingLink: "https://meet.google.com/abc",
    color: "#6366f1",
  },
  {
    time: "10:00 - 10:55",
    subjectCode: "21CS52",
    subjectName: "Computer Networks",
    classroom: "L-201",
    faculty: "Prof. Rupert Giles",
    meetingLink: "https://meet.google.com/xyz",
    color: "#a855f7",
  },
];

export default function AcademicCommandCenter() {
  const [selectedStrategy, setSelectedStrategy] = React.useState<"VTU" | "NEP">("VTU");
  const [simulatedSkip, setSimulatedSkip] = React.useState<boolean | null>(null);

  // Math variables
  const present = 15;
  const total = 18;
  const currentAttendance = Math.round((present / total) * 100);

  // Predict skip result
  const skipTotal = total + 1;
  const skipPercentage = Math.round((present / skipTotal) * 100);
  const skipSafe = skipPercentage >= 75.0;

  return (
    <div className="space-y-8 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Link href="/mission-control" className="hover:text-foreground flex items-center gap-1">
              <ArrowLeft size={12} /> Mission Control
            </Link>
            <span>/</span>
            <span className="text-foreground">Academic Command Center</span>
          </div>
          <h2 className="text-2xl font-bold font-heading tracking-tight text-foreground">
            Academic Command Center
          </h2>
          <p className="text-xs text-muted-foreground">
            Grade trackers, active terms timetable coordinates, and predictive attendance risk simulations.
          </p>
        </div>

        {/* Strategy Toggles */}
        <div className="flex gap-1 border border-border rounded-lg p-1 bg-secondary/20 text-[10px] self-start sm:self-auto shrink-0 h-9 items-center">
          <span className="text-muted-foreground px-2 font-medium">Grading System:</span>
          {(["VTU", "NEP"] as const).map((strat) => (
            <button
              key={strat}
              onClick={() => setSelectedStrategy(strat)}
              className={`px-2.5 py-1 rounded font-semibold cursor-pointer transition-colors ${
                selectedStrategy === strat
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {strat}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-5 border border-glass-border">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] uppercase font-bold tracking-wider">Cumulative CGPA</span>
            <GraduationCap size={16} className="text-primary" />
          </div>
          <p className="text-3xl font-extrabold font-heading tracking-tighter mt-2 text-foreground">
            {selectedStrategy === "VTU" ? "8.65 / 10" : "8.80 / 10"}
          </p>
          <div className="text-[9px] text-muted-foreground mt-2 font-semibold">
            Estimated from current term internals
          </div>
        </GlassCard>

        <GlassCard className="p-5 border border-glass-border">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] uppercase font-bold tracking-wider">Attendance Status</span>
            <Users size={16} className="text-primary" />
          </div>
          <p className="text-3xl font-extrabold font-heading tracking-tighter mt-2 text-foreground">
            {currentAttendance}%
          </p>
          <div className="text-[9px] text-muted-foreground mt-2 flex items-center gap-1 font-semibold text-emerald-500">
            <CheckCircle size={12} /> Above 75% target threshold
          </div>
        </GlassCard>

        <GlassCard className="p-5 border border-glass-border">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] uppercase font-bold tracking-wider">Active Term Calendar</span>
            <Calendar size={16} className="text-primary" />
          </div>
          <p className="text-3xl font-extrabold font-heading tracking-tighter mt-2 text-foreground">
            24 Days
          </p>
          <div className="text-[9px] text-muted-foreground mt-2 font-semibold">
            Until semester-end examinations
          </div>
        </GlassCard>

        <GlassCard className="p-5 border border-glass-border">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] uppercase font-bold tracking-wider">Pending Assignments</span>
            <Compass size={16} className="text-primary" />
          </div>
          <p className="text-3xl font-extrabold font-heading tracking-tighter mt-2 text-amber-500">
            2 Tasks
          </p>
          <div className="text-[9px] text-muted-foreground mt-2 font-semibold">
            Due in CN and DBMS labs
          </div>
        </GlassCard>
      </div>

      {/* Main dashboard columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Timetable schedule list & Academic Goals (takes 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timetable schedule grid */}
          <GlassCard className="border border-glass-border p-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Today&apos;s Class Schedule
              </h3>
              <span className="text-[10px] text-muted-foreground font-semibold">Friday Term Slot</span>
            </div>

            <div className="space-y-4">
              {MOCK_TIMETABLE.map((slot) => (
                <div
                  key={slot.time}
                  className="p-4 rounded-xl border border-border bg-secondary/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    {/* Color badge */}
                    <div
                      className="w-2.5 h-12 rounded shrink-0 self-center"
                      style={{ backgroundColor: slot.color }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground font-heading">{slot.subjectName}</span>
                        <span className="text-[9px] font-mono text-muted-foreground font-semibold">({slot.subjectCode})</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Faculty: {slot.faculty} • Room: {slot.classroom}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-mono font-semibold text-muted-foreground">{slot.time}</span>
                    <a
                      href={slot.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-primary hover:underline"
                    >
                      Join Meeting
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Academic Goals configurations */}
          <GlassCard className="border border-glass-border p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Active Performance Goals
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-border bg-secondary/20 text-center">
                <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">Target CGPA</span>
                <span className="text-base font-extrabold text-foreground mt-1.5 block">8.50 / 10</span>
              </div>
              <div className="p-4 rounded-xl border border-border bg-secondary/20 text-center">
                <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">Min Attendance</span>
                <span className="text-base font-extrabold text-foreground mt-1.5 block">75.0%</span>
              </div>
              <div className="p-4 rounded-xl border border-border bg-secondary/20 text-center">
                <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">Revision Hours</span>
                <span className="text-base font-extrabold text-foreground mt-1.5 block">40 hrs / term</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Academic Intelligence Skip checker & recomendations */}
        <div className="space-y-6">
          <GlassCard className="border border-glass-border p-6 flex flex-col justify-between h-fit gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Sparkles className="text-primary" size={18} />
                <h4 className="font-heading font-extrabold text-sm text-foreground">Academic Intelligence</h4>
              </div>

              {/* Skip simulation input */}
              <div className="space-y-3">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  What happens if I skip the next class?
                </p>
                <div className="flex gap-2">
                  <PremiumButton
                    variant="glass"
                    onClick={() => setSimulatedSkip(true)}
                    className="flex-1 text-[10px] py-1.5 h-8 font-semibold cursor-pointer"
                  >
                    Simulate Skip
                  </PremiumButton>
                  {simulatedSkip !== null && (
                    <button
                      onClick={() => setSimulatedSkip(null)}
                      className="text-[9px] text-muted-foreground hover:text-foreground font-semibold px-2"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {simulatedSkip !== null && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div
                        className={`p-3 rounded-lg border text-[10px] leading-normal font-medium ${
                          skipSafe
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                            : "bg-red-500/10 border-red-500/20 text-red-500"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold mb-1">
                          {skipSafe ? (
                            <>
                              <CheckCircle size={12} /> Skip is Safe
                            </>
                          ) : (
                            <>
                              <AlertTriangle size={12} /> Skip is Risky
                            </>
                          )}
                        </div>
                        <span>
                          Simulated attendance will sit at **{skipPercentage}%**. {skipSafe ? "You remain above threshold." : "Warning! You fall below 75%."}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Tonights Study priority list */}
              <div className="space-y-3 pt-3 border-t border-border/40">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  Tonight&apos;s Study Priorities
                </p>
                <div className="space-y-2 text-[10px]">
                  <div className="flex justify-between items-center text-foreground font-semibold">
                    <span>1. Computer Networks</span>
                    <span className="text-amber-500">Priority: 78%</span>
                  </div>
                  <div className="flex justify-between items-center text-foreground font-semibold">
                    <span>2. Database Systems</span>
                    <span className="text-muted-foreground">Priority: 44%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex flex-col gap-2.5">
              <Link href="/mission-control/academic-core/syllabus">
                <PremiumButton variant="glass" className="w-full text-xs py-2 h-9 flex items-center justify-center gap-1">
                  Track Syllabus Progress <ArrowRight size={14} />
                </PremiumButton>
              </Link>
              <Link href="/mission-control/academic-core/backlogs">
                <PremiumButton variant="glass" className="w-full text-xs py-2 h-9 flex items-center justify-center gap-1">
                  Uncleared Backlogs Vault <ArrowRight size={14} />
                </PremiumButton>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
