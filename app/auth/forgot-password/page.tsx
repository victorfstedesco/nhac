"use client";

import Link from "next/link";
import { useState } from "react";

function MailIcon() {
  return (
    <svg className="w-5 h-5 text-zinc-400 group-focus-within:text-brand transition-colors duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="m2 4 10 9 10-9" />
    </svg>
  );
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.token) {
        const origin = window.location.origin;
        setResetLink(`${origin}/auth/reset-password?token=${data.token}`);
      } else {
        setResetLink("not-found");
      }
    } catch {
      setError("Erro ao processar solicitação. Tente novamente.");
    }

    setLoading(false);
  }

  if (resetLink) {
    return (
      <div className="flex flex-col gap-8 w-full max-w-sm mx-auto sm:mx-0">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Link <span className="text-brand">gerado</span>
          </h1>
          <p className="text-base text-zinc-500 font-medium">
            Em um ambiente real, este link seria enviado ao seu e-mail.
          </p>
        </div>

        {resetLink === "not-found" ? (
          <p className="text-sm text-zinc-600 bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-2xl">
            Se o e-mail estiver cadastrado, um link de redefinição foi gerado.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Link de redefinição</p>
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 break-all">
              <Link href={resetLink} className="text-sm font-semibold text-brand hover:underline">
                {resetLink}
              </Link>
            </div>
            <p className="text-xs text-zinc-400">Este link expira em 1 hora.</p>
          </div>
        )}

        <Link href="/auth/login" className="text-sm font-bold text-brand hover:text-brand-dark transition-colors underline decoration-brand/30 underline-offset-4">
          ← Voltar ao login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 w-full max-w-sm mx-auto sm:mx-0">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight">
          Esqueceu a <span className="text-brand">senha?</span>
        </h1>
        <p className="text-base text-zinc-500 font-medium">
          Informe seu e-mail e geraremos um link de redefinição.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {error && (
          <p className="text-sm font-semibold text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-2xl">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-xs font-bold text-zinc-600 uppercase tracking-widest">
            E-mail
          </label>
          <div className="group flex items-center gap-3 border border-zinc-200 bg-zinc-50 px-4 py-3.5 rounded-2xl
            focus-within:border-brand/50 focus-within:ring-4 focus-within:ring-brand/10 focus-within:bg-white transition-all duration-200">
            <MailIcon />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="hello@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-transparent text-sm font-semibold text-zinc-900 outline-none placeholder:text-zinc-400 placeholder:font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-brand hover:bg-brand-dark active:scale-[0.98] disabled:opacity-60
            text-white font-bold py-3.5 text-sm tracking-wide transition-all duration-200 cursor-pointer rounded-2xl
            shadow-sm shadow-brand/20 hover:shadow-md hover:shadow-brand/30 hover:-translate-y-0.5"
        >
          {loading ? "Gerando link..." : "Gerar link de redefinição"}
        </button>
      </form>

      <p className="text-sm font-medium text-zinc-500 text-center">
        Lembrou a senha?{" "}
        <Link href="/auth/login" className="text-brand hover:text-brand-dark font-bold transition-colors underline decoration-brand/30 underline-offset-4 hover:decoration-brand">
          Entrar
        </Link>
      </p>
    </div>
  );
}
