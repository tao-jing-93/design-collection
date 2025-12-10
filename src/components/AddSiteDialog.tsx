import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Plus,
  Loader2,
  Image as ImageIcon,
  UploadCloud,
  X,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Site } from "./SiteCard";
import { InteractiveHoverButton } from "./ui/interactive-hover-button";
import { uploadImageFile } from "../utils/upload";

interface AddSiteDialogProps {
  onAddSite: (site: Omit<Site, "id">) => Promise<Site | void>;
  existingCategories: string[];
  existingTags: string[];
}

export function AddSiteDialog({
  onAddSite,
  existingCategories,
  existingTags,
}: AddSiteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Removed internal auth step as user is already authenticated via App
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [resourceType, setResourceType] = useState<
    "link" | "prompt"
  >("link");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // For manual text input
  const [storagePath, setStoragePath] = useState(""); // To be set after upload

  // Local image handling (Delay upload)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    null,
  );

  const [categoriesInput, setCategoriesInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const PRESET_CATEGORIES = [
    "动效",
    "色彩与材质",
    "控件与模式",
    "工具",
    "逛逛",
    "图标与图形",
    "字体",
    "排版",
    "提示词",
    "理论与技巧",
  ];

  const uniqueCategories = Array.from(
    new Set([...PRESET_CATEGORIES, ...existingCategories]),
  ).sort();

  // Handle global paste events when dialog is open
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      if (!isOpen) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            setImageFile(file);

            // Create local preview
            const localUrl = URL.createObjectURL(file);
            setPreviewUrl(localUrl);
            setImageUrl(""); // Clear manual URL input
            toast.success("Image pasted (will upload on save)");
            return;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () =>
      window.removeEventListener("paste", handlePaste);
  }, [isOpen]);

  // Clean up object URL on unmount or change
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const tags = tagsInput
      .split(/[,，]/)
      .map((t) => t.trim())
      .filter((t) => t !== "");
    const categories = categoriesInput
      .split(/[,，]/)
      .map((c) => c.trim())
      .filter((c) => c !== "");

    try {
      let finalImageUrl = imageUrl;
      let finalStoragePath = storagePath;

      // Perform upload if we have a file
      if (imageFile) {
        try {
          const { url, path } =
            await uploadImageFile(imageFile);
          finalImageUrl = url;
          finalStoragePath = path;
        } catch (uploadError) {
          console.error(uploadError);
          toast.error(
            "Failed to upload image. Please try again.",
          );
          setIsSubmitting(false);
          return;
        }
      }

      await onAddSite({
        title,
        url: resourceType === "link" ? url : undefined,
        description,
        imageUrl:
          finalImageUrl ||
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
        categories,
        tags,
        storagePath: finalStoragePath || undefined,
      });

      toast.success("Resource added");
      resetForm();
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to add. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setResourceType("link");
    setTitle("");
    setUrl("");
    setDescription("");
    setImageUrl("");
    setStoragePath("");
    setImageFile(null);
    setPreviewUrl(null);
    setCategoriesInput("");
    setTagsInput("");
  };

  const toggleCategory = (cat: string) => {
    const current = categoriesInput
      .split(/[,，]/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (current.includes(cat)) {
      setCategoriesInput(
        current.filter((c) => c !== cat).join(", "),
      );
    } else {
      setCategoriesInput([...current, cat].join(", "));
    }
  };

  const toggleTag = (tag: string) => {
    const current = tagsInput
      .split(/[,，]/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (current.includes(tag)) {
      setTagsInput(current.filter((t) => t !== tag).join(", "));
    } else {
      setTagsInput([...current, tag].join(", "));
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset happens on successful submit, or we can choose to reset on close.
      // Typically preserving state is better if accidental close,
      // but here we might want to clear auth if closed?
      // Let's keep it simple and preserve state until success.
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <InteractiveHoverButton
          text="Submit"
          className="border-neutral-800 text-neutral-300 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span]:translate-x-0 [&>span]:before:content-[''] [&>span]:before:size-4 [&>span]:before:bg-current [&>span]:before:[mask-image:url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%2024%2024%27%20fill%3D%27none%27%20stroke%3D%27currentColor%27%20stroke-width%3D%272%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%3E%3Cpath%20d%3D%27M5%2012h14%27%2F%3E%3Cpath%20d%3D%27M12%205v14%27%2F%3E%3C%2Fsvg%3E')] [&>span]:before:[mask-size:contain] [&>span]:before:[mask-repeat:no-repeat] [&>span]:before:[mask-position:center] [&>div:last-child]:opacity-0 group-hover:[&>div:last-child]:opacity-100"
        />
      </DialogTrigger>
      <DialogContent className="bg-[#1C1C1E] border-neutral-800 text-neutral-100 sm:max-w-[500px] shadow-2xl outline-none">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Add New Resource</DialogTitle>
            <DialogDescription className="text-neutral-400">
              Share a high-quality design resource.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            {/* Resource Type Toggle */}
            <div className="flex p-1 bg-[#121212] rounded-lg border border-neutral-800">
              <button
                type="button"
                onClick={() => setResourceType("link")}
                className={`flex-1 py-1.5 text-xs font-medium rounded transition-all ${
                  resourceType === "link"
                    ? "bg-neutral-800 text-white shadow-sm"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                Link Resource
              </button>
              <button
                type="button"
                onClick={() => {
                  setResourceType("prompt");
                  // Auto-add "提示词" category if not present
                  if (!categoriesInput.includes("提示词")) {
                    const current = categoriesInput
                      .split(/[,，]/)
                      .map((s) => s.trim())
                      .filter(Boolean);
                    setCategoriesInput(
                      [...current, "提示词"].join(", "),
                    );
                  }
                }}
                className={`flex-1 py-1.5 text-xs font-medium rounded transition-all ${
                  resourceType === "prompt"
                    ? "bg-neutral-800 text-white shadow-sm"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                Prompt / Text
              </button>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-neutral-400 text-xs uppercase tracking-wider font-medium"
              >
                Name
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-[#121212] border-neutral-800 text-white placeholder:text-neutral-600 focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-neutral-600 transition-all"
                placeholder="Resource Name"
                required
              />
            </div>

            {resourceType === "link" && (
              <div className="space-y-2">
                <Label
                  htmlFor="url"
                  className="text-neutral-400 text-xs uppercase tracking-wider font-medium"
                >
                  Link
                </Label>
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-[#121212] border-neutral-800 text-white placeholder:text-neutral-600 focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-neutral-600 transition-all"
                  placeholder="https://..."
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-neutral-400 text-xs uppercase tracking-wider font-medium"
                >
                  Categories
                </Label>
                <div className="relative group/input">
                  <Input
                    id="category"
                    value={categoriesInput}
                    onChange={(e) =>
                      setCategoriesInput(e.target.value)
                    }
                    className="bg-[#121212] border-neutral-800 text-white placeholder:text-neutral-600 focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-neutral-600 transition-all pr-8"
                    placeholder="UI, Icons..."
                    required
                  />
                  {categoriesInput && (
                    <button
                      type="button"
                      onClick={() => setCategoriesInput("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white opacity-0 group-hover/input:opacity-100 transition-opacity"
                      title="Clear"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                {/* Presets & Existing Categories */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {uniqueCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`px-2 py-0.5 text-[10px] rounded border transition-colors ${
                        categoriesInput.includes(cat)
                          ? "bg-white text-black border-white"
                          : "bg-[#1C1C1E] text-neutral-400 border-neutral-800 hover:border-neutral-600 hover:bg-white/5"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="tags"
                  className="text-neutral-400 text-xs uppercase tracking-wider font-medium"
                >
                  Tags
                </Label>
                <div className="relative group/input">
                  <Input
                    id="tags"
                    value={tagsInput}
                    onChange={(e) =>
                      setTagsInput(e.target.value)
                    }
                    className="bg-[#121212] border-neutral-800 text-white placeholder:text-neutral-600 focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-neutral-600 transition-all pr-8"
                    placeholder="dark, clean..."
                  />
                  {tagsInput && (
                    <button
                      type="button"
                      onClick={() => setTagsInput("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white opacity-0 group-hover/input:opacity-100 transition-opacity"
                      title="Clear"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                {/* Existing Tags */}
                {existingTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {existingTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-2 py-0.5 text-[10px] rounded border transition-colors ${
                          tagsInput.includes(tag)
                            ? "bg-white text-black border-white"
                            : "bg-[#1C1C1E] text-neutral-400 border-neutral-800 hover:border-neutral-600 hover:bg-white/5"
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="image"
                  className="text-neutral-400 text-xs uppercase tracking-wider font-medium"
                >
                  Screenshot URL
                </Label>
                <span className="text-xs text-blue-400 flex items-center gap-1">
                  <UploadCloud className="h-3 w-3" /> Ctrl+V to
                  Paste Image
                </span>
              </div>
              <div className="relative">
                <Input
                  id="image"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    // If user manually types a URL, clear the uploaded file state
                    setImageFile(null);
                    setPreviewUrl(null);
                    setStoragePath("");
                  }}
                  className="bg-[#121212] border-neutral-800 text-white placeholder:text-neutral-600 focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-neutral-600 transition-all pr-10"
                  placeholder="https://... or paste image"
                />
                {(previewUrl || imageUrl) && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded border border-neutral-700 overflow-hidden">
                    <img
                      src={previewUrl || imageUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="desc"
                className="text-neutral-400 text-xs uppercase tracking-wider font-medium"
              >
                Description
              </Label>
              <Textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-[#121212] border-neutral-800 text-white placeholder:text-neutral-600 focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-neutral-600 transition-all min-h-[80px]"
                placeholder="Brief description..."
              />
            </div>
          </div>

          <DialogFooter>
            <div className="w-full">
              <InteractiveHoverButton
                type="submit"
                disabled={isSubmitting}
                text={
                  isSubmitting ? "Saving..." : "Save Resource"
                }
                className="w-full"
              />
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}