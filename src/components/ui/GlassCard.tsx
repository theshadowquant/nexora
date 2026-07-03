"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

export interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  hoverGlow?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hoverGlow = true, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "premium-card p-6 flex flex-col justify-between relative overflow-hidden",
          hoverGlow && "hover:border-indigo-500/35 hover:-translate-y-0.5 hover:shadow-indigo-500/5",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
GlassCard.displayName = "GlassCard";
