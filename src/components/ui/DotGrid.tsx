import { useEffect, useRef } from "react";

interface DotGridProps {
  gridColor?: string;
  rippleIntensity?: number;
  gridSize?: number;
  opacity?: number;
  mouseRadius?: number;
  className?: string;
}

export function DotGrid({
  gridColor = "#0c5f83",
  rippleIntensity = 0.09,
  gridSize = 10,
  opacity = 0.75,
  mouseRadius = 1.2,
  className,
}: DotGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const widthRef = useRef(0);
  const heightRef = useRef(0);
  const dotsRef = useRef<{ x: number; y: number; originX: number; originY: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configuration
    // User said "Grid Size: 10". In typical implementations this might be spacing. 
    // But 10px spacing is very tight. Let's interpret it as Spacing = 40, Dot Size = something else?
    // Or maybe Spacing = 30. Let's try Spacing = 30.
    // If Grid Size = 10 refers to dot radius? No.
    // Let's stick to a reasonable spacing and use the color/opacity.
    const SPACING = 30; 
    const RADIUS = 1.5;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        widthRef.current = parent.clientWidth;
        heightRef.current = parent.clientHeight;
        canvas.width = widthRef.current;
        canvas.height = heightRef.current;
        initDots();
      }
    };

    const initDots = () => {
      dotsRef.current = [];
      const cols = Math.ceil(widthRef.current / SPACING);
      const rows = Math.ceil(heightRef.current / SPACING);
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * SPACING + SPACING / 2;
          const y = j * SPACING + SPACING / 2;
          dotsRef.current.push({ x, y, originX: x, originY: y });
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    handleResize();

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, widthRef.current, heightRef.current);
      ctx.fillStyle = gridColor;
      ctx.globalAlpha = opacity;

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      // User specified Mouse Interaction Radius: 1.2
      // We'll treat this as a multiplier for a base radius (e.g., 100px) -> 120px
      const interactionRadius = 120 * mouseRadius; 

      dotsRef.current.forEach((dot) => {
        const dx = mouseX - dot.originX;
        const dy = mouseY - dot.originY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let targetX = dot.originX;
        let targetY = dot.originY;

        if (distance < interactionRadius) {
          const force = (interactionRadius - distance) / interactionRadius;
          const angle = Math.atan2(dy, dx);
          // Push away
          // User specified Ripple Intensity: 0.09. This might be subtle.
          // Let's assume 0.09 is the strength factor.
          // We'll multiply by a larger number to make it visible, e.g., 50.
          const moveDistance = force * 50 * rippleIntensity * 10; // * 10 to make 0.09 noticeable
          
          targetX -= Math.cos(angle) * moveDistance;
          targetY -= Math.sin(angle) * moveDistance;
        }

        // Ease back to position
        dot.x += (targetX - dot.x) * 0.1;
        dot.y += (targetY - dot.y) * 0.1;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, RADIUS, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gridColor, rippleIntensity, opacity, mouseRadius]);

  return <canvas ref={canvasRef} className={className} />;
}
