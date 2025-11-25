export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-xs text-slate-400">
        <span>Projeto acadêmico ETEC · Suporte de TI - Otavio e Samuel</span>
        <span>PostVerse · {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
