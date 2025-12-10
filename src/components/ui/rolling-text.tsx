import { motion } from "motion/react";

interface RollingTextProps {
  children: string;
  active?: boolean;
  className?: string;
  height?: string;
}

export function RollingText({ children, active = false, className = "", height = "20px" }: RollingTextProps) {
  return (
    <div 
      className={`relative overflow-hidden inline-block align-middle ${className}`} 
      style={{ height }}
    >
      <motion.div
        initial={false}
        animate={{ y: active ? "-50%" : "0%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full"
      >
        <div style={{ height }} className="flex items-center justify-center whitespace-nowrap">
          {children}
        </div>
        <div style={{ height }} className="flex items-center justify-center whitespace-nowrap font-bold text-white">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
