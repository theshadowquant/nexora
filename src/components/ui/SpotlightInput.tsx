"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useMotionValue, motion, useMotionTemplate } from "framer-motion";

export interface SpotlightInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export const SpotlightInput = React.forwardRef<HTMLInputElement, SpotlightInputProps>(
  ({ className, containerClassName, type = "text", ...props }, ref) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
      const { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }

    return (
      <div
        className={cn("group relative rounded-lg border border-input bg-card p-[1px] transition-all duration-200 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2", containerClassName)}
        onMouseMove={handleMouseMove}
      >
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                120px circle at ${mouseX}px ${mouseY}px,
                rgba(99, 102, 241, 0.12),
                transparent 80%
              )
            `,
          }}
        />
        <input
          ref={ref}
          type={type}
          className={cn(
            "w-full rounded-md border-0 bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-0",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
SpotlightInput.displayName = "SpotlightInput";
