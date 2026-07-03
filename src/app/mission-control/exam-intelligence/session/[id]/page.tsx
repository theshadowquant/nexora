"use client";

import * as React from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { SpotlightInput } from "@/components/ui/SpotlightInput";
import {
  ArrowLeft,
  Clock,
  AlertTriangle,
  Play,
  CheckCircle,
  FileText,
  Code
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  type: "MCQ" | "DESCRIPTIVE" | "CODING";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  conceptName: string;
}

const MOCK_QUESTIONS: Question[] = [
  {
    id: "q-1",
    questionText: "Which layer of the OSI model determines route selection parameters?",
    options: ["Physical", "Data Link", "Network", "Transport"],
    correctAnswer: "Network",
    type: "MCQ",
    difficulty: "EASY",
    conceptName: "OSI Layers",
  },
  {
    id: "q-2",
    questionText: "What is the primary constraint of Dijkstra's algorithm?",
    options: [
      "Requires binary heaps",
      "Fails on graphs with negative edge weights",
      "Limited to undirected cycles",
      "Calculates all-pairs paths"
    ],
    correctAnswer: "Fails on graphs with negative edge weights",
    type: "MCQ",
    difficulty: "MEDIUM",
    conceptName: "Shortest Paths",
  },
  {
    id: "q-3",
    questionText: "Write a function `isBalanced(root)` that returns true if a binary tree is height-balanced.",
    options: [],
    correctAnswer: "def isBalanced(root):\n    def check(node):\n        if not node: return 0\n        lh = check(node.left)\n        if lh == -1: return -1\n        rh = check(node.right)\n        if rh == -1: return -1\n        if abs(lh - rh) > 1: return -1\n        return max(lh, rh) + 1\n    return check(root) != -1",
    type: "CODING",
    difficulty: "HARD",
    conceptName: "Trees Balancing",
  },
];

