import { useEffect, useState } from "react";
import apiApi from "../../api/api-api";

/**
 * OAuth / OIDC "API Overview" page (Auth0‑style) built with Tailwind CSS.
 * - Single-file React component
 * - API identifier (audience), signing alg, lifetimes
 * - Scopes editor with add/remove
 * - RBAC toggle and settings
 * - Test call helper (pseudocode)
 *
 * Drop into your app; back with real API as needed.
 */

export default function ApiOverview(prop) {
  const [api, setApi] = useState({
    name: prop.api.id, //"My Resource API",
    identifier: prop.api.identifier ? prop.api.identifier : "", //"https://api.example.com/",
    signingAlg: prop.api.signingAlgorithm ? prop.api.signingAlgorithm : "", //"RS256",
    accessTokenLifetime: prop.api.tokenExpiration
      ? prop.api.tokenExpiration
      : 1440, //3600, // seconds
    allowOfflineAccess: false,
    rbacEnabled: prop.api.RBAC ? prop.api.RBAC : false,
    enforcePermissions: prop.api.addPermissionAccessToken
      ? prop.api.addPermissionAccessToken
      : false,
    scopes: [],
    // [
    //   { value: "read:orders", description: "Read orders" },
    //   { value: "write:orders", description: "Create and update orders" },
    //   { value: "delete:orders", description: "Delete orders" },
    // ],
    allowedCorsOrigins: ["https://app.example.com", "http://localhost:3000"],
  });

  const [newScope, setNewScope] = useState({ value: "", description: "" });
  const [editingCors, setEditingCors] = useState(false);
  const [corsText, setCorsText] = useState(api.allowedCorsOrigins.join("\n"));
  const getApiScopes = async () => {
    if (!prop.api || !prop.api.id) return;

    const scopes = await apiApi.getPermissions(prop.api.id);
    setApi((prev) => ({
      ...prev,
      scopes: scopes.data
        ? scopes.data.map((s) => {
            return { value: s.permission, description: s.description };
          })
        : [],
    }));
  };
  const toast = (msg) => {
    const el = document.createElement("div");
    el.textContent = msg;
    el.className =
      "fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm px-3 py-2 rounded shadow z-50";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1400);
  };

  const addScope = () => {
    const v = newScope.value.trim();
    if (!/^[-a-z0-9:.]+$/i.test(v))
      return toast("Use letters, numbers, :, . or -");
    if (api.scopes.some((s) => s.value === v)) return toast("Scope exists");
    setApi((prev) => ({
      ...prev,
      scopes: [
        ...prev.scopes,
        { value: v, description: newScope.description.trim() },
      ],
    }));
    setNewScope({ value: "", description: "" });
  };

  const removeScope = (value) => {
    setApi((prev) => ({
      ...prev,
      scopes: prev.scopes.filter((s) => s.value !== value),
    }));
  };

  const saveCors = () => {
    const list = corsText
      .split(/\n|,/) // newline or comma
      .map((s) => s.trim())
      .filter(Boolean);
    setApi((p) => ({ ...p, allowedCorsOrigins: list }));
    setEditingCors(false);
  };

  useEffect(() => {
    getApiScopes();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header apiName={api.name} mode={prop.mode} />

      <main className="mx-auto max-w-6xl px-4 pb-24">
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card
            title="API Settings"
            subtitle="Identifiers and token configuration"
          >
            <Field label="Name">
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={api.name}
                onChange={(e) =>
                  setApi((p) => ({ ...p, name: e.target.value }))
                }
              />
            </Field>
            <Field label="Identifier (Audience)">
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={api.identifier}
                onChange={(e) =>
                  setApi((p) => ({ ...p, identifier: e.target.value }))
                }
                placeholder="https://api.example.com/"
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Signing Algorithm">
                <select
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={api.signingAlg}
                  onChange={(e) =>
                    setApi((p) => ({ ...p, signingAlg: e.target.value }))
                  }
                >
                  <option value="RS256">RS256 (recommended)</option>
                  <option value="HS256">HS256</option>
                </select>
              </Field>

              <Field label="Access Token Lifetime (seconds)">
                <input
                  type="number"
                  min={300}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={api.accessTokenLifetime}
                  onChange={(e) =>
                    setApi((p) => ({
                      ...p,
                      accessTokenLifetime: Number(e.target.value),
                    }))
                  }
                />
              </Field>
            </div>

            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Toggle
                label="Enable RBAC"
                checked={api.rbacEnabled}
                onChange={(v) => setApi((p) => ({ ...p, rbacEnabled: v }))}
                mode={prop.mode}
              />
              <Toggle
                label="Enforce Permissions (RBAC)"
                checked={api.enforcePermissions}
                onChange={(v) =>
                  setApi((p) => ({ ...p, enforcePermissions: v }))
                }
                disabled={!api.rbacEnabled}
                mode={prop.mode}
              />
              <Toggle
                label="Allow Offline Access (refresh tokens)"
                checked={api.allowOfflineAccess}
                onChange={(v) =>
                  setApi((p) => ({ ...p, allowOfflineAccess: v }))
                }
                mode={prop.mode}
              />
            </div>
          </Card>

          <Card
            title="Scopes"
            subtitle="Define permissions your API understands"
          >
            <div className="space-y-3">
              {api.scopes.length === 0 && (
                <p className="text-sm text-slate-500">No scopes defined.</p>
              )}
              <ul className="space-y-2">
                {api.scopes.map((s) => (
                  <li
                    key={s.value}
                    className="flex items-start justify-between gap-3 rounded-md border border-slate-200 bg-white p-3 shadow-sm"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-800">
                        {s.value}
                      </div>
                      {s.description && (
                        <div className="text-xs text-slate-500">
                          {s.description}
                        </div>
                      )}
                    </div>
                    {prop.mode != "view" ? (
                      <button
                        className="text-sm text-slate-600 hover:text-red-600"
                        onClick={() => removeScope(s.value)}
                      >
                        Remove
                      </button>
                    ) : (
                      <></>
                    )}
                  </li>
                ))}
              </ul>

              {prop.mode != "view" ? (
                <div className="rounded-lg border border-dashed border-slate-300 p-3">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
                    <input
                      className="sm:col-span-2 rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="read:orders"
                      value={newScope.value}
                      onChange={(e) =>
                        setNewScope((x) => ({ ...x, value: e.target.value }))
                      }
                    />
                    <input
                      className="sm:col-span-3 rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Description (optional)"
                      value={newScope.description}
                      onChange={(e) =>
                        setNewScope((x) => ({
                          ...x,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>
                  {prop.mode != "view" ? (
                    <div className="mt-2">
                      <Button onClick={addScope}>Add Scope</Button>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <></>
              )}
            </div>
          </Card>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card
            title="Allowed CORS Origins"
            subtitle="Origins permitted for cross-origin calls to your API"
          >
            {!editingCors ? (
              <div>
                <div className="flex flex-wrap gap-2">
                  {api.allowedCorsOrigins.map((o) => (
                    <span
                      key={o}
                      className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700"
                    >
                      {o}
                    </span>
                  ))}
                </div>
                <div className="mt-3">
                  {prop.mode != "view" ? (
                    <Button
                      variant="secondary"
                      onClick={() => setEditingCors(true)}
                    >
                      Edit
                    </Button>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-600">
                  Enter one per line or comma‑separated
                </label>
                <textarea
                  className="h-28 w-full resize-y rounded-md border border-slate-300 bg-white p-3 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={corsText}
                  onChange={(e) => setCorsText(e.target.value)}
                />
                <div className="mt-2 flex gap-2">
                  <Button onClick={saveCors}>Save</Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setCorsText(api.allowedCorsOrigins.join("\n"));
                      setEditingCors(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>

          <Card
            title="Test Call"
            subtitle="Try an authorization flow against this API"
          >
            <p className="text-sm text-slate-600">
              Use your Authorization Server to request an access token with
              audience:
            </p>
            <code className="mt-2 block overflow-auto rounded-md bg-slate-900 p-3 text-xs text-slate-100">
              {`curl --request POST \\
  --url https://your-tenant.example.com/oauth/v1/token \\
  --header 'content-type: application/json' \\
  --data '{
    "client_id": "YOUR_CLIENT_ID",
    "client_secret": "YOUR_CLIENT_SECRET",
    "audience": "${api.identifier}",
    "grant_type": "client_credentials"
  }'`}
            </code>
            <p className="mt-3 text-xs text-slate-500">
              For SPA/Native apps, use Authorization Code + PKCE and set{" "}
              <code>audience</code> to this API identifier.
            </p>
          </Card>
        </section>

        <section className="mt-6">
          <Card
            title="Security Recommendations"
            subtitle="Hardening tips for APIs"
          >
            <ul className="list-disc space-y-1 pl-6 text-sm text-slate-700">
              <li>
                Prefer <b>RS256</b> over HS256 for token signing.
              </li>
              <li>
                Use short-lived access tokens; issue refresh tokens only when
                needed.
              </li>
              <li>
                Enable <b>RBAC</b> and <b>Enforce Permissions</b> so access
                tokens must carry required scopes/roles.
              </li>
              <li>
                Validate <code>aud</code>, <code>iss</code>, <code>exp</code>,
                and signature on every request.
              </li>
            </ul>
          </Card>
        </section>
      </main>
    </div>
  );
}

// ---------- UI primitives ---------- //

function Header({ apiName, mode }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
            <span className="text-lg font-semibold">API</span>
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-800">
              API Overview
            </h1>
            <p className="text-xs text-slate-500">{apiName}</p>
          </div>
        </div>
        {mode != "view" ? (
          <div className="flex items-center gap-2">
            <Button variant="secondary">Docs</Button>
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

function Field({ label, children }) {
  return (
    <div className="mb-4">
      <div className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      {children}
    </div>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
}) {
  const base =
    "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary:
      "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50",
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

function Toggle({ label, checked, onChange, disabled, mode }) {
  return (
    <label
      className={`flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-3 shadow-sm ${
        disabled ? "opacity-60" : ""
      }`}
    >
      <span className="text-sm text-slate-700">{label}</span>
      <button
        type="button"
        onClick={mode != "view" ? () => !disabled && onChange(!checked) : null}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
          checked ? "bg-indigo-600" : "bg-slate-300"
        } ${disabled ? "pointer-events-none" : ""}`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
            checked ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
    </label>
  );
}
