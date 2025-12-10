import { Site, SiteCard } from "./SiteCard";
import { Button } from "./ui/button";
import { InteractiveHoverButton } from "./ui/interactive-hover-button";
import {
  ArrowRight,
  Hash,
  LayoutGrid,
  Palette,
  Code,
  PenTool,
  GraduationCap,
  Layers,
  Lightbulb,
  Type,
} from "lucide-react";
import { cn } from "./ui/utils";
import { RollingText } from "./ui/rolling-text";
import { motion } from "motion/react";
import { BackgroundLines } from "./ui/background-lines";

interface LandingPageProps {
  sites: Site[];
  categories: string[];
  onNavigate: (category?: string) => void;
  onEdit: (site: Site) => void;
}

export function LandingPage({
  sites,
  categories,
  onNavigate,
  onEdit,
}: LandingPageProps) {
  // Subtle transforms matching Figma design (1deg, 358deg=-2deg, 1deg, 358deg=-2deg)
  const cardStyles = [
    "rotate-1 translate-y-0",
    "-rotate-2 translate-y-1",
    "rotate-1 translate-y-2",
    "-rotate-2 translate-y-1",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20,
      },
    },
  };

  return (
    <div className="relative w-full flex flex-col items-center min-h-[80vh]">
      {/* Dynamic Background */}
      <div className="absolute -top-[120px] left-1/2 -translate-x-1/2 w-screen h-[600px] overflow-hidden pointer-events-none z-0">
        <BackgroundLines className="w-full h-full" />
        {/* Gradient mask to fade into dark background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#121212]/50 to-[#121212]" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-[1400px] mx-auto px-6 py-12 flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero / Categories */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-4xl mx-auto mb-16 text-center pt-10"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 font-[Sansation] tracking-wide drop-shadow-lg">
            Discover Design <br className="hidden md:block" /> &{" "}
            <span className="text-neutral-500">
              Inspiration
            </span>
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((category) => {
              let Icon = Hash;
              const lower = category.toLowerCase();
              if (category === "全部") Icon = LayoutGrid;
              else if (
                lower.includes("design") ||
                lower.includes("ui") ||
                lower.includes("ux") ||
                lower.includes("color")
              )
                Icon = Palette;
              else if (
                lower.includes("dev") ||
                lower.includes("code") ||
                lower.includes("api") ||
                lower.includes("frontend")
              )
                Icon = Code;
              else if (
                lower.includes("tool") ||
                lower.includes("util")
              )
                Icon = PenTool;
              else if (
                lower.includes("learn") ||
                lower.includes("study") ||
                lower.includes("course")
              )
                Icon = GraduationCap;
              else if (
                lower.includes("resource") ||
                lower.includes("asset")
              )
                Icon = Layers;
              else if (
                lower.includes("inspir") ||
                lower.includes("idea")
              )
                Icon = Lightbulb;
              else if (
                lower.includes("font") ||
                lower.includes("typo")
              )
                Icon = Type;

              return (
                <button
                  key={category}
                  onClick={() => onNavigate(category)}
                  className="h-[38px] px-6 rounded-full text-[15px] font-medium transition-all duration-200 bg-[rgba(255,255,255,0.02)] backdrop-blur-md text-[#a1a1a1] hover:bg-[#2C2C2E] hover:text-white shadow-[0px_0px_1px_0px_rgba(255,255,255,0.3)] flex items-center gap-2 group"
                >
                  <Icon className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                  <RollingText className="text-[14px]">
                    {category}
                  </RollingText>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Cards Grid - 4 Columns on Large Screens to match Figma */}
        <motion.div variants={itemVariants} className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mb-[64px] p-[0px] mt-[0px] mr-[0px] ml-[0px]">
            {sites.slice(0, 4).map((site, index) => (
              <motion.div
                key={site.id}
                className={cn(
                  "transition-all duration-500 hover:z-20 hover:scale-105 hover:rotate-0",
                  cardStyles[index % 4],
                )}
                whileHover={{ y: -10 }}
              >
                <SiteCard site={site} onEdit={onEdit} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div variants={itemVariants} className="pb-12">
          <InteractiveHoverButton
            onClick={() => onNavigate("全部")}
            text="Browse Collection"
            className="h-12 w-auto min-w-[200px] text-lg border-neutral-800 text-neutral-300 shadow-lg shadow-white/5 [&>div:last-child]:bg-transparent hover:[&>div:last-child]:bg-white"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}