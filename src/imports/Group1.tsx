import svgPaths from "./svg-bu9duekinr";
import imgImage1 from "figma:asset/5fe655e20a7fa102f3d85c7cfb6cccf13980563c.png";

export default function Group() {
  return (
    <div className="relative size-full">
      <div className="absolute left-0 size-[580px] top-0" data-name="image 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage1} />
      </div>
      <div className="absolute h-[227.679px] left-[437px] top-[171.66px] w-[45px]" data-name="Subtract">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 45 228">
          <path d={svgPaths.p1d4b1700} fill="var(--fill-0, black)" id="Subtract" />
        </svg>
      </div>
    </div>
  );
}