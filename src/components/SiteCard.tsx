import { ArrowUpRight, Pencil, Copy, Terminal } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner@2.0.3";

export interface Site {
  id: string;
  title: string;
  url?: string;
  description: string;
  imageUrl: string;
  categories: string[];
  tags: string[];
  storagePath?: string;
  // Legacy field support - optional
  category?: string;
}

interface SiteCardProps {
  site: Site;
  onEdit?: (site: Site) => void;
}

export function SiteCard({ site, onEdit }: SiteCardProps) {
  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(site.description);
    toast.success("Prompt copied to clipboard");
  };

  // Extract hostname for favicon fallback
  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  return (
    <div className="group h-64 w-full [perspective:1000px]">
      {/* Inner Container with 3D Transition */}
      <div className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)_scale(1.05)]">
        
        {/* Front Face (Info) */}
        <div className="absolute inset-0 h-full w-full rounded-2xl bg-[#1C1C1E] p-6 flex flex-col gap-3 shadow-[0px_0px_1px_0px_rgba(255,255,255,0.3)] [backface-visibility:hidden]">
          {/* Main Link for Mobile/Front interaction */}
          {site.url ? (
            <a 
              href={site.url}
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute inset-0 z-0 w-full h-full rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/20"
              aria-label={`Visit ${site.title}`}
            />
          ) : (
            <div 
              className="absolute inset-0 z-0"
            />
          )}
          
          <div className="relative z-10 pointer-events-none">
            {/* Logo Placeholder */}
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white overflow-hidden">
              {site.url ? (
                <img 
                  src={`https://www.google.com/s2/favicons?sz=128&domain_url=${site.url}`}
                  onError={(e) => {
                    // Fallback to icon.horse if google fails
                    const target = e.target as HTMLImageElement;
                    const hostname = getHostname(site.url!);
                    if (target.src.includes("google")) {
                       target.src = `https://icon.horse/icon/${hostname}`;
                    } else {
                       // If both fail, maybe show a default icon or nothing
                       // But we'll keep the broken image hidden or show a placeholder via parent bg
                       target.style.display = 'none';
                    }
                  }}
                  alt={site.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Terminal className="h-5 w-5 text-black" />
              )}
            </div>
            
            {/* Title */}
            <h3 className="mb-1 text-base font-semibold text-white tracking-tight line-clamp-1">
              {site.title}
            </h3>
            
            {/* Description */}
            <p className="text-white/45 leading-relaxed line-clamp-2 text-[13px] text-[rgba(255,255,255,0.65)]">
              {site.description}
            </p>
            
            {/* Tags */}
            {site.tags && site.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 overflow-hidden h-5 mt-[4px] mr-[0px] mb-[0px] ml-[0px]">
                {site.tags.slice(0, 3).map((tag, i) => (
                   <span key={i} className="text-xs text-white/45 text-[11px] text-[rgba(255,255,255,0.65)]">#{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Footer: Category & Link */}
          <div className="mt-auto relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1 pointer-events-none">
                {site.categories?.slice(0, 2).map((cat, i) => (
                  <span key={i} className="inline-flex items-center justify-center rounded-lg bg-white/6 px-2.5 h-7 text-xs font-medium text-white/45">
                    {cat}
                  </span>
                ))}
              </div>
              
              {site.url && (
                <a 
                  href={site.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/45 hover:text-white transition-colors shrink-0 ml-2 pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ArrowUpRight className="h-6 w-6 opacity-45 hover:opacity-100" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Back Face (Image) */}
        <div className="absolute inset-0 h-full w-full rounded-2xl overflow-hidden bg-[#1C1C1E] shadow-[0px_0px_1px_0px_rgba(255,255,255,0.3)] [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div className="relative h-full w-full">
            <ImageWithFallback
              src={site.imageUrl}
              alt={site.title}
              loading="lazy"
              className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Main Area Link */}
            {site.url ? (
              <a 
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
               // For Prompts: Center Copy Button on Back
               <div className="absolute inset-0 z-10 flex items-center justify-center">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium transition-all border border-white/10"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copy Prompt</span>
                  </button>
               </div>
            )}
          </div>
        </div>
        
      </div>

      {/* Edit Button (Floating outside flip container to ensure clickability) */}
      <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onEdit?.(site);
          }}
          className="absolute bottom-4 right-4 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur-md text-white/70 hover:bg-white hover:text-black transition-all border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
          title="Edit Resource"
      >
          <Pencil className="h-4 w-4" />
      </button>
    </div>
  );
}
