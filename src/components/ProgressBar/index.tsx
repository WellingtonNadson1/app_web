import React, { useContext } from "react";
import { motion } from "framer-motion";
import { IntersectionContext } from "../intersection-observer";

interface ProgressBarProps {
  percents: number;
  caption?: string;
  duration?: number;
  delay?: number;
  easing?:
  | [number, number, number, number]
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "circIn"
  | "circOut"
  | "circInOut"
  | "backIn"
  | "backOut"
  | "backInOut"
  | "anticipate";
  barWidth?: number;
  barHeight?: number;
  progressColor?: string;
  baseColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percents,
  caption,
  duration = 3,
  delay = 0.5,
  easing = "easeInOut",
  barWidth = 300,
  barHeight = 24,
  progressColor = "bg-blue-500",
  baseColor = "bg-gray-200",
}) => {
  const { inView } = useContext(IntersectionContext);

  const percentsOffset = (percents - 100) * (barWidth / 100);

  const transition = {
    duration: duration,
    delay: delay,
    ease: easing,
  };

  const variants = {
    enter: {
      x: -barWidth,
    },
    animate: {
      x: [-barWidth, percentsOffset],
      transition,
    },
  };

  return (
    <div className="flex my-1 items-center">
      <div
        className={`relative overflow-hidden ${baseColor}`}
        style={{ width: barWidth, height: barHeight, borderRadius: '0.5rem' }}
      >
        <motion.div
          className={`absolute top-0 left-0 ${progressColor}`}
          style={{ width: '100%', height: '100%' }}
          variants={variants}
          initial="enter"
          animate={inView ? "animate" : "enter"}
          exit="enter"
        />

        {caption && (
          <div
            className="relative text-right pr-2"
            style={{
              fontSize: barHeight >= 20 ? '1rem' : '8px',
              lineHeight: `${barHeight}px`,
            }}
          >
            {caption}
          </div>
        )}
      </div>
      <span className="text-gray-500 font-semibold pl-1">{percents}%</span>
    </div>
  );
};
