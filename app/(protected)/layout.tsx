"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

const navItems = [
  { href: "/dashboard",  label: "Início" },
  { href: "/meals",      label: "Refeições" },
  { href: "/fasting",    label: "Jejum" },
  { href: "/stats",      label: "Estatísticas" },
  { href: "/settings",   label: "Configurações" },
];

// mobile bottom nav — only the 4 most used
const mobileNavItems = [
  {
    href: "/dashboard", label: "Início",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    href: "/meals", label: "Refeições",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/>
        <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
      </svg>
    ),
  },
  {
    href: "/fasting", label: "Jejum",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/>
        <path d="M5 3 2 6"/><path d="m22 6-3-3"/>
      </svg>
    ),
  },
  {
    href: "/stats", label: "Stats",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
        <line x1="2" y1="20" x2="22" y2="20"/>
      </svg>
    ),
  },
  {
    href: "/settings", label: "Config",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
      </svg>
    ),
  },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // active: exact match for /dashboard, prefix match for the rest
  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 flex flex-col font-sans">

      {/* ── top navbar ── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-zinc-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">

          <Link href="/dashboard" className="shrink-0 transition-transform hover:scale-105 active:scale-95">
            <Image src="/logo.svg" alt="nhác" width={64} height={22} priority className="drop-shadow-sm" />
          </Link>

          {/* desktop nav */}
          <nav className="hidden sm:flex items-center gap-0.5 flex-1 justify-center">
            {navItems.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative px-3.5 py-2 text-sm font-bold rounded-xl transition-all duration-200 ${
                    active
                      ? "text-brand bg-brand-light"
                      : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                  }`}
                >
                  {label}
                  {active && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand" />
                  )}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/meals/new"
            className="shrink-0 bg-brand hover:bg-brand-dark text-white text-sm font-bold
              px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm shadow-brand/25
              hover:shadow-md hover:shadow-brand/30 hover:-translate-y-0.5 active:scale-95
              flex items-center gap-1.5"
          >
            <span className="text-lg leading-none">+</span> Refeição
          </Link>
        </div>
      </header>

      {/* ── page content ── */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-8">
        {children}
      </main>

      {/* ── mobile bottom nav ── */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-zinc-100
        shadow-[0_-4px_20px_rgb(0,0,0,0.04)]">
        <div className="flex items-center justify-around h-16 px-2 max-w-2xl mx-auto">
          {mobileNavItems.map(({ href, label, icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all ${
                  active ? "text-brand" : "text-zinc-400 hover:text-zinc-700"
                }`}
              >
                {icon}
                <span className="text-[10px] font-bold">{label}</span>
                {active && <span className="w-1 h-1 rounded-full bg-brand" />}
              </Link>
            );
          })}
        </div>
      </nav>

    </div>
  );
}
