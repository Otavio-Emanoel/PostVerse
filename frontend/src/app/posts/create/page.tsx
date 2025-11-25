"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/services/api";

export default function CreatePostPage() {
	const [idEquipamento, setIdEquipamento] = useState("");
	const [idLocal, setIdLocal] = useState("");
	const [descricaoProblema, setDescricaoProblema] = useState("");
	const [erro, setErro] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

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
			const res = await fetch(`${API_BASE_URL}/posts`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					id_equipamento: Number(idEquipamento),
					id_local: Number(idLocal),
					// o backend exige id_solicitante; em cenário real viria do token.
					// aqui usamos um valor simbólico e o backend pode ajustar depois.
					id_solicitante: 1,
					descricao_problema: descricaoProblema,
				}),
			});
			const data = await res.json();
			if (!res.ok) {
				setErro(data.error || "Erro ao criar chamado");
			} else {
				router.push(`/posts/${data.id}`);
			}
		} catch {
			setErro("Erro de conexão com o servidor");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-2xl border border-white/10 bg-slate-950/60 p-6 shadow-2xl shadow-emerald-500/10">
			<h1 className="text-2xl font-semibold text-slate-50">Novo chamado</h1>
			<p className="text-sm text-slate-400">
				Descreva o problema de TI para que o suporte possa ajudá-lo.
			</p>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="grid gap-4 sm:grid-cols-2">
					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-200">
							ID do Equipamento
						</label>
						<input
							type="number"
							className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
							value={idEquipamento}
							onChange={(e) => setIdEquipamento(e.target.value)}
							required
						/>
					</div>
					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-200">
							ID do Local
						</label>
						<input
							type="number"
							className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
							value={idLocal}
							onChange={(e) => setIdLocal(e.target.value)}
							required
						/>
					</div>
				</div>

				<div className="space-y-1">
					<label className="text-xs font-medium text-slate-200">
						Descrição do Problema
					</label>
					<textarea
						className="min-h-[120px] w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
						value={descricaoProblema}
						onChange={(e) => setDescricaoProblema(e.target.value)}
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
					{loading ? "Enviando..." : "Criar chamado"}
				</button>
			</form>
		</div>
	);
}

