"use client";

import { Menu, Bell, X, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import ProfileAvatar from "@/components/ui/profile-avatar";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useEffect } from "react";

export default function TopNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <header className="fixed top-0 w-full z-50 glass-overlay flex items-center justify-between px-6 h-16 shadow-[0_8px_32px_rgba(226,114,91,0.08)] border-b ghost-border backdrop-blur-md">
      <div className="flex items-center gap-4">
        <button onClick={() => setIsMobileMenuOpen(true)} className="text-foreground hover:opacity-80 transition-opacity cursor-pointer md:hidden block">
          <Menu className="w-6 h-6" />
        </button>
        <Link href="/dashboard" className="text-xl font-extrabold tracking-tight text-primary font-serif">
          Artisan AI
        </Link>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden md:flex gap-6 text-sm font-bold tracking-tighter font-serif">
          <Link href="/dashboard" className="text-foreground hover:opacity-80 transition-opacity cursor-pointer">Genie Hub</Link>
          <Link href="/wallet" className="text-secondary hover:opacity-80 transition-opacity cursor-pointer">Wallet</Link>
          <Link href="/market" className="text-foreground hover:opacity-80 transition-opacity cursor-pointer">Market</Link>
          <Link href="/analysis" className="text-foreground hover:opacity-80 transition-opacity cursor-pointer">Analysis</Link>
        </div>
        
        <Link href="/cart" className="relative group p-2 rounded-full hover:bg-surface-container-high transition-colors">
          <ShoppingBag className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
          {mounted && cartCount > 0 && (
            <span className="absolute -top-0 -right-0 bg-[#FFB300] text-black text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-background animate-pulse">
              {cartCount}
            </span>
          )}
        </Link>

        <ThemeSwitcher />
        <Bell className="text-secondary scale-95 duration-200 cursor-pointer hidden sm:block" />
        <ProfileAvatar size={32} />
      </div>
      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-background border-r border-outline-variant/20 flex flex-col w-4/5 max-w-sm shadow-2xl md:hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/10">
              <span className="text-xl font-extrabold tracking-tight text-primary font-serif">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="bg-surface-container p-2 rounded-full text-foreground hover:bg-secondary/10 hover:text-secondary transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col p-6 gap-6 text-lg font-bold font-serif">
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/dashboard" className="text-foreground hover:text-primary transition-colors flex items-center gap-3">Genie Hub</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/wallet" className="text-secondary hover:opacity-80 transition-opacity flex items-center gap-3">Wallet</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/market" className="text-foreground hover:text-primary transition-colors flex items-center gap-3">Market</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/analysis" className="text-foreground hover:text-primary transition-colors flex items-center gap-3">Analysis</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/cart" className="text-primary hover:opacity-80 transition-opacity flex items-center gap-3 justify-between">
                <span>My Cart</span>
                {mounted && cartCount > 0 && <span className="bg-[#FFB300] text-black text-[10px] font-bold px-2 py-0.5 rounded-full">{cartCount} items</span>}
              </Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/profile" className="text-foreground hover:text-primary transition-colors flex items-center gap-3 border-t border-outline-variant/10 pt-6">My Profile</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Background Overlay specifically for clicking out of the menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 z-[90] backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>
    </header>
  );
}
