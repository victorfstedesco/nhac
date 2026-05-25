"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterSchema } from "@/lib/validations";

function MailIcon() {
  return (
    <svg className="w-5 h-5 text-zinc-400 shrink-0 group-focus-within:text-brand transition-colors duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="m2 4 10 9 10-9" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="w-5 h-5 text-zinc-400 shrink-0 group-focus-within:text-brand transition-colors duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="11" width="14" height="10" rx="3" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="w-5 h-5 text-zinc-400 shrink-0 group-focus-within:text-brand transition-colors duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("As senhas não coincidem");
      return;
    }

    const validation = RegisterSchema.safeParse({ name, email, password });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validation.data),
    });

    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Erro ao criar conta");
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-sm mx-auto sm:mx-0">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight">
          Criar <span className="text-brand">conta</span>
        </h1>
        <p className="text-base text-zinc-500 font-medium">
          Comece a acompanhar sua alimentação hoje.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <p className="text-sm font-semibold text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-2xl">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-xs font-bold text-zinc-600 uppercase tracking-widest">
            Nome
          </label>
          <div className="group flex items-center gap-3 border border-zinc-200 bg-zinc-50 px-4 py-3.5 rounded-2xl
            focus-within:border-brand/50 focus-within:ring-4 focus-within:ring-brand/10 focus-within:bg-white transition-all duration-200">
            <UserIcon />
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="flex-1 bg-transparent text-sm font-semibold text-zinc-900 outline-none placeholder:text-zinc-400 placeholder:font-medium"
            />
          </div>
        </div>

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

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-xs font-bold text-zinc-600 uppercase tracking-widest">
            Senha
          </label>
          <div className="group flex items-center gap-3 border border-zinc-200 bg-zinc-50 px-4 py-3.5 rounded-2xl
            focus-within:border-brand/50 focus-within:ring-4 focus-within:ring-brand/10 focus-within:bg-white transition-all duration-200">
            <LockIcon />
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="flex-1 bg-transparent text-sm font-semibold text-zinc-900 outline-none placeholder:text-zinc-400 placeholder:font-medium"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="confirm" className="text-xs font-bold text-zinc-600 uppercase tracking-widest">
            Confirmar senha
          </label>
          <div className="group flex items-center gap-3 border border-zinc-200 bg-zinc-50 px-4 py-3.5 rounded-2xl
            focus-within:border-brand/50 focus-within:ring-4 focus-within:ring-brand/10 focus-within:bg-white transition-all duration-200">
            <LockIcon />
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="Repita a senha"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="flex-1 bg-transparent text-sm font-semibold text-zinc-900 outline-none placeholder:text-zinc-400 placeholder:font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full bg-brand hover:bg-brand-dark active:scale-[0.98] disabled:opacity-60
            text-white font-bold py-3.5 text-sm tracking-wide transition-all duration-200 cursor-pointer rounded-2xl
            shadow-sm shadow-brand/20 hover:shadow-md hover:shadow-brand/30 hover:-translate-y-0.5"
        >
          {loading ? "Criando conta..." : "Criar minha conta"}
        </button>
      </form>

      <p className="text-sm font-medium text-zinc-500 text-center">
        Já tem uma conta?{" "}
        <Link
          href="/auth/login"
          className="text-brand hover:text-brand-dark font-bold transition-colors underline decoration-brand/30 underline-offset-4 hover:decoration-brand"
        >
          Entrar
        </Link>
      </p>
    </div>
  );
}
