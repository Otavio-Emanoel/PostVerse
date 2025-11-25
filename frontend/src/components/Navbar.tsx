"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/services/api";

export default function Navbar() {
  const [user, setUser] = useState<{ nome?: string; tipo_usuario?: string } | null>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      fetch(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setUser(data);
        });
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return (
    <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <Link href="/" className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-sky-500 to-red-500 text-xs font-black tracking-tight shadow-lg shadow-emerald-500/30">
          ETEC
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
            Suporte TI
          </span>
          <span className="text-lg font-bold">PostVerse</span>
        </div>
      </Link>
      <div className="flex items-center gap-3 text-sm font-medium">
        <Link
          href="/dashboard"
          className="rounded-full px-3 py-1 text-slate-200 hover:bg-slate-800/80 transition-colors"
        >
          Dashboard
        </Link>
        {user ? (
          <>
            {user.tipo_usuario === "SUPORTE" && (
              <>
                <Link
                  href="/equipamentos/add"
                  className="rounded-full px-3 py-1 text-sky-200 hover:bg-sky-800/80 transition-colors"
                >
                  Adicionar Equipamento
                </Link>
                <Link
                  href="/locais/add"
                  className="rounded-full px-3 py-1 text-amber-200 hover:bg-amber-800/80 transition-colors"
                >
                  Adicionar Local
                </Link>
              </>
            )}
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-300">
              {user.nome || "Usuário"}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-full border border-red-400/70 bg-slate-900/60 px-4 py-1.5 text-red-200 shadow-sm shadow-red-500/40 transition hover:border-red-300 hover:bg-red-500/10"
            >
              Sair
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-full border border-emerald-400/70 bg-slate-900/60 px-4 py-1.5 text-emerald-200 shadow-sm shadow-emerald-500/40 transition hover:border-emerald-300 hover:bg-emerald-500/10"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-emerald-500 px-4 py-1.5 font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400"
            >
              Criar Conta
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
