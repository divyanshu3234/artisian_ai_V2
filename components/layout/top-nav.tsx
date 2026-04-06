import { Menu, Bell } from "lucide-react";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import ProfileAvatar from "@/components/ui/profile-avatar";

export default function TopNavbar() {
  return (
    <header className="fixed top-0 w-full z-50 glass-overlay flex items-center justify-between px-6 h-16 shadow-[0_8px_32px_rgba(226,114,91,0.08)] border-b ghost-border backdrop-blur-md">
      <div className="flex items-center gap-4">
        <button className="text-foreground hover:opacity-80 transition-opacity cursor-pointer">
          <Menu className="w-6 h-6" />
        </button>
        <Link href="/dashboard" className="text-xl font-extrabold tracking-tight text-primary font-serif">
          Artisan AI
        </Link>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden md:flex gap-6 text-sm font-bold tracking-tighter font-serif">
          <Link href="/dashboard" className="text-foreground hover:opacity-80 transition-opacity cursor-pointer">Genie Hub</Link>
          <Link href="/wallet" className="text-foreground text-[#FFB300] hover:opacity-80 transition-opacity cursor-pointer">Wallet</Link>
          <Link href="/market" className="text-foreground hover:opacity-80 transition-opacity cursor-pointer">Market</Link>
          <Link href="/analysis" className="text-foreground hover:opacity-80 transition-opacity cursor-pointer">Analysis</Link>
        </div>
        <ThemeSwitcher />
        <Bell className="text-[#FFB300] scale-95 duration-200 cursor-pointer hidden sm:block" />
        <ProfileAvatar size={32} />
      </div>
    </header>
  );
}
