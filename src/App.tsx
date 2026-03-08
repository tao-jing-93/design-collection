import { useState, useEffect } from "react";
import { Site, SiteCard } from "./components/SiteCard";
import { AddSiteDialog } from "./components/AddSiteDialog";
import { EditSiteDialog } from "./components/EditSiteDialog";
import { AuthDialog } from "./components/AuthDialog";
import {
  Search,
  Loader2,
  LayoutGrid,
  Palette,
  Code,
  GraduationCap,
  Lightbulb,
  Type,
  PenTool,
  Layers,
  Hash,
  User,
  LogOut,
  Filter,
  Menu,
} from "lucide-react";
import { Logo } from "./components/Logo";
import { RollingText } from "./components/ui/rolling-text";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "./components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./components/ui/alert-dialog";
import { Avatar, AvatarImage, AvatarFallback } from "./components/ui/avatar";
import { Toaster, toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "./utils/supabase/info";
import { supabase } from "./utils/supabase/client";
import { cn } from "./components/ui/utils";
import { ALLOWED_EMAILS } from "./utils/adminList";

import { LandingPage } from "./components/LandingPage";

// Helper: Weighted shuffle for random recommendation
// Items with "逛逛" tag get a boost in sorting weight
const weightedShuffle = (items: Site[]) => {
  return items
    .map((item) => {
      // Check if "逛逛" is in tags or categories
      const isBoosted =
        item.tags?.some((t) => t === "逛逛") ||
        item.categories?.some((c) => c === "逛逛");
        
      // Base random 0-1. Boost adds 0.6 to ensure higher probability of being on top,
      // but still allows some randomness (overlap in 0.6-1.0 range).
      const weight = Math.random() + (isBoosted ? 0.6 : 0);
      return { item, weight };
    })
    .sort((a, b) => b.weight - a.weight)
    .map((x) => x.item);
};

// Fallback data
const INITIAL_SITES: Site[] = [];

export default function App() {
  // Add favicon programmatically
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22white%22/><text x=%2250%22 y=%2250%22 font-family=%22sans-serif%22 font-size=%2260%22 text-anchor=%22middle%22 dy=%22.35em%22 fill=%22black%22>G</text></svg>';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const [sites, setSites] = useState<Site[]>(INITIAL_SITES);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [isLandingPage, setIsLandingPage] = useState(true);

  // Switch to explore view when searching
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setIsLandingPage(false);
    }
  }, [searchQuery]);

  const handleNavigate = (category?: string) => {
    if (category) setSelectedCategory(category);
    setIsLandingPage(false);
  };

  const handleLogoClick = () => {
    setSearchQuery("");
    setSelectedCategory("全部");
    setIsLandingPage(true);
  };


  // Auth State
  const [user, setUser] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [unauthorizedEmail, setUnauthorizedEmail] = useState<string | null>(null);

  // Edit Dialog State
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    const validateUser = async (session: any) => {
      console.log("Checking auth session:", session);

      if (!session?.user) {
        setUser(null);
        return;
      }

      const userEmail = session.user.email;
      if (!userEmail) {
        console.error("No email found in session");
        toast.error("Login Failed: No email address returned.");
        await supabase.auth.signOut();
        setUser(null);
        return;
      }

      // Case-insensitive check
      const isAllowed = ALLOWED_EMAILS.some(
        (email) => email.toLowerCase() === userEmail.toLowerCase()
      );

      if (isAllowed) {
        console.log("User authorized:", userEmail);
        setUser(session.user);
        setIsAuthOpen(false);
      } else {
        console.warn("User unauthorized:", userEmail);
        setUnauthorizedEmail(userEmail);
        setUser(null);
      }
    };

    // Initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      validateUser(session);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event);
      validateUser(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("已退出登录");
  };

  // Fetch sites from server（不带 Authorization，走匿名调用，避免 sb_ key 被网关校验 401）
  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-5cb5e93b/sites`,
          {
            headers: {},
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch sites");
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          // Normalize data structure: ensure categories exists
          const normalizedData = data.map((site) => ({
            ...site,
            categories:
              site.categories || (site.category ? [site.category] : []),
          }));
          
          // Apply weighted shuffle for random recommendation
          const shuffledData = weightedShuffle(normalizedData);
          setSites(shuffledData);
        }
      } catch (error) {
        console.error("Error fetching sites:", error);
        toast.error("无法加载站点列表");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSites();
  }, []);

  const handleAddSite = async (newSiteData: Omit<Site, "id">) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5cb5e93b/sites`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(newSiteData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to add site");
      }

      const newSite = await response.json();
      setSites((prev) => [newSite, ...prev]);
      return newSite;
    } catch (error) {
      console.error("Error adding site:", error);
      throw error;
    }
  };

  const handleUpdateSite = async (id: string, updates: Partial<Site>) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5cb5e93b/sites/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(updates),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update site");
      }

      const updatedSite = await response.json();
      setSites((prev) => prev.map((s) => (s.id === id ? updatedSite : s)));
      return updatedSite;
    } catch (error) {
      console.error("Error updating site:", error);
      throw error;
    }
  };

  const handleDeleteSite = async (id: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5cb5e93b/sites/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete site");
      }

      setSites((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Error deleting site:", error);
      throw error;
    }
  };

  const handleEditClick = (site: Site) => {
    if (!user) {
      toast.error("请先登录");
      setIsAuthOpen(true);
      return;
    }
    setEditingSite(site);
    setIsEditOpen(true);
  };

  // Derive unique categories and tags from sites
  const allCategories = Array.from(
    new Set(
      sites.flatMap((s) => s.categories || (s.category ? [s.category] : []))
    )
  )
    .filter(Boolean)
    .sort();
  const allTags = Array.from(new Set(sites.flatMap((s) => s.tags)))
    .filter(Boolean)
    .sort();

  const categories = ["全部", ...allCategories];

  const filteredSites = sites.filter((site) => {
    const siteCategories =
      site.categories || (site.category ? [site.category] : []);

    const matchesSearch =
      site.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      siteCategories.some((c) =>
        c.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "全部" || siteCategories.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-[100dvh] overflow-y-auto overflow-x-hidden bg-[#121212] text-[#E1E1E1] font-sans selection:bg-blue-500/30">
      <Toaster theme="dark" position="bottom-right" />

      <AuthDialog open={isAuthOpen} onOpenChange={setIsAuthOpen} />

      <AlertDialog open={!!unauthorizedEmail} onOpenChange={() => setUnauthorizedEmail(null)}>
        <AlertDialogContent className="bg-[#1C1C1E] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Access Denied</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-400">
              The email <span className="text-white font-medium">{unauthorizedEmail}</span> is not authorized to access the admin features.
              <br /><br />
              To enable access, add this email to the <code className="bg-neutral-800 px-1 py-0.5 rounded text-xs">ALLOWED_EMAILS</code> list in <code className="bg-neutral-800 px-1 py-0.5 rounded text-xs">/utils/adminList.ts</code>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => {
                supabase.auth.signOut();
                setUnauthorizedEmail(null);
                setUser(null);
              }} 
              className="bg-white text-black hover:bg-neutral-200 border-none"
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#121212]/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 md:gap-3">
            {/* Mobile Filter Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden -ml-2 text-neutral-400 hover:text-white hover:bg-white/5"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-[#1C1C1E] border-white/10 text-white w-[280px] p-0">
                <SheetHeader className="p-4 border-b border-white/5 text-left">
                  <SheetTitle className="text-neutral-100">Categories</SheetTitle>
                  <SheetDescription className="sr-only">
                    Select a category to filter resources
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-1 p-2 overflow-y-auto max-h-[calc(100vh-80px)]">
                  {categories.map((category) => {
                    // Determine icon based on category name (replicated logic for mobile)
                    let Icon = Hash;
                    const lower = category.toLowerCase();
                    if (category === "全部") Icon = LayoutGrid;
                    else if (lower.includes("design") || lower.includes("ui") || lower.includes("ux") || lower.includes("color")) Icon = Palette;
                    else if (lower.includes("dev") || lower.includes("code") || lower.includes("api") || lower.includes("frontend")) Icon = Code;
                    else if (lower.includes("tool") || lower.includes("util")) Icon = PenTool;
                    else if (lower.includes("learn") || lower.includes("study") || lower.includes("course")) Icon = GraduationCap;
                    else if (lower.includes("resource") || lower.includes("asset")) Icon = Layers;
                    else if (lower.includes("inspir") || lower.includes("idea")) Icon = Lightbulb;
                    else if (lower.includes("font") || lower.includes("typo")) Icon = Type;

                    return (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsMobileMenuOpen(false);
                        }}
                        className={cn(
                          "h-[40px] px-4 rounded-lg text-[14px] font-medium transition-all duration-200 flex items-center gap-3 w-full text-left",
                          selectedCategory === category
                            ? "bg-white/10 text-white"
                            : "text-neutral-400 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <Icon className="w-4 h-4 opacity-70" />
                        {category}
                      </button>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo Icon */}
            <button onClick={handleLogoClick} className="h-8 w-8 flex items-center justify-center hover:opacity-80 transition-opacity">
              <Logo className="w-8 h-8 rounded-xl" />
            </button>
            <button onClick={handleLogoClick} className="hidden sm:block">
              <h1 className="text-lg tracking-[0.04em] text-white font-bold font-[Sansation]">
                Gilded Collection
              </h1>
            </button>
          </div>

          <div className="flex-1 max-w-lg relative group mx-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500 group-focus-within:text-white transition-colors" />
            <Input
              className="pl-10 bg-[#1C1C1E] border-transparent focus-visible:border-neutral-700 focus-visible:ring-0 transition-all text-sm text-neutral-200 placeholder:text-neutral-600 rounded-lg h-10"
              placeholder="Search for resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <AddSiteDialog
                    onAddSite={handleAddSite}
                    existingCategories={allCategories}
                    existingTags={allTags}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.user_metadata?.avatar_url}
                          alt={user.email}
                        />
                        <AvatarFallback className="bg-[#2C2C2E] text-xs">
                          {user.email?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 bg-[#1C1C1E] border-white/10 text-white"
                    align="end"
                    forceMount
                  >
                    <DropdownMenuItem className="flex-col items-start gap-1 p-3 focus:bg-white/5">
                      <p className="text-xs font-medium leading-none text-neutral-400">
                        Signed in as
                      </p>
                      <p className="text-sm font-medium leading-none">
                        {user.email}
                      </p>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-red-400 focus:text-red-400 focus:bg-red-500/10 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button
                onClick={() => setIsAuthOpen(true)}
                variant="ghost"
                className="text-neutral-400 hover:text-white hover:bg-white/5 gap-2"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Category Filters - Sticky (Only on Explore/List view) */}
      {!isLandingPage && (
        <div className="hidden md:block sticky top-16 z-40 border-b border-white/5 bg-[#121212]/80 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-3 flex flex-wrap items-center gap-3">
            {categories.map((category) => {
              // Determine icon based on category name
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
              else if (lower.includes("tool") || lower.includes("util"))
                Icon = PenTool;
              else if (
                lower.includes("learn") ||
                lower.includes("study") ||
                lower.includes("course")
              )
                Icon = GraduationCap;
              else if (lower.includes("resource") || lower.includes("asset"))
                Icon = Layers;
              else if (lower.includes("inspir") || lower.includes("idea"))
                Icon = Lightbulb;
              else if (lower.includes("font") || lower.includes("typo"))
                Icon = Type;

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "h-[38px] px-4 rounded-full text-[14px] font-medium transition-all duration-200 overflow-hidden flex items-center gap-2",
                    selectedCategory === category
                      ? "bg-white/10 text-[#a1a1a1] shadow-[0px_0px_1px_0px_rgba(255,255,255,0.5)]"
                      : "bg-[#1C1C1E] text-[#a1a1a1] shadow-[0px_0px_1px_0px_rgba(255,255,255,0.3)] hover:bg-[#2C2C2E]"
                  )}
                >
                  <Icon className="w-3.5 h-3.5 opacity-70" />
                  <RollingText
                    active={selectedCategory === category}
                    className="text-[13px]"
                  >
                    {category}
                  </RollingText>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-6 pb-8">
        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-neutral-500">
            <Loader2 className="h-8 w-8 animate-spin mb-4 text-white" />
            <p>Loading resources...</p>
          </div>
        ) : isLandingPage ? (
          <LandingPage 
            sites={sites} 
            categories={categories} 
            onNavigate={handleNavigate} 
            onEdit={handleEditClick}
          />
        ) : /* Grid */
        filteredSites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {filteredSites.map((site) => (
              <SiteCard
                key={site.id}
                site={site}
                onEdit={handleEditClick}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-neutral-500">
            <Search className="h-12 w-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">No resources found</p>
            <p className="text-sm mt-1">Try searching for something else</p>
          </div>
        )}
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-white/5 py-12 mt-12 bg-[rgba(10,10,10,0)]">
        <div className="container mx-auto px-6 text-center text-sm text-neutral-600">
          <p>© 2025 Gilded Collection by isee</p>
        </div>
      </footer>

      {/* Edit Dialog */}
      {editingSite && (
        <EditSiteDialog
          site={editingSite}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          onUpdateSite={handleUpdateSite}
          onDeleteSite={handleDeleteSite}
          existingCategories={allCategories}
          existingTags={allTags}
        />
      )}
    </div>
  );
}
