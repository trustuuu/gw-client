# 🧠 AI Agentic Universal Directory (UniDir)

**AI Agentic Universal Directory** — also known as **UniDir** — is an advanced **OAuth2 Authorization Server** and **AI-powered Agent Platform** that unifies traditional identity management and modern AI interaction.

It supports **all standard OAuth 2.0 and OpenID Connect flows**, **Machine-to-Machine (M2M)** authentication, **Token Exchange (RFC 8693)**, and **MCP (Model Context Protocol)** integration for AI Agents that can reason about and retrieve directory information in natural language.

---

## 🚀 Key Features

- ✅ **Full OAuth 2.0 & OIDC compliance**

  - Authorization Code Grant (+PKCE)
  - Client Credentials
  - Refresh Token
  - Resource Owner Password Credentials (legacy) (Working....)
  - Device Authorization Grant (Working....)
  - Token Exchange (RFC 8693) (Working....)

  | Grant Type                              | Description                                                   | Endpoint Example                                |
  | --------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------- |
  | **Authorization Code**                  | Used by web apps (confidential clients). Supports PKCE.       | `/oauth2/authorize`, `/oauth2/token`            |
  | **Client Credentials**                  | For machine-to-machine (M2M) or backend service auth.         | `/oauth2/token`                                 |
  | **Resource Owner Password Credentials** | Legacy mode for trusted first-party clients.                  | `/oauth2/token`                                 |
  | **Device Authorization**                | For TV/CLI devices with no browser.                           | `/oauth2/device_authorization`, `/oauth2/token` |
  | **Refresh Token**                       | Obtain new access tokens without user re-login.               | `/oauth2/token`                                 |
  | **Token Exchange (RFC 8693)**           | Exchange one token for another (impersonation or delegation). | `/oauth2/token`                                 |
  | **Implicit (deprecated)**               | For legacy browser apps (not recommended).                    | `/oauth2/authorize`                             |

| Endpoint                   | Purpose                                     |
| -------------------------- | ------------------------------------------- |
| `/oauth2/authorize`        | Start authorization (browser redirect flow) |
| `/oauth2/token`            | Issue tokens for all grant types            |
| `/oauth2/introspect`       | Validate token metadata                     |
| `/oauth2/revoke`           | Revoke tokens                               |
| `/oauth2/jwks.json`        | Public signing keys                         |
| `/t/:tenantId/scim/v2/...` | Directory endpoints                         |
| `/mcp/query`               | AI MCP endpoint for agent queries           |

flowchart TD
A[User / AI Client] -->|OAuth2 + MCP| B[UniDir OAuth Server]
B --> C[SCIM Directory API]
B --> D[Token Service / JWKS]
B --> E[AI Agent Runtime]
E --> F[External APIs / Knowledge / Identity Providers]

| Variable             | Description                                      |
| -------------------- | ------------------------------------------------ |
| `UNIDIR_BASE_URL`    | Base URL of OAuth2 server                        |
| `UNIDIR_JWKS_PATH`   | Path for JWKS file                               |
| `UNIDIR_ISSUER`      | Issuer name for tokens                           |
| `UNIDIR_DB_URL`      | Database connection string                       |
| `UNIDIR_MCP_ENABLED` | `true` to enable Agentic query endpoint          |
| `UNIDIR_AI_MODEL`    | Default model (e.g., `gpt-4o`, `gemini-1.5-pro`) |

- 🧩 **Multi-tenant support**
  - Tenant-scoped endpoints
  - Segregated OUs and email domain scoping
- 🔐 **Advanced Token Management**
  - JWT or opaque tokens
  - Rotating signing keys (JWKS endpoint)
  - Introspection and revocation endpoints
- ⚙️ **SCIM 2.0 Integration**
  - `/scim/v2/Users`, `/scim/v2/Groups`, and enterprise extensions
- 🤖 **AI Agentic Extension**
  - Built-in **MCP (Model Context Protocol)** adapter for connecting LLM-based agents
  - Agents can query or mutate directory data conversationally
  - Example: _“List all active users in iGoodWorks tenant”_ → structured API response
  <!-- - 🔄 **Event & Automation Hooks**
  - Webhooks, Pub/Sub, and Durable Task support for sync automation
- 🧱 **Extensible via Plugins**
  - AI Agent Plugins (TypeScript or Python)
  - External IDP integrations (Azure AD, Okta, Google Workspace) -->

---

## 🧠 What Is “Agentic” in UniDir?

An **Agentic Directory** means the directory itself can be _queried, reasoned about, and acted upon_ by AI agents using structured tools (OAuth + MCP).

**Example:**

```bash
User: "Show me all users in the Sales department hired after 2023"
Agent → UniDir:
  GET /t/igoodworks/scim/v2/Users?filter=department eq "Sales" and startDate gt "2023-01-01"
```
