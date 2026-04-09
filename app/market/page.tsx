"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import TopNavbar from "@/components/layout/top-nav";
import BottomNavbar from "@/components/layout/bottom-nav";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Menu, Send, CheckCheck, 
  User, LayoutDashboard, Wallet, TrendingUp, Store,
  MessageSquare, ShoppingCart, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { fallbackListings } from "@/lib/data/fallbacks";
import { useCart } from "@/contexts/CartContext";

export default function MarketPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (!error && data) {
        setProducts(data);
      }
    };
    fetchProducts();
  }, []);

  const router = useRouter();
  const { addToCart } = useCart();
  const allFeed = [...products, ...fallbackListings];

  return (
    <div className="bg-surface font-sans text-foreground selection:bg-primary/30 min-h-screen">
      <TopNavbar />

      <main className="pt-20 pb-24 px-4 md:px-8 max-w-[1600px] mx-auto min-h-screen">
        {/* Editorial Headline */}
        <div className="mb-12 mt-6">
          <h2 className="text-4xl md:text-6xl font-black font-serif tracking-tighter text-foreground uppercase">
            Marketplace <span className="text-primary font-sans">| बाज़ार</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mt-4 font-light leading-relaxed text-lg">
            Connecting the heritage of Indian craftsmanship with global demand through real-time AI logistics and curated local hotspots.
          </p>
        </div>

        {/* Dual-View Marketplace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[700px] lg:h-[600px]">
          
          {/* Left Side: Local Demand Map */}
          <section className="lg:col-span-7 bg-surface-container rounded-[32px] overflow-hidden relative flex flex-col shadow-sm border border-outline-variant/10">
            <div className="p-8 absolute top-0 left-0 z-10 w-full pointer-events-none flex justify-between">
              <div className="bg-surface/40 backdrop-blur-md border border-outline-variant/30 inline-flex items-center px-4 py-2 rounded-full pointer-events-auto">
                <span className="w-2 h-2 rounded-full bg-secondary mr-2"></span>
                <span className="text-xs font-bold tracking-widest uppercase text-secondary">Live Craft Velocity</span>
              </div>
            </div>

            {/* Simulated Map Component */}
            <div className="flex-1 w-full bg-surface-container-highest relative overflow-hidden group/map cursor-crosshair">
              <Image 
                className="w-full h-full object-cover opacity-40 mix-blend-luminosity duration-1000 group-hover/map:opacity-60 transition-opacity group-hover/map:scale-105" 
                alt="Map of India with glowing craft demand centers" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKujiesWKXwTSzzm_XT0dNcZOKmIp-ntFcAubznhSp_BYgJkET6V6Ng1tI_j3FjApPS7poiYgVuV5T2U9qq4_r7LsmYiUPBZfIME1mmRx6J_BYw_94qEO904yLiFlDl8qJ3SPNwWD_KMPypfvQWOL-mpwVp1j-laqNR6JMtn4vrbFw5MzVShtZnRq96eWxfmkgBaZiYf_x7wHtD-9TYim7lWEJqlPGNz6ESdj-XBcZgXecWhKLtChDZAqrvAlNyqW6D_-mGRsCxdVV"
                fill
              />

              {/* Hotspot: Jaipur */}
              <div className="absolute top-[35%] left-[25%] group cursor-pointer">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-12 h-12 bg-primary/20 rounded-full animate-ping"></div>
                  <div className="relative w-4 h-4 bg-primary rounded-full border-2 border-surface"></div>
                </div>
                <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-surface-container-high p-3 rounded-xl shadow-2xl min-w-[140px] border border-outline-variant/30 opacity-0 group-hover:opacity-100 transition-all z-20 pointer-events-none">
                  <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">Jaipur</p>
                  <p className="text-xs text-foreground mt-1">Blue Pottery Demand</p>
                  <div className="mt-2 h-1 w-full bg-surface-container-lowest rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[85%]"></div>
                  </div>
                </div>
              </div>

              {/* Hotspot: Varanasi */}
              <div className="absolute top-[45%] left-[55%] group cursor-pointer">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-16 h-16 bg-[#FFB300]/20 rounded-full animate-pulse"></div>
                  <div className="absolute w-16 h-16 bg-secondary/20 rounded-full animate-pulse"></div>
                  <div className="relative w-4 h-4 bg-secondary rounded-full border-2 border-surface"></div>
                </div>
                <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-surface-container-high p-3 rounded-xl shadow-2xl min-w-[140px] border border-outline-variant/30 opacity-0 group-hover:opacity-100 transition-all z-20 pointer-events-none">
                  <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">Varanasi</p>
                  <p className="text-xs text-foreground mt-1">Silk Brocade Trends</p>
                  <div className="mt-2 h-1 w-full bg-surface-container-lowest rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[92%]"></div>
                  </div>
                </div>
              </div>

              {/* Hotspot: Kutch */}
              <div className="absolute top-[50%] left-[15%] group cursor-pointer">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-10 h-10 bg-indigo-400/20 rounded-full animate-ping"></div>
                  <div className="relative w-4 h-4 bg-indigo-400 rounded-full border-2 border-surface"></div>
                </div>
                <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-surface-container-high p-3 rounded-xl shadow-2xl min-w-[140px] border border-outline-variant/30 opacity-0 group-hover:opacity-100 transition-all z-20 pointer-events-none">
                  <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">Kutch</p>
                  <p className="text-xs text-foreground mt-1">Embroidery Orders</p>
                  <div className="mt-2 h-1 w-full bg-surface-container-lowest rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-400 w-[64%]"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-surface-container border-t ghost-border flex justify-between items-center z-10 shrink-0">
              <div>
                <h4 className="text-sm font-bold text-foreground">Regional Insights</h4>
                <p className="text-xs text-muted-foreground">North-West corridors showing +24% growth</p>
              </div>
              <button onClick={() => toast('Analytics Module Coming Soon', { icon: '📊' })} className="bg-primary/10 text-primary px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary/20 transition-colors">
                View Analytics
              </button>
            </div>
          </section>

          {/* Right Side: Live Chats / Negotiations */}
          <section className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-surface-container rounded-[32px] p-6 flex-1 flex flex-col shadow-sm border border-outline-variant/10 overflow-hidden">
              <div className="flex items-center justify-between mb-6 shrink-0">
                <h3 className="font-serif font-bold text-xl flex items-center gap-2">
                  <MessageSquare className="text-secondary w-5 h-5" />
                  Active Negotiations
                </h3>
                <span className="bg-surface-container-high text-muted-foreground text-[10px] px-3 py-1 rounded-full uppercase font-bold tracking-wider">4 Active</span>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {/* Chat Card 1 */}
                <div className="bg-surface p-5 rounded-2xl border-l-4 border-primary shadow-sm group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container">
                        <Image 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                          alt="Elderly artisan" 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxch_t0SSwz0MjKznoXJyydIf1DcK2m4t3PPWT_86-e2V3DvVjVkgkQIn3IAqrA4hOGpli-85IyU3uIo1exvL0euXOi30bv94dH_ohwqxcUGS4d6EVXa8sodHE9eNH37cz-8Elrli1MHXAXOcBdxNzsdwDAG9NOw6LLtxPR8bRVyei8iT46ABq3RnJRv-aoXaooP3dSC-hpjU_ra7Klz2L_cdjXAA7fks9foBqSyXiRu0UUYfs8lPstxhH8jMRyJc7VgX1R15QzD0E"
                          width={40}
                          height={40}
                        />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-foreground">Ramesh S. (Kutch)</h5>
                        <p className="text-[10px] text-muted-foreground">Embroidery Specialist</p>
                      </div>
                    </div>
                    <button className="bg-surface-container-high hover:bg-secondary/10 hover:text-secondary transition-all flex items-center gap-2 px-3 py-1.5 rounded-lg border ghost-border text-muted-foreground">
                      <span className="text-[10px] font-bold uppercase tracking-widest">Translate</span>
                    </button>
                  </div>
                  <div className="mt-4 p-3 bg-surface-container-lowest rounded-xl italic text-sm text-foreground/80">
                    &quot;नमस्ते, हम अगले महीने तक 50 पीसी तैयार कर सकते हैं।&quot;
                  </div>
                  <div className="mt-3 flex justify-end">
                    <p className="text-[10px] text-primary font-bold">AI suggestion: Confirm deadline details</p>
                  </div>
                </div>

                {/* Chat Card 2 */}
                <div className="bg-surface p-5 rounded-2xl border-l-4 border-secondary shadow-sm group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container">
                        <Image 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                          alt="Young female weaver" 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCRuGgjqiCHFpMLvJSmCk1rr2usCtziAUDgezRxbJhIoNzmpgJ05D7TJQDESszDMaJK3SkeN2PyiuxTE5gjf6llRwRoXoXIi0VnsGDs6bsXw6FWIqFpURMMPyumgCL_8DGd_3TAkDOvuBOPxqmy_QyvyxlYCAIuH39kPSBNYtvMHO2i5cvjbQRW6_fd_Nw8iBks-8HoP2euWkdMmDNgYGiCTKv-HU9KFfALPIxmPD7on9IT80IKAF6zSJw-x9JA0XgwtBAZUHiJwDk"
                          width={40}
                          height={40}
                        />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-foreground">Priya M. (Varanasi)</h5>
                        <p className="text-[10px] text-muted-foreground">Master Weaver</p>
                      </div>
                    </div>
                    <button className="bg-surface-container-high hover:bg-secondary/10 hover:text-secondary transition-all flex items-center gap-2 px-3 py-1.5 rounded-lg border ghost-border text-muted-foreground">
                      <span className="text-[10px] font-bold uppercase tracking-widest">Translate</span>
                    </button>
                  </div>
                  <div className="mt-4 p-3 bg-surface-container-lowest rounded-xl text-sm text-foreground/80">
                    &quot;Can you verify the indigo shade for the border? I want to ensure it matches your digital specs.&quot;
                  </div>
                  <div className="mt-3 flex justify-end gap-2 items-center">
                    <CheckCheck className="w-3 h-3 text-secondary" />
                    <p className="text-[10px] text-muted-foreground">Read 2m ago</p>
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="mt-6 pt-6 border-t ghost-border flex items-center gap-3 shrink-0">
                <input 
                  className="flex-1 bg-surface border border-outline-variant/30 focus:border-secondary transition-colors rounded-xl text-sm px-4 py-3 text-foreground outline-none" 
                  placeholder="Start a new message..." 
                  type="text"
                />
                <button className="w-11 h-11 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center active:scale-90 transition-transform">
                  <Send className="w-5 h-5 ml-[-2px]" />
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Curated Inventory Feed */}
        <section className="mt-24 border-t border-outline-variant/20 pt-16">
          <div className="flex items-end justify-between mb-10">
            <div className="space-y-3">
              <h3 className="text-4xl font-serif font-black text-foreground tracking-tight">Live Discoveries</h3>
              <p className="text-muted-foreground text-lg max-w-xl font-medium tracking-wide">Direct from the artisan's workshop to your doorstep.</p>
            </div>
            <span className="hidden md:inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
              <Sparkles className="w-4 h-4" /> Freshly Sourced
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {allFeed.map((item) => (
              <div key={item.id} className="group bg-surface-container rounded-3xl overflow-hidden border border-outline-variant/30 shadow-ambient transition-all hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
                <div className="h-72 overflow-hidden relative bg-surface-container-low border-b border-outline-variant/20">
                  <Image 
                    src={item.image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuBHWTTicrkwdlHSFAhD1EVIVrCRMgeUc8HBfOQuW4de8qDK2yCWTy1JXpdPXyceNkbGnlD0AEVXQvrda3WQ6kzx335FPqkOmP_JPllGLtVNP2YDjrTts1oelvU0-NKnjbdPeQzej96BoDlxtKfL1gD59zlfaKzr5U9tKSp_aDd6W70GdIWl8xkx1YTEo4T9KQ1kdCZaGPSjnA1UrfSthXhOYkHw3RWNXaF-n4UH_daIT1B4Y_2JdJfP1twJCjWIejqeBYcYQycnn4mC"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms] ease-out brightness-95 group-hover:brightness-105"
                    alt={item.name}
                    width={500}
                    height={500}
                  />
                  <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-foreground tracking-widest shadow-sm">
                    ₹{item.price}
                  </div>
                </div>
                <div className="p-6 flex flex-col justify-between" style={{ minHeight: '190px' }}>
                  <div>
                    <h4 className="font-serif font-extrabold text-xl text-foreground line-clamp-1 group-hover:text-primary transition-colors">{item.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-3 leading-relaxed font-medium">{item.description}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-outline-variant/10 flex gap-3">
                    <button 
                      onClick={() => addToCart(item)} 
                      className="flex-1 flex items-center justify-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white py-3 rounded-2xl font-bold text-xs tracking-tight active:scale-95 transition-all"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                    <button 
                      onClick={() => router.push(`/checkout/${item.id}`)} 
                      className="flex-1 flex items-center justify-center gap-2 bg-foreground hover:bg-primary text-background hover:text-white py-3 rounded-2xl font-bold text-xs tracking-tight active:scale-95 transition-all shadow-md"
                    >
                      <Sparkles className="w-4 h-4" />
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNavbar />
    </div>
  );
}
