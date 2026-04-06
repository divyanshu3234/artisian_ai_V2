import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-surface flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Texture decor */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent blur-3xl opacity-50 pointer-events-none"></div>

      <div className="max-w-3xl mx-auto text-center z-10 space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container border border-outline-variant/30 text-secondary text-sm font-bold tracking-widest uppercase mb-4">
          <Sparkles className="w-4 h-4" />
          The Digital Loom
        </div>

        <h1 className="text-6xl md:text-8xl font-serif font-extrabold text-foreground tracking-tighter leading-none">
          Artisan <span className="text-primary italic">AI</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed">
          Where heritage craftsmanship meets the modern marketplace. Step inside to manage your storefront or discover authentic creations.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-8">
          <Link href="/auth/login">
            <button className="bg-primary-gradient text-white px-10 py-5 rounded-full font-serif font-bold text-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-transform">
              Join the Hub
            </button>
          </Link>
          <Link href="/market">
            <button className="bg-transparent border border-outline-variant/30 text-foreground px-10 py-5 rounded-full font-serif font-bold text-xl hover:bg-surface-container transition-colors">
              Explore Market
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
