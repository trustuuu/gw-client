import {
  AppType,
  ClientType,
  IntegrationAnswers,
  IntegrationRecommendation,
  OAuthFlow,
} from "../types/oauth-integration";

function inferClientType(answers: IntegrationAnswers): ClientType {
  if (answers.appType === "spa" || answers.appType === "mobile") {
    return "public";
  }

  if (
    answers.appType === "server_web_app" ||
    answers.appType === "m2m" ||
    answers.canStoreSecret === "yes"
  ) {
    return "confidential";
  }

  return "unknown";
}

function inferFlow(answers: IntegrationAnswers): OAuthFlow {
  if (answers.appType === "m2m" || answers.goal === "api_only") {
    return "client_credentials";
  }

  if (answers.appType === "spa") {
    return "authorization_code_pkce";
  }

  if (answers.appType === "mobile") {
    return "authorization_code_pkce";
  }

  if (answers.appType === "server_web_app") {
    return "authorization_code";
  }

  return "unknown";
}

function flowLabel(flow: OAuthFlow): string {
  switch (flow) {
    case "authorization_code_pkce":
      return "Authorization Code Flow with PKCE";
    case "authorization_code":
      return "Authorization Code Flow";
    case "client_credentials":
      return "Client Credentials Flow";
    case "device_authorization":
      return "Device Authorization Flow";
    default:
      return "Unknown";
  }
}

function buildSummary(answers: IntegrationAnswers): string {
  if (answers.appType === "spa") {
    return "Your app appears to be a browser-based SPA.";
  }
  if (answers.appType === "mobile") {
    return "Your app appears to be a mobile application.";
  }
  if (answers.appType === "server_web_app") {
    return "Your app appears to be a server-based web application or BFF.";
  }
  if (answers.appType === "m2m") {
    return "Your app appears to be a backend service or machine-to-machine integration.";
  }
  return "Your app type is not fully clear yet.";
}

function buildFlowReasons(
  appType: AppType,
  flow: OAuthFlow,
  clientType: ClientType,
): string[] {
  if (flow === "authorization_code_pkce") {
    return [
      `${appType === "spa" ? "SPAs" : "Mobile apps"} are typically ${clientType} clients.`,
      "Public clients should not store a client secret.",
      "PKCE protects the authorization code exchange.",
    ];
  }

  if (flow === "authorization_code") {
    return [
      "Server-side apps can act as confidential clients.",
      "The backend can safely store the client secret.",
      "This works well with server-side session handling and BFF patterns.",
    ];
  }

  if (flow === "client_credentials") {
    return [
      "This scenario does not require user sign-in.",
      "A backend service can authenticate as the application itself.",
      "Client Credentials is the standard flow for service-to-service API access.",
    ];
  }

  return ["More information is needed to recommend the correct flow."];
}

export function generateIntegrationRecommendation(
  answers: IntegrationAnswers,
): IntegrationRecommendation {
  const clientType = inferClientType(answers);
  const flow = inferFlow(answers);

  const isPkce = flow === "authorization_code_pkce";
  const requiresApi =
    answers.goal === "login_and_api" || answers.goal === "api_only";

  return {
    type: "oauth_integration_recommendation",
    stage: "recommendation",
    appType: answers.appType,
    goal: answers.goal,
    summary: buildSummary(answers),
    assumptions: [
      answers.hasBackend === "unknown"
        ? "Backend availability was not fully specified."
        : `Backend presence: ${answers.hasBackend}.`,
      answers.canStoreSecret === "unknown"
        ? "Client secret storage capability was not fully specified."
        : `Client secret storage capability: ${answers.canStoreSecret}.`,
      requiresApi
        ? "The app needs protected API access."
        : "The app primarily needs user sign-in.",
    ],
    clientType,
    recommendedFlow: {
      id: flow,
      label: flowLabel(flow),
      why: buildFlowReasons(answers.appType, flow, clientType),
    },
    requiredApplicationSettings: [
      {
        key: "client_type",
        value: clientType,
        reason:
          "Determined from app architecture and secret storage capability.",
      },
      {
        key: "grant_types",
        value:
          flow === "client_credentials"
            ? ["client_credentials"]
            : ["authorization_code"],
      },
      {
        key: "pkce_required",
        value: isPkce,
        reason: isPkce
          ? "PKCE is recommended for public clients."
          : "Not required by default for this scenario.",
      },
      {
        key: "redirect_uris",
        value:
          flow === "client_credentials"
            ? []
            : [
                "http://localhost:3000/callback",
                "https://app.example.com/callback",
              ],
      },
      {
        key: "logout_redirect_uris",
        value:
          flow === "client_credentials"
            ? []
            : ["http://localhost:3000/", "https://app.example.com/"],
      },
    ],
    requiredApiSettings: requiresApi
      ? [
          {
            key: "audience",
            value: "https://api.example.com",
            reason: "Access tokens should target the protected API audience.",
          },
          {
            key: "scopes",
            value:
              answers.goal === "login_and_api"
                ? ["openid", "profile", "email", "read:data"]
                : ["read:data"],
            reason: "Scopes define what the client is allowed to access.",
          },
        ]
      : [],
    tokenHandling: {
      idToken:
        answers.goal === "login_only" || answers.goal === "login_and_api"
          ? "Use the ID token for authenticated user identity context."
          : undefined,
      accessToken: requiresApi
        ? "Use the access token as a bearer token when calling the protected API."
        : undefined,
      refreshToken:
        flow === "authorization_code_pkce" || flow === "authorization_code"
          ? "Use only if needed. Prefer rotation and secure storage."
          : "Usually not needed for Client Credentials; request a new access token when needed.",
    },
    securityNotes: [
      clientType === "public"
        ? "Do not store a client secret in the browser or mobile app."
        : "Store client secrets only on the server side.",
      "Use least-privilege scopes.",
      "Protect tokens appropriately based on client type.",
      requiresApi
        ? "Validate access tokens in the API or gateway."
        : "Use OIDC login only if API access is not required.",
    ],
    implementationSteps: [
      flow === "client_credentials"
        ? "Request an access token from the token endpoint using client credentials."
        : "Redirect the user to the authorization endpoint.",
      flow === "authorization_code_pkce"
        ? "Generate a PKCE code_verifier and code_challenge."
        : "Configure the client and callback endpoints.",
      flow === "client_credentials"
        ? "Call the protected API using the access token."
        : "Handle the callback and exchange the code for tokens.",
      requiresApi
        ? "Call the protected API using the access token and configured audience/scopes."
        : "Create the authenticated session and display user profile information.",
    ],
    nextActions: [
      { label: "Show sample code", action: "generate_code_sample" },
      {
        label: "Open Application settings",
        action: "open_application_settings",
      },
    ],
  };
}
