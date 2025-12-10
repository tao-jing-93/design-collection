import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Loader2, Trash2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Site } from "./SiteCard";
import { uploadImageFile } from "../utils/upload";

interface EditSiteDialogProps {
  site: Site;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateSite: (
    id: string,
    updates: Partial<Site>,
  ) => Promise<Site | void>;
  onDeleteSite: (id: string) => Promise<void>;
  existingCategories: string[];
  existingTags: string[];
}

export function EditSiteDialog({
  site,
  open,
  onOpenChange,
  onUpdateSite,
  onDeleteSite,
  existingCategories,
  existingTags,
}: EditSiteDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state
  const [resourceType, setResourceType] = useState<
    "link" | "prompt"
  >("link");
  const [title, setTitle] = useState(site.title);
  const [url, setUrl] = useState(site.url || "");
  const [description, setDescription] = useState(
    site.description,
  );
  const [imageUrl, setImageUrl] = useState(site.imageUrl);
  const [storagePath, setStoragePath] = useState(
    site.storagePath || "",
  );

  // Local image handling (Delay upload)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    null,
  );

  const [categoriesInput, setCategoriesInput] = useState(
    site.categories?.join(", ") || site.category || "",
  );
  const [tagsInput, setTagsInput] = useState(
    site.tags.join(", "),
  );

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

  // Reset form when site changes
  useEffect(() => {
    if (open) {
      setResourceType(site.url ? "link" : "prompt");
      setTitle(site.title);
      setUrl(site.url || "");
      setDescription(site.description);
      setImageUrl(site.imageUrl);
      setStoragePath(site.storagePath || "");
      setImageFile(null);
      setPreviewUrl(null);
      setCategoriesInput(
        site.categories?.join(", ") || site.category || "",
      );
      setTagsInput(site.tags.join(", "));
    }
  }, [site, open]);

  // Handle paste
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      if (!open) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();

            setImageFile(file);
            const localUrl = URL.createObjectURL(file);
            setPreviewUrl(localUrl);
            // Don't clear imageUrl yet, just override visual preview
            toast.success("Image pasted (will upload on save)");
            return;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () =>
      window.removeEventListener("paste", handlePaste);
  }, [open]);

  // Clean up object URL
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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

      // Perform upload if we have a NEW file
      if (imageFile) {
        try {
          const { url, path } =
            await uploadImageFile(imageFile);
          finalImageUrl = url;
          finalStoragePath = path;
        } catch (uploadError) {
          console.error(uploadError);
          toast.error(
            "Failed to upload new image. Please try again.",
          );
          setIsSubmitting(false);
          return;
        }
      }

      await onUpdateSite(site.id, {
        title,
        url: resourceType === "link" ? url : undefined, // Send undefined to remove existing URL
        description,
        imageUrl: finalImageUrl,
        storagePath: finalStoragePath || undefined,
        categories,
        tags,
      });

      toast.success("Resource updated");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (
      confirm("Are you sure you want to delete this resource?")
    ) {
      setIsDeleting(true);
      try {
        await onDeleteSite(site.id);
        toast.success("Resource deleted");
        onOpenChange(false);
      } catch (error) {
        toast.error("Failed to delete");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1C1C1E] border-neutral-800 text-neutral-100 sm:max-w-[500px] shadow-2xl outline-none">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
            <DialogDescription className="text-neutral-400">
              Update details for {site.title}
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
                htmlFor="edit-title"
                className="text-neutral-400 text-xs uppercase tracking-wider font-medium"
              >
                Name
              </Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-[#121212] border-neutral-800 focus-visible:border-neutral-700 focus-visible:ring-0"
                required
              />
            </div>

            {resourceType === "link" && (
              <div className="space-y-2">
                <Label
                  htmlFor="edit-url"
                  className="text-neutral-400 text-xs uppercase tracking-wider font-medium"
                >
                  Link
                </Label>
                <Input
                  id="edit-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-[#121212] border-neutral-800 focus-visible:border-neutral-700 focus-visible:ring-0"
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="edit-category"
                  className="text-neutral-400 text-xs uppercase tracking-wider font-medium"
                >
                  Categories
                </Label>
                <div className="relative group/input">
                  <Input
                    id="edit-category"
                    value={categoriesInput}
                    onChange={(e) =>
                      setCategoriesInput(e.target.value)
                    }
                    className="bg-[#121212] border-neutral-800 focus-visible:border-neutral-700 focus-visible:ring-0 pr-8"
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
                          : "bg-[#1C1C1E] text-neutral-400 border-neutral-800 hover:border-neutral-600"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="edit-tags"
                  className="text-neutral-400 text-xs uppercase tracking-wider font-medium"
                >
                  Tags
                </Label>
                <div className="relative group/input">
                  <Input
                    id="edit-tags"
                    value={tagsInput}
                    onChange={(e) =>
                      setTagsInput(e.target.value)
                    }
                    className="bg-[#121212] border-neutral-800 focus-visible:border-neutral-700 focus-visible:ring-0 pr-8"
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
                            : "bg-[#1C1C1E] text-neutral-400 border-neutral-800 hover:border-neutral-600"
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
                  htmlFor="edit-image"
                  className="text-neutral-400 text-xs uppercase tracking-wider font-medium"
                >
                  Screenshot URL
                </Label>
                <span className="text-xs text-blue-400 flex items-center gap-1">
                  <UploadCloud className="h-3 w-3" /> Ctrl+V to
                  Replace
                </span>
              </div>
              <div className="relative">
                <Input
                  id="edit-image"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setStoragePath("");
                    setImageFile(null);
                    setPreviewUrl(null);
                  }}
                  className="bg-[#121212] border-neutral-800 focus-visible:border-neutral-700 focus-visible:ring-0 pr-10"
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
                htmlFor="edit-desc"
                className="text-neutral-400 text-xs uppercase tracking-wider font-medium"
              >
                Description
              </Label>
              <Textarea
                id="edit-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-[#121212] border-neutral-800 focus-visible:border-neutral-700 focus-visible:ring-0 min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting || isSubmitting}
              className="mr-auto"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              type="submit"
              className="bg-white hover:bg-neutral-200 text-black font-medium h-10 min-w-[100px]"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}