export default function ExamSessionPage() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<string, string>>({});
  const [remainingSeconds, setRemainingSeconds] = React.useState(1800); // 30 minutes
  const [blurCount, setBlurCount] = React.useState(0);
  const [warnings, setWarnings] = React.useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isFullscreenActive, setIsFullscreenActive] = React.useState(false);

  // Time Countdown
  React.useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  // Tab blur monitoring (cheating check)
  React.useEffect(() => {
    const handleBlur = () => {
      if (isSubmitted) return;
      setBlurCount((prev) => {
        const nextCount = prev + 1;
        if (nextCount >= 3) {
          handleSubmit();
          setWarnings((w) => [...w, "Lockdown automatic submit triggered: Too many tab blurs."]);
        } else {
          setWarnings((w) => [...w, `Warning ${nextCount}/3: You have navigated away from the exam tab!`]);
        }
        return nextCount;
      });
    };

    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, [isSubmitted]);

  const requestFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
      setIsFullscreenActive(true);
    }
  };

  const handleAnswer = (value: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [MOCK_QUESTIONS[currentIndex].id]: value,
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Time format
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const currentQuestion = MOCK_QUESTIONS[currentIndex];

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col gap-6 select-none max-w-5xl mx-auto justify-between">
      {/* Workspace Header toolbar */}
      <div className="flex items-center justify-between shrink-0 border-b border-border pb-3 bg-background">
        <div className="flex items-center gap-3">
          <Link
            href="/mission-control/exam-intelligence"
            className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h3 className="text-base font-bold font-heading tracking-tight leading-tight">
              Computer Networks Simulator
            </h3>
            <p className="text-[10px] text-muted-foreground">
              Syllabus Code: 21CS52 • VTU Mode Lockdown
            </p>
          </div>
        </div>

        {/* Timer, Warnings and Fullscreen buttons */}
        <div className="flex items-center gap-4">
          {warnings.length > 0 && (
            <div className="flex items-center gap-1 text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded font-semibold animate-pulse">
              <AlertTriangle size={12} /> blur detected
            </div>
          )}

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-foreground">
            <Clock size={16} className="text-primary" />
            <span>{formatTime(remainingSeconds)}</span>
          </div>

          {!isFullscreenActive && !isSubmitted && (
            <PremiumButton variant="glass" className="text-xs h-8 py-1 px-3" onClick={requestFullscreen}>
              Enter Lockdown Fullscreen
            </PremiumButton>
          )}

          {!isSubmitted && (
            <PremiumButton variant="primary" className="text-xs h-8 py-1 px-3" onClick={handleSubmit}>
              Submit Session
            </PremiumButton>
          )}
        </div>
      </div>

      {/* Main split work layout */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0 overflow-hidden py-4">
        {!isSubmitted ? (
          <>
            {/* Left side: Navigation panel (1 to 5) */}
            <div className="w-full md:w-48 bg-card/65 border border-glass-border rounded-xl p-4 flex flex-col gap-3 shrink-0">
              <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider mb-2">Questions Map</span>
              <div className="flex flex-wrap md:flex-col gap-2">
                {MOCK_QUESTIONS.map((q, idx) => {
                  const isAnswered = !!selectedAnswers[q.id];
                  const isActive = currentIndex === idx;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between gap-2 border transition-all cursor-pointer ${
                        isActive
                          ? "bg-primary border-primary text-primary-foreground"
                          : isAnswered
                          ? "bg-secondary border-border text-foreground"
                          : "bg-secondary/35 border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span>Q {idx + 1}</span>
                      <span className="text-[9px] font-normal uppercase opacity-75">{q.difficulty}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right side: Active Question workspace */}
            <div className="flex-1 bg-card/65 border border-glass-border rounded-xl p-6 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                {/* Meta details */}
                <div className="flex items-center justify-between text-[10px] text-muted-foreground border-b border-border pb-3">
                  <span className="font-semibold uppercase tracking-wider text-primary">{currentQuestion.conceptName}</span>
                  <span className="px-2 py-0.5 rounded bg-secondary border border-border">{currentQuestion.type}</span>
                </div>

                {/* Question Text */}
                <p className="text-sm font-semibold text-foreground leading-relaxed">
                  {currentQuestion.questionText}
                </p>

                {/* Option selection inputs */}
                {currentQuestion.type === "MCQ" && (
                  <div className="grid grid-cols-1 gap-3 pt-4">
                    {currentQuestion.options.map((opt) => {
                      const isSelected = selectedAnswers[currentQuestion.id] === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => handleAnswer(opt)}
                          className={`w-full text-left p-4 rounded-xl border text-xs leading-relaxed transition-all cursor-pointer ${
                            isSelected
                              ? "bg-primary/5 border-primary text-primary font-semibold"
                              : "bg-secondary/20 border-border text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Coding Text Editor mockup */}
                {currentQuestion.type === "CODING" && (
                  <div className="space-y-3 pt-4">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground shrink-0 border border-border border-b-0 rounded-t-lg bg-secondary/35 px-4 h-8">
                      <span className="flex items-center gap-1 font-mono"><Code size={12} /> solution.py</span>
                      <span>Python 3.10</span>
                    </div>
                    <textarea
                      value={selectedAnswers[currentQuestion.id] || ""}
                      onChange={(e) => handleAnswer(e.target.value)}
                      placeholder="Write your python solution function here..."
                      className="w-full h-48 bg-secondary/15 border border-border rounded-b-lg p-4 font-mono text-[11px] text-indigo-500 focus:outline-none focus:border-primary resize-none"
                    />
                  </div>
                )}
              </div>

              {/* Navigator buttons */}
              <div className="flex justify-between items-center border-t border-border pt-4 mt-8">
                <PremiumButton
                  variant="glass"
                  className="text-xs h-9"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => prev - 1)}
                >
                  Previous
                </PremiumButton>
                <PremiumButton
                  variant="glass"
                  className="text-xs h-9"
                  disabled={currentIndex === MOCK_QUESTIONS.length - 1}
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                >
                  Next
                </PremiumButton>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full bg-card/65 border border-glass-border rounded-xl p-8 flex flex-col justify-center items-center text-center gap-6 shadow-md max-w-xl mx-auto my-auto aspect-[4/3]">
            <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <CheckCircle size={32} />
            </div>
            <div>
              <h4 className="font-heading font-extrabold text-base text-foreground">Assessment Submitted!</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm leading-relaxed">
                Your simulator attempt has been successfully graded. Concept masteries updated. Any incorrect solutions are audited inside Mistake Command Vault.
              </p>
            </div>
            <Link href="/mission-control/exam-intelligence">
              <PremiumButton variant="primary" className="text-xs h-9">
                Back to Dashboard
              </PremiumButton>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
