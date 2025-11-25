"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/services/api";

export default function AddLocalPage() {
  const [nomeLocal, setNomeLocal] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/utils/locations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome_local: nomeLocal, descricao }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.error || "Erro ao adicionar local");
      } else {
        setSucesso("Local adicionado com sucesso!");
        setNomeLocal("");
        setDescricao("");
      }
    } catch {
      setErro("Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-2xl border border-white/10 bg-slate-950/60 p-6 shadow-2xl shadow-emerald-500/10">
      <h1 className="text-2xl font-semibold text-slate-50">Adicionar Local</h1>
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-200">Nome do Local</label>
          <input
            type="text"
            className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
            value={nomeLocal}
            onChange={(e) => setNomeLocal(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-200">Descrição</label>
          <input
            type="text"
            className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>
        {erro && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">{erro}</p>}
        {sucesso && <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">{sucesso}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400 disabled:opacity-60"
        >
          {loading ? "Adicionando..." : "Adicionar Local"}
        </button>
      </form>
    </div>
  );
}
