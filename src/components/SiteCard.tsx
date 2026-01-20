import React, { useEffect, useState } from "react";
import { Pencil, Terminal } from "lucide-react";
const placeholderIcon = "/logo.png";

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
  const [imageStatus, setImageStatus] = useState<
    "loading" | "loaded" | "error"
  >("loading");
  const [isHovered, setIsHovered] = useState(false);
  const [isEditHovered, setIsEditHovered] = useState(false);

  const normalizedImageUrl = site.imageUrl?.trim() ?? "";
  const hasImage = normalizedImageUrl !== "";

  useEffect(() => {
    setImageStatus(normalizedImageUrl ? "loading" : "error");
  }, [normalizedImageUrl]);

  // Extract hostname for favicon fallback
  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const tags = site.tags?.slice(0, 3) ?? [];
  const descriptionText = [site.description, ...tags.map((tag) => `#${tag}`)]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className="group relative w-full rounded-2xl p-2 transition-all duration-200"
      style={{
        height: 270,
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        backgroundColor: isHovered ? "#202023" : "#1C1C1E",
        boxShadow: isHovered
          ? "0px 0px 1px 0px rgba(255,255,255,0.45), 0px 12px 30px -16px rgba(0,0,0,0.7)"
          : "0px 0px 1px 0px rgba(255,255,255,0.3)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsEditHovered(false);
      }}
    >
      {site.url ? (
        <a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-0 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-white/20"
          aria-label={`Visit ${site.title}`}
        />
      ) : null}

      <div className="relative z-10 flex h-full flex-col gap-3 pointer-events-none">
        <div className="flex w-full items-start gap-3" style={{ minHeight: 62 }}>
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg">
            {site.url ? (
              <img
                src={`https://www.google.com/s2/favicons?sz=128&domain_url=${site.url}`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const hostname = getHostname(site.url!);
                  if (target.src.includes("google")) {
                    target.src = `https://icon.horse/icon/${hostname}`;
                  } else {
                    target.style.display = "none";
                  }
                }}
                alt={site.title}
                loading="lazy"
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-white">
                <Terminal className="h-5 w-5 text-black" />
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-0">
            <h3
              className="line-clamp-1 text-base font-semibold text-white"
              style={{ lineHeight: "22px" }}
            >
              {site.title}
            </h3>
            <p
              className="line-clamp-2 text-xs text-white/45"
              style={{ lineHeight: "20px", letterSpacing: "-0.24px" }}
            >
              {descriptionText}
            </p>
          </div>
        </div>

        <div
          className="relative w-full shrink-0 overflow-hidden"
          style={{
            height: 180,
            backgroundColor: "#2a2a2a",
            borderRadius: 14,
          }}
        >
          {hasImage && (
            <img
              key={normalizedImageUrl}
              src={normalizedImageUrl}
              alt={site.title}
              loading="lazy"
              onLoad={() => setImageStatus("loaded")}
              onError={() => setImageStatus("error")}
              className="absolute inset-0 size-full object-cover transition-opacity duration-300"
              style={{ opacity: imageStatus === "loaded" ? 1 : 0 }}
            />
          )}
          <div
            className="absolute inset-0 transition-opacity duration-200 pointer-events-none"
            style={{
              backgroundColor: "rgba(0,0,0,0.45)",
              opacity: isHovered ? 0 : 1,
            }}
          />
          {imageStatus !== "loaded" && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className="relative h-16 w-16 shrink-0"
                  style={{ width: 64, height: 64 }}
                >
                  <img
                    alt=""
                    src={placeholderIcon}
                    className="absolute inset-0 object-contain pointer-events-none"
                    style={{ opacity: 0.6, width: "100%", height: "100%" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Button (Floating outside flip container to ensure clickability) */}
      <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onEdit?.(site);
          }}
          onMouseEnter={() => setIsEditHovered(true)}
          onMouseLeave={() => setIsEditHovered(false)}
          className="absolute bottom-4 right-4 z-30 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md text-white/70 transition-all opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto hover:text-white"
          style={{
            backgroundColor: isEditHovered
              ? "rgba(115,115,115,0.60)"
              : "rgba(115,115,115,0.35)",
            borderWidth: 0,
            borderStyle: "none",
            borderColor: "rgba(0, 0, 0, 0)",
            borderImage: "none",
          }}
          title="Edit Resource"
      >
          <Pencil className="h-4 w-4" />
      </button>
    </div>
  );
}
