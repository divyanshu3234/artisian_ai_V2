import type { Metadata } from "next";
import { Noto_Serif, Manrope } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from 'react-hot-toast'
import { Suspense } from "react"
import { ProfileProvider } from "@/contexts/ProfileContexts"


export const metadata: Metadata = {
  title: "Artisan AI — The Genie Hub",
  description: "An artistic, focused dashboard experience for sellers using Artisan AI.",
}

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${notoSerif.variable} ${manrope.variable} font-sans antialiased`}>
        <Toaster position='top-center' />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
        >
          <ProfileProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </ProfileProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
