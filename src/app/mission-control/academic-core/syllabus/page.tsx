"use client";

import * as React from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  ArrowLeft,
  CheckSquare,
  Square,
  BookOpen,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

interface Subtopic {
  id: string;
  name: string;
  isCompleted: boolean;
}

interface Topic {
  id: string;
  name: string;
  isCompleted: boolean;
  subtopics: Subtopic[];
}

interface ModuleItem {
  moduleNo: number;
  title: string;
  progress: number;
  topics: Topic[];
}

const INITIAL_MODULES: ModuleItem[] = [
  {
    moduleNo: 1,
    title: "Relational Data Model",
    progress: 75,
    topics: [
      {
        id: "t-1",
        name: "Entity Relationships Mapping",
        isCompleted: true,
        subtopics: [
          { id: "st-1", name: "Cardinality Constraints", isCompleted: true },
          { id: "st-2", name: "Weak Entity Sets Mapping", isCompleted: true },
        ],
      },
      {
        id: "t-2",
        name: "SQL Triggers & Procedures",
        isCompleted: false,
        subtopics: [
          { id: "st-3", name: "Row-level Triggers", isCompleted: true },
          { id: "st-4", name: "Instead-of Triggers", isCompleted: false },
        ],
      },
    ],
  },
];

export default function SyllabusProgressPage() {
  const [modules, setModules] = React.useState<ModuleItem[]>(INITIAL_MODULES);
  const [expandedTopic, setExpandedTopic] = React.useState<string | null>("t-1");

  const toggleSubtopic = (moduleNo: number, topicId: string, subtopicId: string) => {
    setModules((prev) =>
      prev.map((mod) => {
        if (mod.moduleNo === moduleNo) {
          const updatedTopics = mod.topics.map((top) => {
            if (top.id === topicId) {
              const updatedSubtopics = top.subtopics.map((st) =>
                st.id === subtopicId ? { ...st, isCompleted: !st.isCompleted } : st
              );
              const allCompleted = updatedSubtopics.every((st) => st.isCompleted);
              return {
                ...top,
                isCompleted: allCompleted,
                subtopics: updatedSubtopics,
              };
            }
            return top;
          });

          // Calculate overall module progress
          let totalItems = 0;
          let completedItems = 0;
          for (const top of updatedTopics) {
            for (const st of top.subtopics) {
              totalItems++;
              if (st.isCompleted) completedItems++;
            }
          }
          const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

          return { ...mod, progress, topics: updatedTopics };
        }
        return mod;
      })
    );
  };

  return (
    <div className="space-y-8 select-none">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
          <Link href="/mission-control/academic-core" className="hover:text-foreground flex items-center gap-1">
            <ArrowLeft size={12} /> Academic Command Center
          </Link>
          <span>/</span>
          <span className="text-foreground">Syllabus Tracker</span>
        </div>
        <h2 className="text-2xl font-bold font-heading tracking-tight text-foreground">
          Syllabus Progress Tracker
        </h2>
        <p className="text-xs text-muted-foreground">
          Hierarchy topic checklists (Module $\rightarrow$ Topic $\rightarrow$ Subtopic) to trace curriculum completion rates.
        </p>
      </div>

      {/* Modules checklists */}
      <div className="space-y-6">
        {modules.map((mod) => (
          <GlassCard key={mod.moduleNo} className="border border-glass-border p-6 space-y-6">
            {/* Header progress info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground font-semibold">Module {mod.moduleNo}</span>
                <h3 className="text-sm font-bold text-foreground font-heading mt-0.5">{mod.title}</h3>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-32 h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: `${mod.progress}%` }} />
                </div>
                <span className="text-xs font-mono font-bold">{mod.progress}% Done</span>
              </div>
            </div>

            {/* Topics lists */}
            <div className="space-y-4">
              {mod.topics.map((topic) => {
                const isExpanded = expandedTopic === topic.id;

                return (
                  <div key={topic.id} className="border border-border/60 rounded-lg p-3 bg-secondary/10 space-y-3">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen size={14} className="text-primary" />
                        <span className="text-xs font-bold text-foreground font-heading">{topic.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-[9px] font-mono">
                          {topic.subtopics.filter((st) => st.isCompleted).length}/{topic.subtopics.length} done
                        </span>
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </div>
                    </div>

                    {/* Subtopics dropdown */}
                    {isExpanded && (
                      <div className="pl-6 space-y-2.5 pt-2 border-t border-border/40">
                        {topic.subtopics.map((st) => (
                          <div
                            key={st.id}
                            onClick={() => toggleSubtopic(mod.moduleNo, topic.id, st.id)}
                            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            {st.isCompleted ? (
                              <CheckSquare size={14} className="text-emerald-500" />
                            ) : (
                              <Square size={14} />
                            )}
                            <span className={st.isCompleted ? "line-through opacity-75" : ""}>{st.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
