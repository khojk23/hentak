"use client";

import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import Image from "next/image";
import React from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

type LinkPreviewProps = {
  children: React.ReactNode;
  imageSrc: string;
  imageAlt?: string;
  className?: string;
  width?: number;
  height?: number;
};

export function LinkPreview({
  children,
  imageSrc,
  imageAlt = "preview",
  className,
  width = 240,
  height = 180,
}: LinkPreviewProps) {
  const [isOpen, setOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => { setIsMounted(true); }, []);

  const springConfig = { stiffness: 120, damping: 18 };
  const x = useMotionValue(0);
  const translateX = useSpring(x, springConfig);

  function handleMouseMove(e: React.MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const offsetFromCenter = (e.clientX - rect.left - rect.width / 2) / 2.5;
    x.set(offsetFromCenter);
  }

  if (!isMounted) return <span className={className}>{children}</span>;

  return (
    <HoverCardPrimitive.Root
      openDelay={80}
      closeDelay={120}
      onOpenChange={setOpen}
    >
      <HoverCardPrimitive.Trigger
        asChild
        onMouseMove={handleMouseMove}
      >
        <span className={cn("cursor-default", className)}>
          {children}
        </span>
      </HoverCardPrimitive.Trigger>

      <HoverCardPrimitive.Portal>
        <HoverCardPrimitive.Content
          side="top"
          align="center"
          sideOffset={12}
          className="z-50"
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 14, scale: 0.88 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 280, damping: 22 } }}
                exit={{ opacity: 0, y: 14, scale: 0.88, transition: { duration: 0.15 } }}
                style={{ x: translateX }}
                className="rounded-xl overflow-hidden shadow-2xl ring-1 ring-ink-700"
              >
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  width={width}
                  height={height}
                  className="object-cover block"
                  unoptimized={imageSrc.includes("supabase")}
                  sizes={`${width}px`}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Portal>
    </HoverCardPrimitive.Root>
  );
}
