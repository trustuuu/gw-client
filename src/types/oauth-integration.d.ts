export type AppType = "spa" | "server_web_app" | "mobile" | "m2m" | "unknown";

export type IntegrationGoal =
  | "login_only"
  | "login_and_api"
  | "api_only"
  | "unknown";

export type YesNoUnknown = "yes" | "no" | "unknown";

export type OAuthFlow =
  | "authorization_code_pkce"
  | "authorization_code"
  | "client_credentials"
  | "device_authorization"
  | "unknown";

export type ClientType = "public" | "confidential" | "unknown";

export interface IntegrationQuestionOption {
  value: string;
  label: string;
  description?: string;
}

export interface IntegrationQuestion {
  id: string;
  label: string;
  type: "single_select" | "text";
  required?: boolean;
  helpText?: string;
  placeholder?: string;
  options?: IntegrationQuestionOption[];
}

export interface IntegrationQuestionnaire {
  type: "oauth_integration_assistant";
  stage: "questionnaire";
  title: string;
  description?: string;
  questions: IntegrationQuestion[];
}

export interface IntegrationAnswers {
  appType: AppType;
  goal: IntegrationGoal;
  hasBackend: YesNoUnknown;
  canStoreSecret: YesNoUnknown;
  usesUnidirApi: YesNoUnknown;
  framework?: string;
}

export interface RecommendationReason {
  code: string;
  message: string;
}

export interface ConfigItem {
  key: string;
  value: string | boolean | string[];
  reason?: string;
}

export interface TokenHandlingGuide {
  idToken?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface IntegrationRecommendation {
  type: "oauth_integration_recommendation";
  stage: "recommendation";
  appType: AppType;
  goal: IntegrationGoal;
  summary: string;
  assumptions: string[];
  clientType: ClientType;
  recommendedFlow: {
    id: OAuthFlow;
    label: string;
    why: string[];
  };
  requiredApplicationSettings: ConfigItem[];
  requiredApiSettings: ConfigItem[];
  tokenHandling: TokenHandlingGuide;
  securityNotes: string[];
  implementationSteps: string[];
  nextActions?: {
    label: string;
    action: string;
  }[];
}

export interface ClarificationQuestion {
  id: string;
  question: string;
  reason: string;
}

export interface IntegrationClarification {
  type: "oauth_integration_clarification";
  stage: "clarification";
  message: string;
  questions: ClarificationQuestion[];
}

export interface ChatbotIntegrationRequest {
  applicationId: string;
  apiId?: string;
  userMessage: string;
  existingAnswers?: Partial<IntegrationAnswers>;
}

export interface ChatbotIntegrationResponse {
  type: "chatbot_integration_response";
  mode: "clarification" | "recommendation";
  clarification?: IntegrationClarification;
  recommendation?: IntegrationRecommendation;
}
