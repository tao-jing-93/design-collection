import { cn } from "./utils";
import { motion } from "motion/react";
import React from "react";

export const BackgroundLines = ({
  children,
  className,
  svgOptions,
}: {
  children?: React.ReactNode;
  className?: string;
  svgOptions?: {
    duration?: number;
  };
}) => {
  return (
    <div
      className={cn(
        "relative w-full h-full overflow-hidden bg-transparent",
        className
      )}
    >
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <SVG />
      </div>
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};

const SVG = () => {
  const paths = React.useMemo(() => {
    const p = [];
    const center = { x: 720, y: 450 };
    const count = 40; 
    
    for (let i = 0; i < count; i++) {
       const angle = (i / count) * 360 + Math.random() * 30;
       const rad = (angle * Math.PI) / 180;
       
       const startDist = 10 + Math.random() * 50;
       const endDist = 600 + Math.random() * 400;
       
       const x1 = center.x + Math.cos(rad) * startDist;
       const y1 = center.y + Math.sin(rad) * startDist;
       
       const x2 = center.x + Math.cos(rad) * endDist;
       const y2 = center.y + Math.sin(rad) * endDist;
       
       // Generate wavy path
       // Vector
       const dx = x2 - x1;
       const dy = y2 - y1;
       const dist = Math.sqrt(dx*dx + dy*dy);
       
       // Normal vector
       const nx = -dy / dist;
       const ny = dx / dist;
       
       const waves = 2 + Math.floor(Math.random() * 3); // 2 to 4 waves
       const amplitude = 10 + Math.random() * 20;
       
       // Construct curve points
       // We'll use a simple set of quadratic curves or cubic
       // Let's use a string builder for a path with control points
       let d = `M ${x1} ${y1}`;
       
       const segments = waves * 2; // Up and down parts
       const stepX = dx / segments;
       const stepY = dy / segments;
       
       let currX = x1;
       let currY = y1;
       
       for (let j = 0; j < segments; j++) {
         const nextX = currX + stepX;
         const nextY = currY + stepY;
         
         // Control point offset
         // Alternating direction
         const dir = j % 2 === 0 ? 1 : -1;
         const cpX = (currX + nextX) / 2 + nx * amplitude * dir;
         const cpY = (currY + nextY) / 2 + ny * amplitude * dir;
         
         d += ` Q ${cpX} ${cpY} ${nextX} ${nextY}`;
         
         currX = nextX;
         currY = nextY;
       }

       p.push({
         d: d,
         color: getColor(i),
         delay: Math.random() * 5,
         // Slower speed (0.5x) -> Longer duration
         duration: 5 + Math.random() * 10, 
         width: 1.5 + Math.random(),
         maxLen: 0.05 + Math.random() * 0.08 
       });
    }
    return p;
  }, []);

  return (
    <motion.svg
      viewBox="0 0 1440 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      {paths.map((path, idx) => (
        <motion.path
          key={idx}
          d={path.d}
          stroke={path.color}
          strokeWidth={path.width}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0, pathOffset: 0 }}
          animate={{
            pathLength: [0, path.maxLen, 0],
            opacity: [0, 1, 0],
            pathOffset: [0, 1] 
          }}
          transition={{
            duration: path.duration,
            repeat: Infinity,
            delay: path.delay,
            ease: "linear",
            repeatType: "loop"
          }}
        />
      ))}
    </motion.svg>
  );
};

const getColor = (idx: number) => {
  const colors = [
    "#22c55e", // Green
    "#a855f7", // Purple
    "#f97316", // Orange
    "#3b82f6", // Blue
    "#ec4899", // Pink
    "#eab308", // Yellow
  ];
  return colors[idx % colors.length];
}
