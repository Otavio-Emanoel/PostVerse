"use client";

import { useState } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/services/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.error || "Erro ao fazer login");
      } else {
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard";
      }
    } catch {
      setErro("Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-2xl border border-white/10 bg-slate-950/60 p-6 shadow-2xl shadow-emerald-500/10">
      <h1 className="text-2xl font-semibold text-slate-50">Entrar</h1>
      <p className="text-sm text-slate-400">
        Acesse o painel de chamados da ETEC.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-200">E-mail</label>
          <input
            type="email"
            className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-200">Senha</label>
          <input
            type="password"
            className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        {erro && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400 disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="text-xs text-slate-400">
        Não tem uma conta?{" "}
        <Link
          href="/register"
          className="font-medium text-emerald-300 hover:text-emerald-200"
        >
          Criar conta
        </Link>
      </p>
    </div>
  );
}