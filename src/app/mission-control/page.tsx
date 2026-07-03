"use client";

import * as React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { SpotlightInput } from "@/components/ui/SpotlightInput";
import {
  Flame,
  Calendar,
  CheckCircle2,
  Percent,
  Plus,
  BookOpen,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

interface Task {
  id: string;
  title: string;
  category: string;
  completed: boolean;
}

export default function WorkspacePage() {
  // Mock State for Today's Tasks
  const [tasks, setTasks] = React.useState<Task[]>([
    { id: "1", title: "Complete DBMS Module 3 Assignments", category: "Assignment", completed: false },
    { id: "2", title: "Review Graph Theory Flashcards", category: "Revision", completed: true },
    { id: "3", title: "Solve 5 Leetcode Trees Questions", category: "Placement", completed: false },
  ]);

  // Mock State for Attendance
  const [attendance, setAttendance] = React.useState({
    present: 24,
    total: 30,
    target: 75,
  });

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAttendance = (action: "PRESENT" | "ABSENT") => {
    setAttendance((prev) => {
      const isPresent = action === "PRESENT";
      return {
        ...prev,
        present: isPresent ? prev.present + 1 : prev.present,
        total: prev.total + 1,
      };
    });
  };

  const attendancePercent = ((attendance.present / attendance.total) * 100).toFixed(1);
  const isAttendanceSafe = parseFloat(attendancePercent) >= attendance.target;

  return (
    <div className="space-y-8 select-none">
      {/* Greetings Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading tracking-tight text-foreground">
            Welcome back, Alex
          </h2>
          <p className="text-xs text-muted-foreground">
            Your academic metrics are stable. Spaced revision schedule is optimal.
          </p>
        </div>

        {/* Study Streak flame */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-500 w-fit">
          <Flame className="fill-current animate-bounce" size={16} />
          <span className="text-xs font-semibold">12 Day Study Streak</span>
        </div>
      </div>

      {/* Grid of Interactive Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Widget 1: Attendance Calculator */}
        <GlassCard className="flex flex-col justify-between h-64 border border-glass-border">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Attendance Tracker
            </h3>
            <Percent size={16} className="text-muted-foreground" />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-3xl font-extrabold font-heading tracking-tighter">
                {attendancePercent}%
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {attendance.present} / {attendance.total} classes attended
              </p>
            </div>

            {/* Circular Ring Gauge */}
            <div className="relative w-16 h-16">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-muted"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <motion.path
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: `${attendancePercent}, 100` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={isAttendanceSafe ? "text-indigo-500" : "text-amber-500"}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>

          {/* Quick simulation buttons */}
          <div className="flex gap-2">
            <PremiumButton
              variant="glass"
              className="flex-1 text-xs py-1.5 h-8"
              onClick={() => handleAttendance("PRESENT")}
            >
              Attended
            </PremiumButton>
            <PremiumButton
              variant="glass"
              className="flex-1 text-xs py-1.5 h-8 border-red-500/10 hover:bg-red-500/5 text-muted-foreground"
              onClick={() => handleAttendance("ABSENT")}
            >
              Bunked
            </PremiumButton>
          </div>

          <div className="pt-2 border-t border-border flex items-center gap-1.5 text-[9px] text-muted-foreground">
            {isAttendanceSafe ? (
              <span className="text-emerald-500 font-semibold">Safe: 3 consecutive classes can be skipped.</span>
            ) : (
              <span className="text-amber-500 font-semibold flex items-center gap-1">
                <AlertCircle size={10} /> Attendance is below target of {attendance.target}%.
              </span>
            )}
          </div>
        </GlassCard>

        {/* Widget 2: Today's Tasks */}
        <GlassCard className="flex flex-col justify-between h-64 border border-glass-border">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Today&apos;s Checklist
            </h3>
            <CheckCircle2 size={16} className="text-muted-foreground" />
          </div>

          <div className="flex-1 overflow-y-auto my-3 space-y-2 pr-1">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className="flex items-center gap-3 p-2 rounded-lg bg-secondary/20 hover:bg-secondary/45 transition-colors duration-200 cursor-pointer"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors duration-200 ${
                    task.completed
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "border-muted-foreground/35"
                  }`}
                >
                  {task.completed && <span className="text-[10px]">✓</span>}
                </div>
                <span
                  className={`text-xs truncate flex-1 ${
                    task.completed ? "line-through text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {task.title}
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-card border border-border text-muted-foreground shrink-0 uppercase tracking-wide">
                  {task.category}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-[10px] text-muted-foreground">
              {tasks.filter((t) => t.completed).length} of {tasks.length} completed
            </span>
            <button className="text-[10px] font-bold text-primary flex items-center gap-0.5 hover:underline cursor-pointer">
              <Plus size={12} /> Add Task
            </button>
          </div>
        </GlassCard>

        {/* Widget 3: Exam Countdown */}
        <GlassCard className="flex flex-col justify-between h-64 border border-glass-border">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Upcoming Exam Alert
            </h3>
            <Calendar size={16} className="text-muted-foreground" />
          </div>

          <div className="py-2 text-center">
            <p className="text-4xl font-extrabold font-heading tracking-tighter text-amber-500 animate-pulse">
              04 Days
            </p>
            <p className="text-xs font-semibold text-foreground mt-1.5">
              Discrete Mathematics
            </p>
            <p className="text-[10px] text-muted-foreground">
              Internal Assessment 2 (21CS51)
            </p>
          </div>

          <div className="p-2 rounded bg-amber-500/5 border border-amber-500/15 flex items-start gap-2 text-[10px] text-amber-600 dark:text-amber-400">
            <AlertCircle className="shrink-0 mt-0.5" size={14} />
            <span>AI Revision suggests focusing on **Relations & Matrix maps** (scoring index low).</span>
          </div>

          <div className="flex gap-2">
            <PremiumButton variant="primary" className="w-full text-xs py-1.5 h-8">
              Start Practice
            </PremiumButton>
          </div>
        </GlassCard>

        {/* Widget 4: SGPA / CGPA Summary Tracker */}
        <GlassCard className="col-span-1 md:col-span-2 lg:col-span-2 flex flex-col justify-between h-64 border border-glass-border">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Academic Predictors
            </h3>
            <TrendingUp size={16} className="text-muted-foreground" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            <div className="p-4 rounded-lg bg-secondary/15 border border-border flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">Current CGPA</p>
                <p className="text-2xl font-extrabold font-heading tracking-tight mt-1 text-foreground">8.24</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">Target CGPA</p>
                <p className="text-lg font-bold text-primary mt-1">8.50</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-secondary/15 border border-border flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">Predicted SGPA</p>
                <p className="text-2xl font-extrabold font-heading tracking-tight mt-1 text-indigo-500">8.42</p>
              </div>
              <div className="text-right text-[10px] text-muted-foreground">
                Based on current internal test scores
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-[10px] text-muted-foreground">
              Internal assessment score averages: 17.5 / 20
            </span>
            <button className="text-[10px] font-bold text-primary flex items-center gap-0.5 hover:underline cursor-pointer">
              Simulate SGPA <ChevronRight size={12} />
            </button>
          </div>
        </GlassCard>

        {/* Widget 5: Quick Notes folders */}
        <GlassCard className="flex flex-col justify-between h-64 border border-glass-border">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Recent Study Files
            </h3>
            <BookOpen size={16} className="text-muted-foreground" />
          </div>

          <div className="space-y-2 flex-1 my-3 overflow-y-auto pr-1">
            <div className="flex items-center justify-between p-2 rounded bg-secondary/10 border border-border/40 hover:bg-secondary/25 transition-colors cursor-pointer">
              <span className="text-xs truncate font-medium text-foreground">DBMS_Module_2_SQL.pdf</span>
              <span className="text-[9px] text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-secondary/10 border border-border/40 hover:bg-secondary/25 transition-colors cursor-pointer">
              <span className="text-xs truncate font-medium text-foreground">CN_Lab_Program_3.java</span>
              <span className="text-[9px] text-muted-foreground">Yesterday</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-secondary/10 border border-border/40 hover:bg-secondary/25 transition-colors cursor-pointer">
              <span className="text-xs truncate font-medium text-foreground">Automata_Theory_Ch4.pdf</span>
              <span className="text-[9px] text-muted-foreground">3 days ago</span>
            </div>
          </div>

          <button className="w-full text-center text-xs py-1.5 h-8 bg-secondary border border-border hover:bg-secondary/80 rounded-lg text-foreground font-semibold flex items-center justify-center gap-1 cursor-pointer">
            Browse All Notes <ChevronRight size={14} />
          </button>
        </GlassCard>
      </div>
    </div>
  );
}
