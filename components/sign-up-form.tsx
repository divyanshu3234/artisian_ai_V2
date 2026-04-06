"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Store, ShoppingBag } from "lucide-react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/login`,
          data: { role },
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col w-full max-w-md ${className || ""}`} {...props}>
      <div className="bg-surface-container rounded-3xl p-8 border ghost-border shadow-2xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-foreground">Join the Hub</h2>
          <p className="text-muted-foreground mt-2 font-sans">Experience authentic craftsmanship.</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => setRole("buyer")}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                role === "buyer" 
                  ? "bg-primary/10 border-primary text-primary shadow-sm" 
                  : "bg-surface border-outline-variant/30 text-muted-foreground hover:border-outline-variant/60"
              }`}
            >
              <ShoppingBag className="w-6 h-6 mb-2" />
              <span className="font-bold uppercase tracking-widest text-xs">Buyer</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("seller")}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                role === "seller" 
                  ? "bg-secondary/10 border-secondary text-secondary shadow-sm" 
                  : "bg-surface border-outline-variant/30 text-muted-foreground hover:border-outline-variant/60"
              }`}
            >
              <Store className="w-6 h-6 mb-2" />
              <span className="font-bold uppercase tracking-widest text-xs">Seller</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2 block">Email</label>
              <input
                type="email"
                required
                className="w-full bg-surface border-b border-outline-variant/30 focus:border-primary transition-colors text-foreground py-3 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2 block">Password</label>
              <input
                type="password"
                required
                className="w-full bg-surface border-b border-outline-variant/30 focus:border-primary transition-colors text-foreground py-3 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2 block">Repeat Password</label>
              <input
                type="password"
                required
                className="w-full bg-surface border-b border-outline-variant/30 focus:border-primary transition-colors text-foreground py-3 outline-none"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive font-bold">{error}</p>}
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-6 bg-primary-gradient text-white py-4 rounded-full font-serif font-bold text-lg shadow-lg active:scale-95 transition-all disabled:opacity-50"
          >
            {isLoading ? "Enrolling..." : "Create Account"}
          </button>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary font-bold hover:underline">
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
