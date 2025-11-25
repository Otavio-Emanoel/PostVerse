import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
          <Navbar />
        </header>

        <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col px-4 py-8">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}