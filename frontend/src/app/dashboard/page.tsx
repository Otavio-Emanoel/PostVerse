"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/services/api";

type Post = {
  id_chamado: number;
  descricao_problema: string;
  status: "ABERTO" | "EM_ANALISE" | "CONCLUIDO";
  data_abertura: string;
};

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    async function load() {
      try {
        // busca usuário logado
        const meRes = await fetch(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (meRes.ok) {
          const meData = await meRes.json();
          setUserName(meData.nome ?? meData.name ?? "Usuário");
        } else {
          router.replace("/auth/login");
          return;
        }

        // busca posts
        const res = await fetch(`${API_BASE_URL}/posts`);
        const data = await res.json();
        setPosts(data);
      } catch {
        // tratar erro se quiser
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">
            Olá, {userName ?? "carregando..."}
          </h1>
          <p className="text-xs text-slate-400">
            Estes são os chamados de TI da ETEC.
          </p>
        </div>
        <Link
          href="/posts/create"
          className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400"
        >
          + Novo Chamado
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-slate-300">Carregando...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id_chamado}
              href={`/posts/${post.id_chamado}`}
              className="group relative overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4 transition hover:border-emerald-400/70 hover:bg-slate-900/90"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-transparent" />
              <div className="relative space-y-2">
                <span className="inline-flex rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-slate-300">
                  #{post.id_chamado.toString().padStart(3, "0")}
                </span>
                <p className="line-clamp-2 text-sm text-slate-50">
                  {post.descricao_problema}
                </p>
                <p className="text-[11px] text-slate-400">
                  Aberto em{" "}
                  {new Date(post.data_abertura).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    post.status === "CONCLUIDO"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : post.status === "EM_ANALISE"
                      ? "bg-amber-500/20 text-amber-300"
                      : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {post.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}