import Link from "next/link";

function MailIcon() {
  return (
    <svg className="w-4 h-4 text-[#A1A1AA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="0" />
      <path d="m2 4 10 9 10-9" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="w-4 h-4 text-[#A1A1AA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="11" width="14" height="10" rx="0" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-[22px] font-bold text-[#18181B] leading-tight">
          Entrar
        </h1>
        <p className="text-[13px] text-[#71717A] mt-1">
          Use seu e-mail e senha para acessar
        </p>
      </div>

      <form className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-[12px] font-semibold text-[#3F3F46] uppercase tracking-wider">
            E-mail
          </label>
          <div className="flex items-center gap-2.5 border border-[#D4D4D8] bg-[#FAFAFA] px-3 py-2.5
            focus-within:border-[var(--brand)] focus-within:bg-white transition">
            <MailIcon />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="hello@email.com"
              className="flex-1 bg-transparent text-[13px] text-[#18181B] outline-none placeholder:text-[#D4D4D8]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-[12px] font-semibold text-[#3F3F46] uppercase tracking-wider">
            Senha
          </label>
          <div className="flex items-center gap-2.5 border border-[#D4D4D8] bg-[#FAFAFA] px-3 py-2.5
            focus-within:border-[var(--brand)] focus-within:bg-white transition">
            <LockIcon />
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Sua senha"
              className="flex-1 bg-transparent text-[13px] text-[#18181B] outline-none placeholder:text-[#D4D4D8]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[var(--brand)] hover:bg-[var(--brand-dark)] active:scale-[0.99]
            text-white font-bold py-3 text-[13px] tracking-wide transition-all duration-150 cursor-pointer"
        >
          Entrar
        </button>
      </form>

      <p className="text-[12px] text-[#71717A] text-center">
        Não tem uma conta?{" "}
        <Link
          href="/auth/register"
          className="text-[var(--brand)] hover:text-[var(--brand-dark)] font-semibold transition"
        >
          Criar conta
        </Link>
      </p>
    </div>
  );
}
