"use client";

import Image from "next/image";
import { useState } from "react";
import Script from "next/script";
import toast from "react-hot-toast";
import TopNavbar from "@/components/layout/top-nav";
import BottomNavbar from "@/components/layout/bottom-nav";
import { 
  Menu, Bell, TrendingUp, Banknote, Wallet, Sparkles, User, LayoutDashboard, Store 
} from 'lucide-react';

export default function WalletPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState<number>(500);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount || 1 }),
      });

      const order = await res.json();

      if (order.error) {
        alert("Failed to initialize Razorpay: " + order.error);
        setIsLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YourTestKey",
        amount: order.amount,
        currency: order.currency,
        name: "Artisan AI",
        description: "Add funds to Gullak",
        order_id: order.id,
        handler: function (response: any) {
          alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        },
        prefill: {
          name: "Ravi Artisan",
          email: "ravi@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#E2725B", // Primary terracotta color
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      
      razorpayInstance.on("payment.failed", function (response: any) {
        alert("Payment failed: " + response.error.description);
      });

      razorpayInstance.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong processing payment.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface font-sans text-foreground selection:bg-primary/30 min-h-screen">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <TopNavbar />

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto space-y-12">
        {/* Hero Section: The Gullak */}
        <section className="text-center space-y-8">
          <div className="space-y-2">
            <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground">Your Gullak <span className="text-muted-foreground font-sans text-xl">| आपकी गुल्लक</span></h2>
            <p className="text-muted-foreground text-sm uppercase tracking-widest font-semibold">Master Artisan Balance</p>
          </div>

          {/* Central Visual Metaphor */}
          <div className="relative flex justify-center py-8">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent blur-3xl rounded-full scale-150 opacity-50"></div>
            
            {/* The Gullak Visual */}
            <div className="relative w-64 h-64 flex flex-col items-center justify-center">
              <div className="absolute inset-0 bg-surface-container-high rounded-full border border-primary/20 shadow-2xl backdrop-blur-md overflow-hidden">
                <Image 
                  className="w-full h-full object-cover opacity-60 mix-blend-overlay grayscale hover:grayscale-0 transition-all duration-700" 
                  alt="Traditional indian clay piggy bank gullak" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtcWt9TsxI3KGSASI-bCgq9GvDgf14LNBxY5B2zY3FJS3HFKHYpkHC77vTw-Kvpnl5fPZHrTAMmDVYFRmG253kX2J-_Mi00Qqn70cmXnxsKOJxNHInklqBRwJ0vlxeFq81tuvxvok351Kk4wHI157bhlVhtNNOYfH_7xxgJ8kUu_zpIxtsv8FVLIUMpLTohlCelERopc1h60v51zcpFdd0XKtsobB65swTS7GwYefdhtMW0giFg0aCp8sLroQI5JgptQHws5uLzfuJ"
                  width={256}
                  height={256}
                />
              </div>
              <div className="z-10 text-center drop-shadow-md">
                <span className="text-foreground/80 text-xs uppercase tracking-[0.2em] block mb-1 font-semibold border-b border-primary/20 pb-1">Total Savings</span>
                <div className="text-5xl font-serif font-extrabold tracking-tight text-primary mt-2">₹42,850</div>
                <div className="flex items-center justify-center gap-1 mt-2 text-primary bg-surface/50 rounded-full px-2 py-1 mx-auto w-max backdrop-blur-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-bold">+12% this month</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Money Flow: Bento Cards */}
        <section className="grid grid-cols-2 gap-4">
          {/* Earnings (Gold/Secondary) */}
          <div className="bg-surface-container-low p-6 rounded-3xl border-b-2 border-secondary/30 space-y-4 hover:-translate-y-1 transition-transform shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                <Banknote className="text-secondary w-5 h-5" />
              </div>
              <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-bold">Earnings</span>
            </div>
            <div>
              <div className="text-2xl font-serif font-bold text-secondary">₹28,400</div>
              <p className="text-muted-foreground text-xs mt-1 font-medium">Direct from sales</p>
            </div>
          </div>

          {/* Money In (Green) */}
          <div className="bg-surface-container-low p-6 rounded-3xl border-b-2 border-emerald-500/30 space-y-4 hover:-translate-y-1 transition-transform shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center">
                <Wallet className="text-emerald-500 w-5 h-5" />
              </div>
              <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-bold">Deposits</span>
            </div>
            <div>
              <div className="text-2xl font-serif font-bold text-emerald-600">₹14,450</div>
              <p className="text-muted-foreground text-xs mt-1 font-medium">Platform bonuses</p>
            </div>
          </div>
        </section>

        {/* Transaction Insights: Editorial Layout */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold">Recent Flow</h3>
            <button onClick={() => toast.success("Ledger statement downloaded!")} className="text-primary text-sm font-semibold hover:underline">View Ledger</button>
          </div>
          <div className="space-y-4">
            
            {/* Transaction Item 1 */}
            <div className="group flex items-center justify-between p-4 rounded-2xl bg-surface-container-lowest transition-all hover:bg-surface-container border border-transparent hover:border-outline-variant/30 shadow-sm cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-container flex-shrink-0">
                  <Image 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" 
                    alt="Blue hand-woven indian textile" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBw8LHPj1ZUYzI9gyHZuqaNEXJTgO5dvcgyCSURhpjeDPkHlCXMLqXMbQjUQrYkBQWFTa7nv7YMmyRmWGss0JZfkGuUgakuZ4jUsA2ugd-b8tzW8fmyQtBt_kTawx4vtN3Q-uAzCjkf1VStmszGv7mTu-J7PvrHNpwWKdmphTeBiz1iVuuYWWEUuTgIR9nhZezbvEmDe2_A7xeqLPmbN6vNADM40lYX5s6WKlnU1dkZyTgaKOYIspv_5CZbBuSMMuCGJs9mjZWIqv1-"
                    width={48}
                    height={48}
                  />
                </div>
                <div>
                  <p className="font-serif font-bold text-sm text-foreground">Indigo Dhurrie Sale</p>
                  <p className="text-muted-foreground text-xs">24 Oct, 2:30 PM</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-serif font-bold text-secondary">+₹4,500</p>
                <p className="text-[10px] uppercase text-muted-foreground tracking-widest font-semibold">Completed</p>
              </div>
            </div>

            {/* Transaction Item 2 */}
            <div className="group flex items-center justify-between p-4 rounded-2xl bg-surface-container-lowest transition-all hover:bg-surface-container border border-transparent hover:border-outline-variant/30 shadow-sm cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-container flex-shrink-0">
                  <Image 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" 
                    alt="Clay pottery wheels in workshop" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-zdRhUfR1GC-TFFka8EsKgmXgmpWI9OblyQokzXVcuUiI5yXGUm7nlVyMFCHm7oUmV6BjtmNE7ki0z5VYnZo-6zPT_8G3uozZnpCptz85vrOWM39woUGmMTYwe5YJueIgOGUoZPT9a88dol8Utmv8PdgoV2_KlsYQoDi502V5cnQ0hJf_bKz-kjJx45o2nm8xMEMfQJaoWBqB5O0ezpGGbXhtZgl3YRnE_L31JUpIenJdwFniC9P-_0wSA5ImFj-Lh86bE_HpPq_O"
                    width={48}
                    height={48}
                  />
                </div>
                <div>
                  <p className="font-serif font-bold text-sm text-foreground">Clay Sourcing Fund</p>
                  <p className="text-muted-foreground text-xs">22 Oct, 11:15 AM</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-serif font-bold text-foreground">-₹1,200</p>
                <p className="text-[10px] uppercase text-muted-foreground tracking-widest font-semibold">Materials</p>
              </div>
            </div>

            {/* Transaction Item 3 */}
            <div className="group flex items-center justify-between p-4 rounded-2xl bg-surface-container-lowest transition-all hover:bg-surface-container border border-transparent hover:border-outline-variant/30 shadow-sm cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="text-primary w-6 h-6" />
                </div>
                <div>
                  <p className="font-serif font-bold text-sm text-foreground">AI Curator Bonus</p>
                  <p className="text-muted-foreground text-xs">19 Oct, 9:00 PM</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-serif font-bold text-emerald-600">+₹850</p>
                <p className="text-[10px] uppercase text-muted-foreground tracking-widest font-semibold">Platform</p>
              </div>
            </div>

          </div>
        </section>

        {/* CTA Action */}
        <div className="flex flex-col gap-4 mt-8">
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground font-serif text-3xl font-bold">₹</span>
            <input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-surface-container border border-outline-variant/30 rounded-[28px] pl-14 pr-6 py-5 font-bold text-3xl font-serif text-foreground outline-none focus:border-primary transition-colors shadow-inner"
              placeholder="Enter Amount"
            />
          </div>
          <button 
            onClick={handlePayment}
            disabled={isLoading || amount < 1}
            className="w-full py-5 rounded-full bg-primary-gradient text-white font-serif font-extrabold text-lg shadow-lg shadow-primary/20 active:scale-95 transition-transform duration-150 disabled:opacity-50"
          >
            {isLoading ? "Processing..." : `Add ₹${amount} to Gullak`}
          </button>
        </div>
      </main>

      <BottomNavbar />
    </div>
  );
}
