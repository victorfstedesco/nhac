import type { ReactNode } from "react";
import Image from "next/image";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* form panel */}
      <div className="w-full lg:w-[440px] xl:w-[480px] shrink-0 bg-white flex flex-col justify-between px-10 py-10">
        <div>
          <Image
            src="/logo.svg"
            alt="nhác"
            width={96}
            height={32}
            priority
          />
        </div>

        <div>{children}</div>

        <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
          Este aplicativo não substitui orientação médica ou nutricional profissional.
        </p>
      </div>

      {/* photo panel */}
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1400&q=85"
          alt=""
          fill
          className="object-cover"
          priority
        />
        {/* subtle dark overlay so the photo doesn't compete */}
        <div className="absolute inset-0 bg-black/10" />
      </div>
    </div>
  );
}
