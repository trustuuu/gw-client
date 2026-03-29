import { IntegrationQuestionnaire } from "../types/oauth-integration";

export const oauthIntegrationQuestionnaire: IntegrationQuestionnaire = {
  type: "oauth_integration_assistant",
  stage: "questionnaire",
  title: "Help me connect my app",
  description:
    "Answer a few questions and UniDir will recommend the right OAuth/OIDC setup.",
  questions: [
    {
      id: "appType",
      label: "What type of app are you integrating?",
      type: "single_select",
      required: true,
      options: [
        { value: "spa", label: "Single Page Application (SPA)" },
        { value: "server_web_app", label: "Server Web App / BFF" },
        { value: "mobile", label: "Mobile App" },
        { value: "m2m", label: "Backend Service / Machine-to-Machine" },
        { value: "unknown", label: "Not sure" },
      ],
      helpText:
        "This determines the security model and recommended OAuth flow.",
    },
    {
      id: "goal",
      label: "What do you need your app to do?",
      type: "single_select",
      required: true,
      options: [
        { value: "login_only", label: "Sign in users only" },
        {
          value: "login_and_api",
          label: "Sign in users and call protected APIs",
        },
        {
          value: "api_only",
          label: "Call protected APIs without user sign-in",
        },
        { value: "unknown", label: "Not sure" },
      ],
    },
    {
      id: "hasBackend",
      label: "Does your app have a backend server?",
      type: "single_select",
      required: true,
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "unknown", label: "Not sure" },
      ],
    },
    {
      id: "canStoreSecret",
      label: "Can your app safely store a client secret?",
      type: "single_select",
      required: true,
      options: [
        { value: "yes", label: "Yes, server-side only" },
        { value: "no", label: "No" },
        { value: "unknown", label: "Not sure" },
      ],
      helpText: "SPAs and mobile apps should not store client secrets.",
    },
    {
      id: "usesUnidirApi",
      label: "Will your app call a protected API created in UniDir?",
      type: "single_select",
      required: false,
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "unknown", label: "Not sure" },
      ],
    },
    {
      id: "framework",
      label: "Which framework or platform are you using?",
      type: "text",
      required: false,
      placeholder: "React, Next.js, Angular, React Native, ASP.NET, Node.js...",
    },
  ],
};
