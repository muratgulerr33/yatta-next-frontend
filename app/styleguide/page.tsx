// app/styleguide/page.tsx
// Fix: Prevent hydration mismatch by deferring any client-only values (like resolved CSS vars)
// and marking the text node with suppressHydrationWarning.

"use client";

import { useEffect, useMemo, useState } from "react";

type Token = { name: string; label: string; group: "neutrals" | "brand" | "state" };

const TOKENS: Token[] = [
  // neutrals
  { name: "--bg", label: "bg", group: "neutrals" },
  { name: "--fg", label: "fg", group: "neutrals" },
  { name: "--muted", label: "muted", group: "neutrals" },
  { name: "--muted-foreground", label: "muted-foreground", group: "neutrals" },
  { name: "--card", label: "card", group: "neutrals" },
  { name: "--card-foreground", label: "card-foreground", group: "neutrals" },
  { name: "--border", label: "border", group: "neutrals" },
  // brand
  { name: "--primary", label: "primary", group: "brand" },
  { name: "--primary-foreground", label: "primary-foreground", group: "brand" },
  { name: "--primary-hover", label: "primary-hover", group: "brand" },
  { name: "--primary-active", label: "primary-active", group: "brand" },
  { name: "--accent", label: "accent", group: "brand" },
  { name: "--accent-foreground", label: "accent-foreground", group: "brand" },
  { name: "--accent-solid", label: "accent-solid", group: "brand" },
  { name: "--accent-solid-foreground", label: "accent-solid-foreground", group: "brand" },
  // state
  { name: "--ring", label: "ring", group: "state" },
  { name: "--success", label: "success", group: "state" },
  { name: "--warning", label: "warning", group: "state" },
  { name: "--danger", label: "danger", group: "state" },
];

/** Read current value of a CSS custom property by rendering a hidden probe node. */
function resolveCssVar(name: string) {
  const probe = document.createElement("div");
  probe.style.background = `var(${name})`;
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  probe.style.pointerEvents = "none";
  document.body.appendChild(probe);
  const rgb = getComputedStyle(probe).backgroundColor; // resolved color (e.g., rgb(...))
  document.body.removeChild(probe);
  return rgb;
}

function Swatch({ name, label }: { name: string; label: string }) {
  const [mounted, setMounted] = useState(false);
  const [resolved, setResolved] = useState<string | null>(null);

  // Ensure consistent SSR/CSR: render placeholder until mounted
  useEffect(() => { setMounted(true); }, []);

  // Resolve color once when mounted (V1 uses only light theme)
  useEffect(() => {
    if (!mounted) return;
    setResolved(resolveCssVar(name));
  }, [mounted, name]);

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--fg)]">
      <div className="w-10 h-10 rounded-full border border-[var(--border)]" style={{ background: `var(${name})` }} />
      <div className="flex-1 min-w-0">
        <div className="font-semibold">{label} <span className="opacity-60">{name}</span></div>
        {/* Prevent hydration mismatch: show placeholder on SSR and allow client update */}
        <div className="text-xs opacity-70 truncate" suppressHydrationWarning>{mounted ? (resolved ?? "—") : "—"}</div>
        <div className="mt-1 flex overflow-hidden rounded-lg">
          <span className="px-2 py-1 text-xs font-semibold" style={{ background: `var(${name})`, color: "#0b1220", borderRight: "1px solid rgba(0,0,0,.06)" }}>Aa</span>
          <span className="px-2 py-1 text-xs font-semibold" style={{ background: `var(${name})`, color: "#e6e9ef" }}>Aa</span>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const groups: Record<string, Token[]> = useMemo(() => ({
    neutrals: TOKENS.filter(t => t.group === "neutrals"),
    brand: TOKENS.filter(t => t.group === "brand"),
    state: TOKENS.filter(t => t.group === "state"),
  }), []);

  return (
    <section className="min-h-dvh px-6 py-8 bg-[var(--bg)] text-[var(--fg)]">
      <header className="w-full mb-6">
        <div>
          <h1 className="text-2xl font-bold">Styleguide — Colors & Components</h1>
          <p className="text-sm text-[var(--muted-foreground)]">Token önizlemesi ve temel bileşenler.</p>
        </div>
      </header>

      <section className="w-full space-y-6">
        {/* Typography */}
        <div className="rounded-2xl p-5 border border-[var(--border)] bg-[var(--card)]">
          <h2 className="text-xl font-semibold mb-3">Typography</h2>
          <h1 className="text-3xl font-bold mb-1">H1 — Başlık örneği</h1>
          <h2 className="text-2xl font-semibold mb-1">H2 — Bölüm başlığı</h2>
          <p className="text-[var(--muted-foreground)] leading-relaxed">Bu bir paragraf örneği. Renkler CSS tokenları üzerinden gelir; tema değişiminde otomatik uyum sağlar.</p>
        </div>

        {/* Buttons & Controls */}
        <div className="rounded-2xl p-5 border border-[var(--border)] bg-[var(--card)]">
          <h2 className="text-xl font-semibold mb-3">Buttons</h2>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] active:bg-[var(--primary-active)] focus:outline-[3px] focus:outline-[var(--ring)] focus:outline-offset-2">Primary</button>
            <button className="px-4 py-2 rounded-lg bg-[var(--accent)] text-[var(--accent-foreground)] focus:outline-[3px] focus:outline-[var(--ring)] focus:outline-offset-2">Accent</button>
            <button className="px-4 py-2 rounded-lg bg-[var(--accent-solid)] text-[var(--accent-solid-foreground)] focus:outline-[3px] focus:outline-[var(--ring)] focus:outline-offset-2">Accent Solid</button>
            <button className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--fg)] hover:bg-[var(--muted)] focus:outline-[3px] focus:outline-[var(--ring)] focus:outline-offset-2">Outline</button>
            <a href="#" className="px-4 py-2 rounded-lg underline text-[var(--primary)] hover:text-[var(--primary-hover)] focus:outline-[3px] focus:outline-[var(--ring)] focus:outline-offset-2">Link</a>
            <input placeholder="Input" className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] focus:outline-[3px] focus:outline-[var(--ring)] focus:outline-offset-2" />
          </div>
        </div>

        {/* Colors — Neutrals */}
        <div className="rounded-2xl p-5 border border-[var(--border)] bg-[var(--card)]">
          <h2 className="text-xl font-semibold mb-3">Colors — Neutrals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {groups.neutrals.map(t => <Swatch key={t.name} name={t.name} label={t.label} />)}
          </div>
        </div>

        {/* Colors — Brand */}
        <div className="rounded-2xl p-5 border border-[var(--border)] bg-[var(--card)]">
          <h2 className="text-xl font-semibold mb-3">Colors — Brand</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {groups.brand.map(t => <Swatch key={t.name} name={t.name} label={t.label} />)}
          </div>
        </div>

        {/* Colors — State */}
        <div className="rounded-2xl p-5 border border-[var(--border)] bg-[var(--card)]">
          <h2 className="text-xl font-semibold mb-3">Colors — State</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {groups.state.map(t => <Swatch key={t.name} name={t.name} label={t.label} />)}
          </div>
        </div>
      </section>

      <footer className="w-full py-10 text-sm text-[var(--muted-foreground)]">YATTA — Styleguide Playground</footer>
    </section>
  );
}
