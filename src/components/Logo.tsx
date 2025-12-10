import { cn } from "../components/ui/utils";
import logoImg from "figma:asset/5fe655e20a7fa102f3d85c7cfb6cccf13980563c.png";

const svgPath = "M0 0C27.9085 29.7743 45 69.8106 45 113.84C45 157.869 27.9082 197.904 0 227.679V0Z";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* 
         The original design is 580x580. 
         We use a viewBox approach to scale it properly to any container size.
      */}
      <svg viewBox="0 0 580 580" className="w-full h-full block">
        <foreignObject width="580" height="580">
          <div className="relative w-[580px] h-[580px]">
            <div className="absolute left-0 w-[580px] h-[580px] top-0">
               <img 
                 alt="Logo" 
                 className="absolute inset-0 max-w-none object-cover w-full h-full" 
                 src={logoImg} 
               />
            </div>
            <div className="absolute h-[227.679px] left-[437px] top-[171.66px] w-[45px]">
              <svg className="block w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 45 228">
                <path d={svgPath} fill="black" />
              </svg>
            </div>
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}
