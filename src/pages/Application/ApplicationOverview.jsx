import { useState } from "react";

/**
 * OAuth "Application Overview" page (Auth0‑style) built with Tailwind CSS.
 * - Single-file React component
 * - Copy-to-clipboard for IDs/Secrets
 * - Editable Allowed URLs lists
 * - Toggle to reveal Client Secret
 * - Readonly / Edit modes per section
 *
 * Drop this into your React app and ensure Tailwind is set up.
 */

export default function ApplicationOverview({ mode, application }) {
  // Mock data you would normally fetch from your backend/IdP
  const [app, setApp] = useState({
    name: application.audience ? application.audience : "", // "My OAuth App",
    clientId: application.client_id ? application.client_id : "", //"q1w2e3r4t5y6u7i8o9p0",
    clientSecret: application.client_secret ? application.client_secret : "", //"s3cr3t_abc123_xyz789",
    applicationType: application.app_type ? application.app_type : "", //"Regular Web Application",
    tokenEndpointAuthMethod: "client_secret_post",
    allowedCallbackUrls: application.redirect_uris
      ? application.redirect_uris
      : [],
    // [
    // "https://localhost:3000/callback",
    // "https://app.example.com/callback",
    // ],
    allowedLogoutUrls: application.client_logout_uri
      ? application.client_logout_uri
      : [], //["https://localhost:3000/", "https://app.example.com/"],
    allowedWebOrigins: application.allowed_web_orgins
      ? application.allowed_web_orgins
      : [], //["http://localhost:3000", "https://app.example.com"],
    allowedCorsOrigins: ["http://localhost:3000", "https://api.example.com"],
    grantTypes: application.grant_types ? application.grant_types : [], //["authorization_code", "refresh_token"],
    connections: ["Username-Password-Authentication", "Google", "GitHub"],
  });

  const [revealSecret, setRevealSecret] = useState(false);
  const [editing, setEditing] = useState({
    callbacks: false,
    logouts: false,
    webOrigins: false,
    cors: false,
  });

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast("Copied to clipboard");
    } catch (e) {
      toast("Copy failed");
    }
  };

  const toast = (msg) => {
    // ultra-light toast
    const el = document.createElement("div");
    el.textContent = msg;
    el.className =
      "fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm px-3 py-2 rounded shadow z-50";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1400);
  };

  const updateList = (key, text) => {
    const list = text
      .split(/\n|,/) // accept comma or newline
      .map((s) => s.trim())
      .filter(Boolean);
    setApp((prev) => ({ ...prev, [key]: list }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header appName={app.name} mode={mode} />

      <main className="mx-auto max-w-6xl px-4 pb-24">
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card
            title="Application Credentials"
            subtitle="Identifiers used to configure your app"
          >
            <FieldRow label="Client ID">
              <KVPill value={app.clientId} />
              <div className="flex gap-2">
                <Button onClick={() => copy(app.clientId)} variant="ghost">
                  Copy
                </Button>
              </div>
            </FieldRow>

            <FieldRow label="Client Secret">
              <KVPill
                value={revealSecret ? app.clientSecret : mask(app.clientSecret)}
              />
              <div className="flex gap-2">
                <Button onClick={() => setRevealSecret((v) => !v)}>
                  {revealSecret ? "Hide" : "Reveal"}
                </Button>
                <Button onClick={() => copy(app.clientSecret)} variant="ghost">
                  Copy
                </Button>
              </div>
            </FieldRow>

            <Divider />

            <FieldRow label="Application Type">
              <Badge>{app.applicationType}</Badge>
            </FieldRow>
            <FieldRow label="Token Endpoint Auth Method">
              <Badge>{app.tokenEndpointAuthMethod}</Badge>
            </FieldRow>
            <FieldRow label="Enabled Grant Types">
              <div className="flex flex-wrap gap-2">
                {app.grantTypes.map((g) => (
                  <Badge key={g}>{g}</Badge>
                ))}
              </div>
            </FieldRow>
          </Card>

          <Card
            title="Connections"
            subtitle="Identity providers enabled for this app"
          >
            <ul className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {app.connections.map((c) => (
                <li
                  key={c}
                  className="flex items-center gap-2 rounded-md border bg-white p-3 shadow-sm"
                >
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium text-slate-700">
                    {c}
                  </span>
                </li>
              ))}
            </ul>
            {mode != "view" ? (
              <div className="mt-4">
                <Button variant="secondary">Manage Connections</Button>
              </div>
            ) : (
              <></>
            )}
          </Card>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <EditableListCard
            title="Allowed Callback URLs"
            subtitle="Where Auth Server can redirect after login"
            items={app.allowedCallbackUrls}
            isEditing={editing.callbacks}
            onEditToggle={() =>
              setEditing((e) => ({ ...e, callbacks: !e.callbacks }))
            }
            onSave={(text) => updateList("allowedCallbackUrls", text)}
            mode={mode}
          />

          <EditableListCard
            title="Allowed Logout URLs"
            subtitle="Where users can be sent after logout"
            items={app.allowedLogoutUrls}
            isEditing={editing.logouts}
            onEditToggle={() =>
              setEditing((e) => ({ ...e, logouts: !e.logouts }))
            }
            onSave={(text) => updateList("allowedLogoutUrls", text)}
            mode={mode}
          />

          <EditableListCard
            title="Allowed Web Origins"
            subtitle="Origins permitted to use your app with web-based flows"
            items={app.allowedWebOrigins}
            isEditing={editing.webOrigins}
            onEditToggle={() =>
              setEditing((e) => ({ ...e, webOrigins: !e.webOrigins }))
            }
            onSave={(text) => updateList("allowedWebOrigins", text)}
            mode={mode}
          />

          <EditableListCard
            title="Allowed CORS Origins"
            subtitle="Origins allowed for cross-origin requests"
            items={app.allowedCorsOrigins}
            isEditing={editing.cors}
            onEditToggle={() => setEditing((e) => ({ ...e, cors: !e.cors }))}
            onSave={(text) => updateList("allowedCorsOrigins", text)}
            mode={mode}
          />
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6">
          <Card
            title="Quick Start"
            subtitle="Kick off your integration with sample code and guides"
          >
            <div className="flex flex-wrap gap-3">
              <QSButton>React</QSButton>
              <QSButton>Next.js</QSButton>
              <QSButton>Node (Express)</QSButton>
              <QSButton>Python (Flask)</QSButton>
              <QSButton>.NET</QSButton>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}

// ---------- UI primitives ---------- //

function Header({ appName, mode }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <span className="text-lg font-semibold">OA</span>
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-800">
              Application Overview
            </h1>
            <p className="text-xs text-slate-500">{appName}</p>
          </div>
        </div>
        {mode != "view" ? (
          <div className="flex items-center gap-2">
            <Button variant="secondary">Test App</Button>
            <Button>Save Changes</Button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </header>
  );
}

function Card({ title, subtitle, children }) {
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

function FieldRow({ label, children }) {
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

function Button({ children, onClick, variant = "primary", type = "button" }) {
  const base =
    "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
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
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
      {children}
    </span>
  );
}

function KVPill({ value }) {
  return (
    <code className="block max-w-full truncate rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[13px] text-slate-700">
      {value}
    </code>
  );
}

function QSButton({ children }) {
  return (
    <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
      {children}
    </button>
  );
}

function EditableListCard({
  title,
  subtitle,
  items,
  isEditing,
  onEditToggle,
  onSave,
  mode,
}) {
  const [text, setText] = useState(items.join("\n"));

  // keep local text in sync when parent items change
  // eslint-disable-next-line
  useState(() => setText(items.join("\n")), [items]);

  return (
    <Card title={title} subtitle={subtitle}>
      {!isEditing ? (
        <div>
          <div className="flex flex-wrap gap-2">
            {items.length === 0 && (
              <span className="text-sm text-slate-500">None configured</span>
            )}
            {items.map((u) => (
              <span
                key={u}
                className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700"
              >
                {u}
              </span>
            ))}
          </div>
          {mode != "view" ? (
            <div className="mt-4">
              <Button variant="secondary" onClick={onEditToggle}>
                Edit
              </Button>
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <div>
          <label className="mb-2 block text-xs font-medium text-slate-600">
            Enter one per line or comma‑separated
          </label>
          <textarea
            className="h-32 w-full resize-y rounded-md border border-slate-300 bg-white p-3 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="mt-3 flex items-center gap-2">
            <Button
              onClick={() => {
                onSave(text);
                onEditToggle();
              }}
            >
              Save
            </Button>
            <Button variant="secondary" onClick={onEditToggle}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

function mask(secret = "") {
  if (!secret) return "";
  if (secret.length <= 6) return "••••••";
  const head = secret.slice(0, 3);
  const tail = secret.slice(-3);
  return `${head}••••••${tail}`;
}
