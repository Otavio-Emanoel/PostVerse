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
  id_solicitante?: number;
};

type User = {
  id_usuario: number;
  nome: string;
  tipo_usuario: "SUPORTE" | "SOLICITANTE";
};

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login");
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
          setUser(meData);
        } else {
          router.replace("/login");
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
          {posts.map((post) => {
            const isMyPost = user && post.id_solicitante === user.id_usuario;
            return (
              <div
                key={post.id_chamado}
                className={`group relative overflow-hidden rounded-2xl border p-4 transition z-0
                  ${isMyPost
                    ? "border-emerald-500/70 bg-emerald-950/70 hover:border-emerald-400/90 hover:bg-emerald-900/90"
                    : "border-slate-700/70 bg-slate-900/70 opacity-70 cursor-not-allowed"}
                `}
              >
                {/* Só permite entrar nos próprios chamados */}
                {isMyPost ? (
                  <Link
                    href={`/posts/${post.id_chamado}`}
                    className="absolute inset-0 z-10"
                    aria-label={`Ver chamado ${post.id_chamado}`}
                  />
                ) : null}
                <div className={`absolute inset-0 transition-opacity bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-transparent ${isMyPost ? "opacity-0 group-hover:opacity-100" : "opacity-0"}`} />
                <div className="relative space-y-2 z-20">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${isMyPost ? "bg-emerald-800/80 text-emerald-200" : "bg-slate-800/80 text-slate-300"}`}>
                    #{post.id_chamado.toString().padStart(3, "0")}
                  </span>
                  <p className={`line-clamp-2 text-sm ${isMyPost ? "text-emerald-50" : "text-slate-400"}`}>
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
                        ? isMyPost ? "bg-emerald-500/30 text-emerald-300" : "bg-emerald-500/10 text-emerald-300/60"
                        : post.status === "EM_ANALISE"
                        ? isMyPost ? "bg-amber-500/30 text-amber-300" : "bg-amber-500/10 text-amber-300/60"
                        : isMyPost ? "bg-red-500/30 text-red-300" : "bg-red-500/10 text-red-300/60"
                    }`}
                  >
                    {post.status}
                  </span>

                  {/* Botões de editar/deletar só para solicitante dono */}
                  {user && user.tipo_usuario === "SOLICITANTE" && isMyPost && (
                    <div className="flex gap-2 mt-2">
                      <Link
                        href={`/posts/${post.id_chamado}`}
                        className="rounded-full bg-sky-500 px-3 py-1 text-xs font-semibold text-slate-950 shadow-md shadow-sky-500/40 transition hover:bg-sky-400"
                      >
                        Editar
                      </Link>
                      <button
                        className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow-md shadow-red-500/40 transition hover:bg-red-400"
                        onClick={async (e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (confirm("Tem certeza que deseja deletar este chamado?")) {
                            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                            if (!token) return;
                            const res = await fetch(`${API_BASE_URL}/posts/${post.id_chamado}`, {
                              method: "DELETE",
                              headers: { Authorization: `Bearer ${token}` },
                            });
                            if (res.ok) {
                              setPosts((prev) => prev.filter((p) => p.id_chamado !== post.id_chamado));
                            }
                          }
                        }}
                      >
                        Deletar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}