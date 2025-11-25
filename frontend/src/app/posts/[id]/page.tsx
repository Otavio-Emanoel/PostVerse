"use client";

import { useEffect, useState } from "react";
type User = {
	id_usuario: number;
	nome: string;
	tipo_usuario: "SUPORTE" | "SOLICITANTE";
};
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
	const [user, setUser] = useState<User | null>(null);
	const [showModal, setShowModal] = useState(false);

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

	useEffect(() => {
		const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
		if (!token) return;
		async function fetchUser() {
			try {
				const res = await fetch(`${API_BASE_URL}/users/me`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (res.ok) {
					const data = await res.json();
					setUser(data);
				}
			} catch {}
		}
		fetchUser();
	}, []);

	if (loading) {
		return <p className="text-sm text-slate-300">Carregando...</p>;
	}

	if (!post) {
		return <p className="text-sm text-red-300">Chamado não encontrado.</p>;
	}

	// Lógica para editar
	function handleEdit() {
		if (!user) return;
		if (user.tipo_usuario === "SUPORTE") {
			router.push(`/posts/${post?.id_chamado}/edit`);
		} else {
			setShowModal(true);
		}
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
					<button
						onClick={handleEdit}
						className="rounded-full bg-sky-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-sky-500/40 transition hover:bg-sky-400"
					>
						Editar
					</button>
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

			{/* Modal para solicitante */}
			{showModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
					<div className="w-full max-w-md rounded-xl bg-slate-900 p-6 shadow-2xl border border-emerald-500/30">
						<h2 className="text-lg font-bold text-slate-50 mb-2">Editar chamado</h2>
						<p className="text-sm text-slate-300 mb-4">Como solicitante, você só pode editar a descrição do problema.</p>
						<button
							className="w-full rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400"
							onClick={() => {
								setShowModal(false);
								router.push(`/posts/${post.id_chamado}/edit?solicitante=1`);
							}}
						>
							Editar problema
						</button>
						<button
							className="mt-3 w-full rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-emerald-400 hover:bg-emerald-500/10"
							onClick={() => setShowModal(false)}
						>
							Cancelar
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

