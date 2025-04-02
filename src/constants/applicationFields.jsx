export const applicationFields = [
  {
    labelText: "Application Name",
    labelFor: "client_name",
    id: "client_name",
    name: "client_name",
    type: "text",
    autoComplete: "client_name",
    isRequired: true,
    placeholder: "Application Name",
    category: "settings.basic",
  },
  {
    labelText: "Domain",
    labelFor: "domain",
    id: "domain",
    name: "domain",
    type: "text",
    autoComplete: "domain",
    isRequired: true,
    placeholder: "Domain",
    category: "settings.basic",
  },
  {
    labelText: "Client Id",
    labelFor: "client_id",
    id: "client_id",
    name: "client_id",
    type: "text",
    autoComplete: "client_id",
    isRequired: false,
    placeholder: "Client Id",
    category: "settings.basic",
  },
  {
    labelText: "Client Secret",
    labelFor: "client_secret",
    id: "client_secret",
    name: "client_secret",
    type: "text",
    autoComplete: "client_secret",
    isRequired: true,
    placeholder: "Client Secret",
    category: "settings.basic",
  },
  {
    labelText: "Description",
    labelFor: "description",
    id: "description",
    name: "description",
    type: "textarea",
    autoComplete: "description",
    isRequired: false,
    placeholder: "Description",
    category: "settings.basic",
  },
  {
    labelText: "Application Logo",
    labelFor: "logo_uri",
    id: "logo_uri",
    name: "logo_uri",
    type: "text",
    autoComplete: "logo_uri",
    isRequired: false,
    placeholder: "Application Logo",
    category: "settings.properties",
  },
  {
    labelText: "Application Type",
    labelFor: "app_type",
    id: "app_type",
    name: "app_type",
    type: "select",
    autoComplete: "app_type",
    isRequired: false,
    placeholder: "Application Logo",
    list: [
      { key: "SPA", value: "Single Page Web Applications" },
      { key: "native", value: "Regular Web Applications" },
      { key: "native", value: "Native" },
      { key: "machine", value: "Machine to Machine Applications" },
    ],
    category: "settings.properties",
  },
  {
    labelText: "Audience",
    labelFor: "audience",
    id: "audience",
    name: "audience",
    type: "text",
    autoComplete: "audience",
    isRequired: false,
    placeholder: "Audience URI",
    category: "settings.uris",
  },
  {
    labelText: "Application Login URI",
    labelFor: "client_uri",
    id: "client_uri",
    name: "client_uri",
    type: "text",
    autoComplete: "client_uri",
    isRequired: false,
    placeholder: "Application Login URI",
    category: "settings.uris",
  },
  {
    labelText: "Application Logout URI",
    labelFor: "client_logout_uri",
    id: "client_logout_uri",
    name: "client_logout_uri",
    type: "textarea",
    valueType: "array",
    autoComplete: "client_logout_uri",
    isRequired: false,
    placeholder: "Application Logout URI",
    category: "settings.uris",
  },
  {
    labelText: "Allowed Callback URLs",
    labelFor: "redirect_uris",
    id: "redirect_uris",
    name: "redirect_uris",
    type: "textarea",
    valueType: "array",
    autoComplete: "redirect_uris",
    isRequired: false,
    placeholder: "Allowed Callback URLs",
    category: "settings.uris",
  },
  {
    labelText: "Allowed Web Orgins",
    labelFor: "allowed_web_orgins",
    id: "allowed_web_orgins",
    name: "allowed_web_orgins",
    type: "textarea",
    valueType: "array",
    autoComplete: "allowed_web_orgins",
    isRequired: false,
    placeholder: "Allowed Web Orgins",
    category: "settings.uris",
  },
  {
    labelText: "ID Token Expiration",
    labelFor: "id_token_expiration",
    id: "id_token_expiration",
    name: "id_token_expiration",
    type: "text",
    autoComplete: "id_token_expiration",
    isRequired: false,
    placeholder: "36000 seconds",
    category: "settings.idToken",
  },
  {
    labelText: "Rotation",
    labelFor: "refresh_token_rotation",
    id: "refresh_token_rotation",
    name: "refresh_token_rotation",
    type: "checkbox",
    autoComplete: "refresh_token_rotation",
    isRequired: false,
    placeholder: "Rotation",
    category: "settings.refreshTokenRotation",
  },
  {
    labelText: "Reuse Interval",
    labelFor: "refresh_reuse_interval",
    id: "refresh_reuse_interval",
    name: "refresh_reuse_interval",
    type: "text",
    autoComplete: "refresh_reuse_interval",
    isRequired: false,
    placeholder: "0 seconds",
    category: "settings.refreshTokenRotation",
  },
  {
    labelText: "Absolute Expiration",
    labelFor: "refresh_absolute_expiration",
    id: "refresh_absolute_expiration",
    name: "refresh_absolute_expiration",
    type: "checkbox",
    autoComplete: "refresh_absolute_expiration",
    isRequired: false,
    placeholder: "0 seconds",
    category: "settings.refreshTokenExpiration",
  },
  {
    labelText: "Absolute Lifetime",
    labelFor: "refresh_absolute_lifetime",
    id: "refresh_absolute_lifetime",
    name: "refresh_absolute_lifetime",
    type: "text",
    autoComplete: "refresh_absolute_lifetime",
    isRequired: false,
    placeholder: "31557600 seconds",
    category: "settings.refreshTokenExpiration",
  },
  {
    labelText: "Grant Types",
    labelFor: "grant_types",
    id: "grant_types",
    name: "grant_types",
    type: "select",
    list: [
      { key: "implicit", value: "Implicit" },
      { key: "authorization_code", value: "Authorization Code" },
      { key: "refresh_token", value: "Refresh Token" },
      { key: "client_credentials", value: "Client Credentials" },
      { key: "password", value: "Password" },
      { key: "MFA", value: "MFA" },
      { key: "passwordless_otp", value: "Passwordless OTP" },
    ],
    autoComplete: "grant_types",
    isRequired: false,
    placeholder: "Grant Types",
    category: "settings.advanced",
  },
];
