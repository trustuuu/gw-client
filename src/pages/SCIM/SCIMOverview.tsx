import { useState } from "react";
import { SCIM } from "../../types/SCIM";
import { useAuth } from "../../component/AuthContext";

interface SCIMOverviewProps {
  mode?: string;
  scim?: SCIM;
}

export default function SCIMOverview({ mode, scim: propScim }: SCIMOverviewProps) {
  const { scim: contextScim } = useAuth();
  const scim = propScim || contextScim;
  const [revealToken, setRevealToken] = useState(false);
  const [revealRefresh, setRevealRefresh] = useState(false);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast("Copied to clipboard");
    } catch (e) {
      toast("Copy failed");
    }
  };

  const toast = (msg: string) => {
    const el = document.createElement("div");
    el.textContent = msg;
    el.className =
      "fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm px-3 py-2 rounded shadow z-50 transition-opacity duration-300";
    document.body.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 300);
    }, 1400);
  };

  if (!scim) {
    return <div>No SCIM selected</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header appName={scim.name} mode={mode} />

      <main className="mx-auto max-w-6xl px-4 pb-24">
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card
            title="SCIM Credentials"
            subtitle="Identifiers used to configure your SCIM client"
          >
            <FieldRow label="ID">
              <KVPill value={scim.id} />
              <div className="flex gap-2">
                <Button onClick={() => copy(scim.id)} variant="ghost">
                  Copy
                </Button>
              </div>
            </FieldRow>

            <FieldRow label="Access Token">
              <KVPill
                value={
                  revealToken
                    ? scim.accessToken || ""
                    : mask(scim.accessToken || "")
                }
              />
              <div className="flex gap-2">
                <Button onClick={() => setRevealToken((v) => !v)}>
                  {revealToken ? "Hide" : "Reveal"}
                </Button>
                <Button
                  onClick={() => copy(scim.accessToken || "")}
                  variant="ghost"
                  disabled={!scim.accessToken}
                >
                  Copy
                </Button>
              </div>
            </FieldRow>

             <FieldRow label="Refresh Token">
              <KVPill
                value={
                  revealRefresh
                    ? scim.refreshToken || ""
                    : mask(scim.refreshToken || "")
                }
              />
              <div className="flex gap-2">
                <Button onClick={() => setRevealRefresh((v) => !v)}>
                  {revealRefresh ? "Hide" : "Reveal"}
                </Button>
                <Button
                  onClick={() => copy(scim.refreshToken || "")}
                  variant="ghost"
                    disabled={!scim.refreshToken}
                >
                  Copy
                </Button>
              </div>
            </FieldRow>

            <Divider />

             <FieldRow label="Display Name">
              <span className="text-sm font-medium text-slate-700">{scim.displayName}</span>
            </FieldRow>
          </Card>
           
           <Card title="Details" subtitle="Additional information">
                <FieldRow label="Notes">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{scim.notes || "No notes"}</p>
                </FieldRow>
           </Card>

        </section>
      </main>
    </div>
  );
}

// ---------- UI primitives ---------- //

function Header({ appName, mode }: { appName: string; mode?: string }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur mb-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
            <span className="text-lg font-semibold">SC</span>
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-800">
              SCIM Overview
            </h1>
            <p className="text-xs text-slate-500">{appName}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-[200px] text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="flex flex-1 items-center justify-between gap-3 sm:justify-end">
        {children}
      </div>
    </div>
  );
}

function Divider() {
  return <div className="my-4 h-px w-full bg-slate-200" />;
}

function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary:
      "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

function KVPill({ value }: { value: string }) {
  return (
    <code className="block max-w-full truncate rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[13px] text-slate-700">
      {value}
    </code>
  );
}

function mask(secret = "") {
  if (!secret) return "";
  if (secret.length <= 6) return "••••••";
  const head = secret.slice(0, 3);
  const tail = secret.slice(-3);
  return `${head}••••••${tail}`;
}
