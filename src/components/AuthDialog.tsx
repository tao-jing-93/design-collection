import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { supabase } from "../utils/supabase/client";
import { Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success("登录成功");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "登录失败");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1C1C1E] border-white/10 text-white sm:max-w-[400px] p-0 overflow-hidden gap-0">
        <div className="p-6 pt-8 text-center">
          <DialogTitle className="text-2xl font-bold font-[Sansation] mb-2">
            Welcome Back
          </DialogTitle>
          <DialogDescription className="text-neutral-400 text-sm">
            Sign in to manage your Gilded Collection
          </DialogDescription>
        </div>

        <div className="p-6 pt-0 space-y-4">
          <form onSubmit={handleLogin} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium text-neutral-400">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#121212] border-white/10 focus-visible:ring-white/20 h-10 text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium text-neutral-400">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#121212] border-white/10 focus-visible:ring-white/20 h-10 text-sm"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black hover:bg-neutral-200 h-10 font-medium"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2 opacity-50" />
                </>
              )}
            </Button>
          </form>
        </div>
        
        <div className="p-4 bg-[#121212] text-center border-t border-white/5">
          <p className="text-[10px] text-neutral-600">
            Only authorized administrators can sign in.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
