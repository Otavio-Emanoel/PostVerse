"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "@/services/api";

type Post = {
	id_chamado: number;
	descricao_problema: string;
	descricao_solucao: string | null;
	status: "ABERTO" | "EM_ANALISE" | "CONCLUIDO";
};

export default function EditPostPage() {
	const params = useParams();
	const id = params?.id as string;
	const router = useRouter();
	const [post, setPost] = useState<Post | null>(null);
	const [descricaoProblema, setDescricaoProblema] = useState("");
	const [descricaoSolucao, setDescricaoSolucao] = useState("");
	const [status, setStatus] = useState<Post["status"]>("ABERTO");
	const [erro, setErro] = useState("");
	const [loading, setLoading] = useState(false);

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
				setDescricaoProblema(data.descricao_problema || "");
				setDescricaoSolucao(data.descricao_solucao || "");
				setStatus(data.status);
			} catch {
				router.replace("/dashboard");
			}
		}
		if (id) load();
	}, [id, router]);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setErro("");
		setLoading(true);
		const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
		if (!token) {
			router.replace("/auth/login");
			return;
		}
		try {
			const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					descricao_problema: descricaoProblema,
					status,
					descricao_solucao: descricaoSolucao,
				}),
			});
			const data = await res.json();
			if (!res.ok) {
				setErro(data.error || "Erro ao atualizar chamado");
			} else {
				router.push(`/posts/${id}`);
			}
		} catch {
			setErro("Erro de conexão com o servidor");
		} finally {
			setLoading(false);
		}
	}

	if (!post) {
		return <p className="text-sm text-slate-300">Carregando...</p>;
	}

	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-2xl border border-white/10 bg-slate-950/60 p-6 shadow-2xl shadow-emerald-500/10">
			<h1 className="text-2xl font-semibold text-slate-50">
				Editar chamado #{post.id_chamado.toString().padStart(3, "0")}
			</h1>
			<form onSubmit={handleSubmit} className="space-y-4 text-sm">
				<div className="space-y-1">
					<label className="text-xs font-medium text-slate-200">
						Descrição do Problema
					</label>
					<textarea
						className="min-h-[100px] w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
						value={descricaoProblema}
						onChange={(e) => setDescricaoProblema(e.target.value)}
						required
					/>
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-200">
							Status
						</label>
						<select
							className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
							value={status}
							onChange={(e) => setStatus(e.target.value as Post["status"])}
						>
							<option value="ABERTO">ABERTO</option>
							<option value="EM_ANALISE">EM_ANALISE</option>
							<option value="CONCLUIDO">CONCLUIDO</option>
						</select>
					</div>
				</div>

				<div className="space-y-1">
					<label className="text-xs font-medium text-slate-200">
						Descrição da Solução
					</label>
					<textarea
						className="min-h-[100px] w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
						value={descricaoSolucao}
						onChange={(e) => setDescricaoSolucao(e.target.value)}
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
					{loading ? "Salvando..." : "Salvar alterações"}
				</button>
			</form>
		</div>
	);
}

