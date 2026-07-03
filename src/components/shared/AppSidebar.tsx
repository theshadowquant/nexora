"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  RefreshCw,
  Trophy,
  GraduationCap,
  Briefcase,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { name: "Mission Control", href: "/mission-control", icon: LayoutDashboard },
  { name: "Knowledge Vault", href: "/mission-control/knowledge-vault", icon: BookOpen },
  { name: "AI Mentor", href: "/mission-control/ai-mentor", icon: Sparkles },
  { name: "Memory Forge", href: "/mission-control/memory-forge", icon: RefreshCw },
  { name: "Exam Intelligence", href: "/mission-control/exam-intelligence", icon: Trophy },
  { name: "Performance Hub", href: "/mission-control/performance-hub", icon: GraduationCap },
  { name: "Career Command", href: "/mission-control/career-command", icon: Briefcase },
  { name: "Community Forum", href: "/mission-control/community", icon: Users },
  { name: "AI Observatory", href: "/mission-control/admin/ai-analytics", icon: Activity },
  { name: "Settings", href: "/mission-control/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 76 : 240 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="hidden md:flex flex-col h-screen border-r border-border bg-card/65 backdrop-blur-md sticky top-0 shrink-0 select-none z-30"
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2 font-heading font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-500 to-violet-400 bg-clip-text text-transparent">
            NEXORA
          </Link>
        )}
        {isCollapsed && (
          <Link href="/dashboard" className="mx-auto font-heading font-extrabold text-xl bg-gradient-to-r from-indigo-500 to-violet-400 bg-clip-text text-transparent">
            N
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer relative",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute left-0 top-1/4 w-1 h-1/2 bg-primary rounded-r-full"
                  transition={{ duration: 0.2 }}
                />
              )}
              <Icon className={cn("shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Footer profile segment */}
      <div className="border-t border-border p-3">
        <div className={cn("flex items-center gap-3 rounded-lg p-2 bg-secondary/35", isCollapsed ? "justify-center" : "")}>
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <UserIcon size={16} />
          </div>
          {!isCollapsed && (
            <div className="truncate flex-1">
              <p className="text-xs font-semibold text-foreground truncate">Alex Mercier</p>
              <p className="text-[10px] text-muted-foreground truncate">alex.mercier@nexora.io</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
