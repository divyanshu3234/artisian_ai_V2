"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import TopNavbar from "@/components/layout/top-nav";
import BottomNavbar from "@/components/layout/bottom-nav";
import { 
  Menu, TrendingUp, Globe, Heart, ThumbsUp, Flame, Sparkles,
  User, LayoutDashboard, Wallet, Store
} from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, ResponsiveContainer, Tooltip } from 'recharts';

const chartData = [
  { name: 'Jan', growth: 40 },
  { name: 'Feb', growth: 65 },
  { name: 'Mar', growth: 90 },
  { name: 'Apr', growth: 75 },
  { name: 'May', growth: 55 },
];

export default function AnalysisPage() {
  return (
    <div className="bg-surface text-foreground min-h-screen pb-24 font-sans selection:bg-primary/30">
      
      <TopNavbar />

      <main className="pt-24 px-6 max-w-7xl mx-auto space-y-12">
        {/* Editorial Header */}
        <section className="space-y-2">
          <h2 className="font-serif font-extrabold text-5xl md:text-6xl tracking-tighter text-foreground uppercase">
            Your Growth <span className="text-primary font-sans text-4xl">| आपकी तरक्की</span>
          </h2>
          <p className="text-muted-foreground max-w-xl font-medium tracking-wide">
            Bridging heritage craftsmanship with predictive intelligence. Your digital gallery performance curated by AI.
          </p>
        </section>

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Sales Growth Tree (Central Visual) */}
          <div className="md:col-span-8 bg-surface-container-low rounded-[32px] p-8 relative overflow-hidden group border ghost-border shadow-sm">
            <div className="absolute top-0 right-0 p-8 z-20">
              <span className="text-xs font-bold tracking-widest uppercase text-primary">Market Expansion</span>
            </div>
            
            <div className="relative z-10">
              <h3 className="font-serif text-2xl font-bold mb-8 text-foreground">Ecosystem Vitality</h3>
              
              <div className="h-80 w-full mt-12 mb-4 relative z-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,180,165,0.1)' }} 
                      contentStyle={{ backgroundColor: '#131313', border: '1px solid rgba(226,114,91,0.3)', borderRadius: '16px' }}
                    />
                    <Bar dataKey="growth" fill="#ffb4a5" radius={[100, 100, 0, 0]} className="hover:opacity-80 transition-opacity" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Subtle Background Texture */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <Image 
                className="w-full h-full object-cover" 
                alt="Hand-woven Indian textile texture" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCB_u8YY3mZm-2_MnPmpC0jOYykzguTBraylHYmLm1Yl8CAGtNUh9jegcvaMKpQZVFfAgx9rwd42PpEHNR-h_NgdJkLWm5_vfi7jabGRHNv6VYecu58JxMtc6yZiqNoDYzusuEr-TX7pAa1hRWEEPbNlmJFil5sr9tQLOwsoXpUcX3AVEdaGU59BCwlfo_e85rW2VZV7SKSKrRM17pmarCFHaXGk2h6QPCGIE9j067BjhRsfjtBBN8FtNd9ED7IOm1ADI8aGDh8jAdg"
                fill
              />
            </div>
          </div>

          {/* Performance Circulars Side Panel */}
          <div className="md:col-span-4 space-y-6">
            
            {/* Progress Circle Card 1 */}
            <div className="bg-surface-container rounded-[32px] p-6 flex items-center justify-between shadow-sm border border-outline-variant/10">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Global Reach</p>
                <h4 className="text-3xl font-extrabold font-serif text-foreground">82%</h4>
              </div>
              <div className="relative w-20 h-20">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-surface-container-highest" cx="40" cy="40" fill="transparent" r="34" stroke="currentColor" strokeWidth="8"></circle>
                  <circle className="text-secondary" cx="40" cy="40" fill="transparent" r="34" stroke="currentColor" strokeDasharray="213" strokeDashoffset="38" strokeLinecap="round" strokeWidth="8"></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Globe className="text-secondary w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Progress Circle Card 2 */}
            <div className="bg-surface-container rounded-[32px] p-6 flex items-center justify-between shadow-sm border border-outline-variant/10">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Retention</p>
                <h4 className="text-3xl font-extrabold font-serif text-foreground">64%</h4>
              </div>
              <div className="relative w-20 h-20">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-surface-container-highest" cx="40" cy="40" fill="transparent" r="34" stroke="currentColor" strokeWidth="8"></circle>
                  <circle className="text-indigo-400" cx="40" cy="40" fill="transparent" r="34" stroke="currentColor" strokeDasharray="213" strokeDashoffset="76" strokeLinecap="round" strokeWidth="8"></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Heart className="text-indigo-400 w-6 h-6" />
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Curated Insights Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Popular Item */}
          <div className="bg-surface-container rounded-[32px] p-8 border-b-4 border-indigo-400/50 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-indigo-400/10 p-3 rounded-2xl">
                <ThumbsUp className="text-indigo-400 w-8 h-8" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tighter bg-indigo-400/20 text-indigo-400 px-3 py-1 rounded-full">Popular</span>
            </div>
            <h5 className="font-serif text-xl font-bold mb-2">Hand-Painted Terracotta</h5>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">Consistently high ratings across 12 countries. Demand stable for 4 months.</p>
            <div className="h-32 rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 relative">
              <Image 
                className="w-full h-full object-cover" 
                alt="Hand-painted traditional Indian terracotta" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvQWGe-J75LaW5ENl0r8jcsxHgqdg_frE_8fNrfzORz831t8Mk8rXvlcaegojkXrBKVoHLp7wmSaip6cXDPPbmo4Sk2bcobKQLpKA_ToUhgUPrJug9cqR0DOynjZi0b2g7Q4uHDnSMfmMh1g6FC4fmcITliybuJPHvINOBJhX1j81YTHuf71gqYNKvkZtJK1U9tQxyQk7pHTkApN0C12LZ0zVFNKydPodTE_UQxeQ-Wb1QXmVzCGltGHieY94QhtgOQr9Qd4knzIkQ"
                fill
              />
            </div>
          </div>

          {/* Trending Item */}
          <div className="bg-surface-container rounded-[32px] p-8 border-b-4 border-primary shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-primary/10 p-3 rounded-2xl flex items-center justify-center">
                <Flame className="text-primary w-8 h-8" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tighter bg-primary/20 text-primary px-3 py-1 rounded-full">Trending Now</span>
            </div>
            <h5 className="font-serif text-xl font-bold mb-2">Indigo Silk Weaves</h5>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">Viral growth in Nordic markets. Production AI recommends scaling up 15%.</p>
            <div className="h-32 rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 relative">
              <Image 
                className="w-full h-full object-cover" 
                alt="Indigo silk fabric" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCLtbwSq9OqMm00YM1MvLHdXqCZp3h54xBxJVsy5QCw-MviWl1mvG-ctygSH9nrxkLuamtkaYHNW164l1D2vfkbSYYpRvcSK7ja_Bw8Ksjy3AYN88cp3KEp_uRZcjLOppfnsOhgul0WiZkMRuMQ7GzGy05X3lFB67MOauLyHQ2pd134gCNYWRkvIsGGmIP-P1H-Cp2C7K3GuUuvubQ8LTcq_VzA-rINWZK5TKMqRPG0XXk3XLN_BmffqrCCPLhu60zfg0c-3K704Cn"
                fill
              />
            </div>
          </div>

          {/* AI Suggestion Card */}
          <div className="bg-primary-gradient rounded-[32px] p-8 shadow-2xl relative">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="text-white w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">AI Curator Logic</span>
            </div>
            <p className="text-lg font-medium font-serif italic text-white leading-relaxed mb-8">
              "Your 'Kashmir Willow' collection is showing high resonance with eco-conscious demographics. Consider a heritage spotlight campaign."
            </p>
            <button onClick={() => toast('Insights forwarded to Genie Hub', { icon: '✨' })} className="w-full bg-surface text-primary font-bold py-4 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.1)] active:scale-95 transition-all">
              Action Insights
            </button>
          </div>

        </section>
      </main>

      <BottomNavbar />
    </div>
  );
}
