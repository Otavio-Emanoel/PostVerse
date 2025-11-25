"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/services/api";

type Post = {
	id_chamado: number;
	descricao_problema: string;
	descricao_solucao: string | null;
	status: "ABERTO" | "EM_ANALISE" | "CONCLUIDO";
	data_abertura: string;
	data_fechamento: string | null;
};

export default function PostDetailPage() {
	const params = useParams();
	const id = params?.id as string;
	const router = useRouter();
	const [post, setPost] = useState<Post | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function load() {
			try {
				const res = await fetch(`${API_BASE_URL}/posts/${id}`);
				if (!res.ok) {
					router.replace("/dashboard");
					return;
				}
				const data = await res.json();
				setPost(data);
			} finally {
				setLoading(false);
			}
		}
		if (id) load();
	}, [id, router]);

	if (loading) {
		return <p className="text-sm text-slate-300">Carregando...</p>;
	}

	if (!post) {
		return <p className="text-sm text-red-300">Chamado não encontrado.</p>;
	}

	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-2xl border border-white/10 bg-slate-950/60 p-6 shadow-2xl shadow-emerald-500/10">
			<div className="flex items-center justify-between gap-3">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
						Chamado #{post.id_chamado.toString().padStart(3, "0")}
					</p>
					<h1 className="text-2xl font-semibold text-slate-50">
						Detalhes do chamado
					</h1>
				</div>
				<div className="flex gap-2">
					<Link
						href={`/posts/${post.id_chamado}/edit`}
						className="rounded-full bg-sky-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-sky-500/40 transition hover:bg-sky-400"
					>
						Editar
					</Link>
					<Link
						href="/dashboard"
						className="rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-xs font-semibold text-slate-100 transition hover:border-emerald-400 hover:bg-emerald-500/10"
					>
						Voltar
					</Link>
				</div>
			</div>

			<div className="space-y-4 text-sm text-slate-200">
				<div>
					<p className="text-xs uppercase tracking-[0.2em] text-slate-400">
						Problema relatado
					</p>
					<p className="mt-1 whitespace-pre-wrap text-sm">
						{post.descricao_problema}
					</p>
				</div>
				<div>
					<p className="text-xs uppercase tracking-[0.2em] text-slate-400">
						Situação
					</p>
					<span
						className={`mt-1 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${
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
				<div className="grid gap-3 text-xs text-slate-400 sm:grid-cols-2">
					<p>
						Aberto em: {" "}
						{new Date(post.data_abertura).toLocaleString("pt-BR", {
							dateStyle: "short",
							timeStyle: "short",
						})}
					</p>
					<p>
						Fechado em: {" "}
						{post.data_fechamento
							? new Date(post.data_fechamento).toLocaleString("pt-BR", {
									dateStyle: "short",
									timeStyle: "short",
								})
							: "—"}
					</p>
				</div>

				<div>
					<p className="text-xs uppercase tracking-[0.2em] text-slate-400">
						Solução aplicada
					</p>
					<p className="mt-1 whitespace-pre-wrap text-sm text-slate-200">
						{post.descricao_solucao || "Ainda não foi registrada uma solução."}
					</p>
				</div>
			</div>
		</div>
	);
}

