"use client";

import * as React from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { SpotlightInput } from "@/components/ui/SpotlightInput";
import {
  FileText,
  Search,
  Upload,
  BookOpen,
  Eye,
  Calendar,
  Sparkles,
  ArrowLeft,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NoteItem {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  moduleNo: number;
  uploader: string;
  views: number;
  date: string;
  summary: string;
}

const MOCK_NOTES: NoteItem[] = [
  {
    id: "note-dbms-m1",
    title: "Relational Data Model & ER Diagrams",
    subjectCode: "21CS51",
    subjectName: "Database Management Systems",
    moduleNo: 1,
    uploader: "Dr. Clara Oswald",
    views: 142,
    date: "June 28, 2026",
    summary: "Detailed look at entity relationships, attributes, cardinality, and mapping ER diagrams to SQL tables.",
  },
  {
    id: "note-cn-m3",
    title: "Routing Algorithms & IPv4 Protocol",
    subjectCode: "21CS52",
    subjectName: "Computer Networks",
    moduleNo: 3,
    uploader: "Prof. Rupert Giles",
    views: 89,
    date: "July 01, 2026",
    summary: "Covers Distance Vector routing, Link State routing, shortest path calculation (Dijkstra), and IPv4 headers.",
  },
  {
    id: "note-dm-m4",
    title: "Graph Theory & Trees Properties",
    subjectCode: "21CS53",
    subjectName: "Discrete Mathematics",
    moduleNo: 4,
    uploader: "Alex Mercier",
    views: 204,
    date: "June 15, 2026",
    summary: "Graph representations (adjacency list/matrix), tree traversals, spanning trees, and Euler path algorithms.",
  },
];

export default function KnowledgeVaultPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedSubject, setSelectedSubject] = React.useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  const filteredNotes = MOCK_NOTES.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subjectCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = !selectedSubject || note.subjectName === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const uniqueSubjects = Array.from(new Set(MOCK_NOTES.map((n) => n.subjectName)));

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
            <span className="text-foreground">Knowledge Vault</span>
          </div>
          <h2 className="text-2xl font-bold font-heading tracking-tight text-foreground">
            Knowledge Vault
          </h2>
          <p className="text-xs text-muted-foreground">
            Syllabus, module lecture notes, question banks, and textbook vector resources.
          </p>
        </div>

        <PremiumButton
          variant="primary"
          className="flex items-center gap-2 text-xs py-2 h-9 self-start sm:self-auto"
          onClick={() => setIsUploadOpen(true)}
        >
          <Upload size={14} /> Upload Lecture Notes
        </PremiumButton>
      </div>

      {/* Directory metrics and Search bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
        {/* Search */}
        <div className="w-full md:w-96">
          <SpotlightInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, subjects, or syllabus codes..."
            className="pl-8"
            containerClassName="w-full"
          />
        </div>

        {/* Filter tags */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => setSelectedSubject(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 cursor-pointer border ${
              selectedSubject === null
                ? "bg-primary/10 border-primary/20 text-primary"
                : "bg-secondary/35 border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            All Subjects
          </button>
          {uniqueSubjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 cursor-pointer border ${
                selectedSubject === sub
                  ? "bg-primary/10 border-primary/20 text-primary"
                  : "bg-secondary/35 border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <Link key={note.id} href={`/mission-control/knowledge-vault/${note.id}`} className="block group">
            <GlassCard className="h-64 flex flex-col justify-between border border-glass-border hover:border-indigo-500/35 hover:-translate-y-0.5 transition-all duration-200">
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold mb-2">
                  <span className="px-2 py-0.5 rounded bg-secondary border border-border">
                    {note.subjectCode}
                  </span>
                  <span>Module {note.moduleNo}</span>
                </div>
                <h3 className="text-sm font-bold text-foreground font-heading leading-tight group-hover:text-primary transition-colors duration-200 truncate">
                  {note.title}
                </h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {note.subjectName}
                </p>
                <p className="text-xs text-muted-foreground mt-3 line-clamp-3 leading-relaxed">
                  {note.summary}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="truncate">By {note.uploader}</span>
                <span className="flex items-center gap-1 shrink-0"><Eye size={12} /> {note.views}</span>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>

      {/* Drag & Drop Upload Overlay Modal */}
      <AnimatePresence>
        {isUploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploadOpen(false)}
              className="fixed inset-0 bg-background/55 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="relative w-full max-w-lg border border-glass-border bg-card/85 dark:bg-card/75 backdrop-blur-xl rounded-xl shadow-2xl p-6 overflow-hidden z-10 flex flex-col gap-6"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-heading font-extrabold text-base flex items-center gap-2">
                  <Upload size={18} className="text-primary" /> Upload Lecture Notes
                </h3>
                <button
                  onClick={() => setIsUploadOpen(false)}
                  className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Drag Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  console.log("Dropped files:", e.dataTransfer.files);
                  setIsUploadOpen(false);
                }}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-colors duration-200 cursor-pointer ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/50"
                }`}
              >
                <div className="p-3 rounded-full bg-secondary/85 text-muted-foreground">
                  <FileText size={24} />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xs font-semibold text-foreground">Drag and drop your study PDF here</p>
                  <p className="text-[10px] text-muted-foreground">PDF, Markdown or Plain Text up to 30MB</p>
                </div>
                <span className="text-[10px] text-primary hover:underline font-bold mt-2">
                  Browse Files
                </span>
              </div>

              <div className="p-3 rounded bg-secondary/15 border border-border flex items-start gap-2.5 text-[10px] text-muted-foreground leading-normal">
                <Sparkles size={14} className="text-primary shrink-0 mt-0.5" />
                <span>
                  Nexora Core will automatically OCR images, chunk contents, index vectors, and write AI conceptual summaries.
                </span>
              </div>

              <div className="flex gap-2 justify-end border-t border-border pt-4">
                <PremiumButton variant="glass" className="text-xs h-9" onClick={() => setIsUploadOpen(false)}>
                  Cancel
                </PremiumButton>
                <PremiumButton variant="primary" className="text-xs h-9" onClick={() => setIsUploadOpen(false)}>
                  Process Note
                </PremiumButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
