"use client";

import Link from "next/link";
import "./landing.css"; // vamos criar esse arquivo para o card com hover

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10 py-10">
      <section className="grid w-full grid-cols-1 items-center gap-10 md:grid-cols-[1.4fr,1fr]">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full border border-emerald-400/60 bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-emerald-200">
            ETEC · Suporte de TI
          </span>
          <h1 className="text-balance text-4xl font-bold leading-tight text-slate-50 md:text-5xl">
            Central de chamados moderna para a{" "}
            <span className="bg-gradient-to-r from-emerald-300 via-sky-300 to-red-300 bg-clip-text text-transparent">
              ETEC
            </span>
            .
          </h1>
          <p className="max-w-xl text-base text-slate-300/90 md:text-lg">
            Abra, acompanhe e conclua chamados de tecnologia com uma interface
            bonita e intuitiva. Alunos, professores e equipe técnica em um só
            lugar.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400"
            >
              Entrar na Plataforma
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full border border-slate-600 bg-slate-900/60 px-6 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-emerald-400 hover:bg-emerald-500/10"
            >
              Criar conta
            </Link>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-slate-400">
            <span className="rounded-full border border-white/10 bg-slate-900/60 px-3 py-1">
              MySQL · Procedures, Views & Triggers
            </span>
            <span className="rounded-full border border-white/10 bg-slate-900/60 px-3 py-1">
              Node + Next.js
            </span>
            <span className="rounded-full border border-white/10 bg-slate-900/60 px-3 py-1">
              JWT · Bcrypt
            </span>
          </div>
        </div>

        {/* Card com efeito inspirado no exemplo */}
        <div className="flex items-center justify-center">
          <div className="etec-card">
            <div className="etec-card-inner">
              <p className="text-xs font-semibold tracking-[0.25em] text-emerald-200/90">
                DASHBOARD
              </p>
              <h2 className="mt-3 text-2xl font-bold text-slate-50">
                Chamados em tempo real
              </h2>
              <p className="mt-3 text-sm text-slate-300/90">
                Visualize rapidamente chamados em aberto, em análise ou
                concluídos. Tudo organizado por laboratório, sala e prioridade.
              </p>

              <div className="mt-6 flex gap-3 text-xs text-slate-300">
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-200">
                  12 chamados em aberto
                </span>
                <span className="rounded-full bg-sky-500/15 px-3 py-1 text-sky-200">
                  4 em análise
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}