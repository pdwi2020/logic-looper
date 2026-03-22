import { useEffect } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';

interface CountUpProps {
  value: number;
  delay?: number;
  duration?: number;
}

export function CountUp({ value, delay = 0, duration = 0.8 }: CountUpProps) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (latest) => Math.round(latest));

  useEffect(() => {
    if (value === 0) return;
    const controls = animate(mv, value, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [value, duration, delay, mv]);

  return <motion.span>{rounded}</motion.span>;
}
