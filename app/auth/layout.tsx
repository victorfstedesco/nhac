import type { ReactNode } from "react";
import Image from "next/image";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex font-sans bg-white">
      {/* form panel */}
      <div className="w-full lg:w-[480px] xl:w-[560px] shrink-0 bg-white flex flex-col justify-between px-8 sm:px-12 py-10 sm:py-12 z-10 shadow-[20px_0_40px_rgb(0,0,0,0.03)]">
        <div>
          <Image
            src="/logo.svg"
            alt="nhác"
            width={112}
            height={38}
            priority
            className="drop-shadow-sm transition-transform hover:scale-105"
          />
        </div>

        <div className="flex-1 flex flex-col justify-center py-10">
          {children}
        </div>

        <p className="text-xs font-medium text-zinc-400 leading-relaxed max-w-xs">
          Este aplicativo não substitui orientação médica ou nutricional profissional.
        </p>
      </div>

      {/* photo panel */}
      <div className="hidden lg:block flex-1 relative overflow-hidden bg-zinc-100">
        <Image
          src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1400&q=85"
          alt="Healthy food"
          fill
          className="object-cover"
          priority
        />
        {/* gradient overlay to make it look premium */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/5" />
      </div>
    </div>
  );
}
