"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      // Role routing!
      const role = data.user?.user_metadata?.role;
      if (role === 'seller') {
        router.push("/dashboard");
      } else {
        router.push("/market"); // Buyers go to Market
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col w-full max-w-md ${className || ""}`} {...props}>
      <div className="bg-surface-container rounded-3xl p-8 border ghost-border shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 text-primary opacity-5">
          <Sparkles className="w-40 h-40" />
        </div>

        <div className="mb-8 relative z-10">
          <h2 className="text-3xl font-serif font-bold text-foreground">Welcome Back</h2>
          <p className="text-muted-foreground mt-2 font-sans">Login to access your gallery.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div className="space-y-6">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2 block">Email</label>
              <input
                type="email"
                required
                className="w-full bg-transparent border-b border-outline-variant/30 focus:border-primary transition-colors text-foreground py-2 outline-none text-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Password</label>
                <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                required
                className="w-full bg-transparent border-b border-outline-variant/30 focus:border-primary transition-colors text-foreground py-2 outline-none text-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive font-bold">{error}</p>}
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-8 bg-primary-gradient text-white py-4 rounded-full font-serif font-bold text-lg shadow-lg active:scale-95 transition-all disabled:opacity-50"
          >
            {isLoading ? "Authenticating..." : "Login to Portal"}
          </button>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/auth/sign-up" className="text-secondary font-bold hover:underline">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
