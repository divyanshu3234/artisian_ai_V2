"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, LayoutDashboard, Wallet, TrendingUp, Store } from 'lucide-react';

export default function BottomNavbar() {
  const pathname = usePathname();

  const links = [
    { href: "/profile", icon: User },
    { href: "/dashboard", icon: LayoutDashboard },
    { href: "/wallet", icon: Wallet },
    { href: "/analysis", icon: TrendingUp },
    { href: "/market", icon: Store },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full h-20 flex justify-around items-center px-4 pb-safe bg-surface/80 backdrop-blur-md z-50 rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] md:hidden border-t ghost-border">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link 
            key={link.href}
            href={link.href} 
            className={`flex flex-col items-center justify-center p-3 transition-all duration-150 active:scale-90 ${
              isActive 
                ? "bg-primary-gradient text-white rounded-full shadow-lg shadow-primary/20 scale-110" 
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            <Icon fill={isActive ? "currentColor" : "none"} className="w-6 h-6" />
          </Link>
        );
      })}
    </nav>
  );
}
