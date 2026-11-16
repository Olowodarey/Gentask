"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { useMounted } from "@/hooks/use-mounted";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  format?: (value: number) => string;
}

export function AnimatedCounter({ value, duration = 2, format }: AnimatedCounterProps) {
  const mounted = useMounted();
  const spring = useSpring(0, { duration: duration * 1000 });
  const display = useTransform(spring, (current) =>
    format ? format(Math.floor(current)) : Math.floor(current).toLocaleString()
  );
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (mounted) {
      spring.set(value);
    }
  }, [mounted, spring, value]);

  useEffect(() => {
    const unsubscribe = display.on("change", (latest) => {
      setDisplayValue(latest);
    });
    return unsubscribe;
  }, [display]);

  return <span>{displayValue}</span>;
}
