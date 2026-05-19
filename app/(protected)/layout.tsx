import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Início" },
  { href: "/meals", label: "Refeições" },
  { href: "/fasting", label: "Jejum" },
  { href: "/stats", label: "Estatísticas" },
  { href: "/settings", label: "Configurações" },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50/50 flex flex-col font-sans">

      {/* top navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-zinc-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">

          <Link href="/dashboard" className="shrink-0 transition-transform hover:scale-105 active:scale-95">
            <Image src="/logo.svg" alt="nhác" width={64} height={22} priority className="shrink-0 drop-shadow-sm" />
          </Link>

          <nav className="hidden sm:flex items-center gap-1.5 flex-1 justify-center">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-3.5 py-2 text-sm font-bold text-zinc-500
                  hover:text-zinc-900 hover:bg-zinc-100 transition-all duration-200 rounded-xl"
              >
                {label}
              </Link>
            ))}
          </nav>

          <Link
            href="/meals/new"
            className="shrink-0 bg-brand hover:bg-brand-dark text-white
              text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200 
              shadow-sm shadow-brand/25 hover:shadow-md hover:shadow-brand/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex items-center gap-1.5"
          >
            <span className="text-lg leading-none">+</span> Refeição
          </Link>
        </div>
      </header>

      {/* page content */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>

    </div>
  );
}
