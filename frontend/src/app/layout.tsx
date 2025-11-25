import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PostVerse | Suporte TI ETEC",
  description: "Sistema de chamados de TI para a ETEC",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 antialiased">
        <div className="fixed inset-0 -z-10 opacity-40 pointer-events-none">
          {/* fundo com “ruído” e blur colorido */}
          <div className="absolute -top-40 -left-32 h-80 w-80 rounded-full bg-emerald-500 blur-3xl" />
          <div className="absolute top-20 right-0 h-80 w-80 rounded-full bg-sky-500 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-red-500/70 blur-3xl" />
        </div>

        <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur">
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
            </div>
          </nav>
        </header>

        <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col px-4 py-8">
          {children}
        </main>

        <footer className="border-t border-white/10 bg-slate-950/80">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-xs text-slate-400">
            <span>Projeto acadêmico ETEC · Suporte de TI</span>
            <span>PostVerse · {new Date().getFullYear()}</span>
          </div>
        </footer>
      </body>
    </html>
  );
}