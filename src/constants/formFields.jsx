import { ClipboardIcon, CheckIcon } from "@heroicons/react/24/outline";

const loginFields = [
  {
    labelText: "Email address",
    labelFor: "email",
    id: "email",
    name: "email",
    type: "email",
    autoComplete: "email",
    isRequired: true,
    placeholder: "Email address",
  },
  {
    labelText: "Password",
    labelFor: "password",
    id: "password",
    name: "password",
    type: "password",
    autoComplete: "current-password",
    isRequired: true,
    placeholder: "Password",
  },
];

const signupFields = [
  {
    labelText: "Username",
    labelFor: "userName",
    id: "userName",
    name: "userName",
    type: "text",
    autoComplete: "userName",
    isRequired: true,
    placeholder: "userName",
  },
  {
    labelText: "DisplayName",
    labelFor: "displayName",
    id: "displayName",
    name: "displayName",
    type: "text",
    autoComplete: "displayName",
    isRequired: true,
    placeholder: "displayName",
  },
  {
    labelText: "Email",
    labelFor: "email",
    id: "email",
    name: "email",
    type: "text",
    autoComplete: "email",
    isRequired: true,
    placeholder: "Email",
  },
  {
    labelText: "Password",
    labelFor: "password",
    id: "authVerification",
    name: "authVerification",
    type: "password",
    autoComplete: "authVerification",
    isRequired: true,
    placeholder: "Password",
    hiddenUpdate: true,
    hiddenDisplay: true,
  },
  {
    labelText: "Confirm Password",
    labelFor: "confirmPassword",
    id: "confirmPassword",
    name: "confirmPassword",
    type: "password",
    autoComplete: "confirmPassword",
    isRequired: true,
    placeholder: "Confirm Password",
    database: false,
    hiddenUpdate: true,
    hiddenDisplay: true,
  },
];

const domainFields = [
  {
    labelText: "Domain Name",
    labelFor: "domainName",
    id: "name",
    name: "name",
    type: "text",
    autoComplete: "name",
    isRequired: true,
    placeholder: "Domain Name",
  },
  {
    labelText: "Description",
    labelFor: "description",
    id: "description",
    name: "description",
    type: "text",
    autoComplete: "description",
    isRequired: false,
    placeholder: "Description",
  },
  // {
  //     labelText:"Primary",
  //     labelFor:"primary",
  //     id:"primary",
  //     name:"primary",
  //     type:"checkbox",
  //     autoComplete:"primary",
  //     isRequired:false,
  //     placeholder:"Primary",
  //     customClass: "ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
  // }
];

const connectionFields = [
  {
    labelText: "Connection Name",
    labelFor: "name",
    id: "name",
    name: "name",
    type: "text",
    autoComplete: "name",
    isRequired: true,
    placeholder: "Connection Name",
  },
  {
    labelText: "Description",
    labelFor: "description",
    id: "description",
    name: "description",
    type: "text",
    autoComplete: "description",
    isRequired: false,
    placeholder: "Description",
  },
  {
    labelText: "Provider",
    labelFor: "provider",
    id: "provider",
    name: "provider",
    type: "select",
    autoComplete: "provider",
    isRequired: true,
    placeholder: "Provider",
    list: [
      { key: "google", value: "Google" },
      { key: "azure", value: "Microsoft Graph (Azure)" },
      { key: "okta", value: "Okta" },
      { key: "salesforce", value: "Salesforce" },
      { key: "facebook", value: "Facebook" },
      { key: "unidir", value: "Universal Directory (GoodWorks)" },
      { key: "internal", value: "Internal" },
      {
        key: "custom",
        value: "Custom",
      },
    ],
    default: "google",
  },
  {
    labelText: "Client Id",
    labelFor: "clientId",
    id: "clientId",
    name: "clientId",
    type: "text",
    autoComplete: "clientId",
    isRequired: true,
    placeholder: "Client Id",
  },
  {
    labelText: "Client Secret",
    labelFor: "clientSecret",
    id: "clientSecret",
    name: "clientSecret",
    type: "password",
    autoComplete: "clientSecret",
    isRequired: true,
    placeholder: "Client Secret",
    component: ({ handleCopyClick, isCopied }) => {
      return (
        <div className={"py-4 px-4 "}>
          <button
            onClick={handleCopyClick}
            className={`
          flex items-center justify-center 
          py-2 px-4 rounded font-medium transition duration-150 ease-in-out
          ${
            isCopied
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }
        `}
            disabled={isCopied} // Optional: Disable button while checkmark is visible
          >
            {isCopied ? (
              <CheckIcon className="h-5 w-5" /> // Checkmark icon
            ) : (
              <ClipboardIcon className="h-5 w-5" /> // Copy icon
            )}

            <span>{isCopied ? "Copied!" : "Copy"}</span>
          </button>
        </div>
      );
    },
  },
  {
    labelText: "Scopes",
    labelFor: "scopes",
    id: "scopes",
    name: "scopes",
    valueType: "array",
    type: "textarea",
    autoComplete: "scopes",
    isRequired: true,
    placeholder: "Scopes",
  },
  {
    labelText: "Redirect Url",
    labelFor: "redirectUrl",
    id: "redirectUrl",
    name: "redirectUrl",
    type: "text",
    autoComplete: "redirectUrl",
    isRequired: true,
    placeholder: "Redirect Url",
  },
  {
    labelText: "Authorization Url",
    labelFor: "authorizationUrl",
    id: "authorizationUrl",
    name: "authorizationUrl",
    type: "text",
    autoComplete: "authorizationUrl",
    isRequired: false,
    placeholder:
      "Authorization Url (e.g. https://dev-123.okta.com/oauth2/v1/authorize)",
  },
];

const companyFields = [
  {
    labelText: "Company Name",
    labelFor: "name",
    id: "name",
    name: "name",
    type: "text",
    autoComplete: "name",
    isRequired: true,
    placeholder: "Company Name",
  },
  {
    labelText: "Display Name",
    labelFor: "displayName",
    id: "displayName",
    name: "displayName",
    type: "text",
    autoComplete: "displayName",
    isRequired: true,
    placeholder: "Display Name",
  },
  {
    labelText: "Description",
    labelFor: "description",
    id: "description",
    name: "description",
    type: "text",
    autoComplete: "description",
    isRequired: false,
    placeholder: "Description",
  },
  // {
  //     labelText:"Primary",
  //     labelFor:"primary",
  //     id:"primary",
  //     name:"primary",
  //     type:"checkbox",
  //     autoComplete:"primary",
  //     isRequired:false,
  //     placeholder:"Primary",
  //     customClass: "ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
  // }
  // ,
  {
    labelText: "Type",
    labelFor: "type",
    id: "type",
    name: "type",
    type: "select",
    autoComplete: "type",
    isRequired: false,
    placeholder: "Type",
    list: [
      { key: "customer", value: "Customer" },
      { key: "reseller", value: "Reseller" },
    ],
    default: "customer",
    reseller: true,
  },
];

const groupFields = [
  {
    labelText: "Group Name",
    labelFor: "name",
    id: "name",
    name: "name",
    type: "text",
    autoComplete: "name",
    isRequired: true,
    placeholder: "Group Name",
  },
  {
    labelText: "Display Name",
    labelFor: "displayName",
    id: "displayName",
    name: "displayName",
    type: "text",
    autoComplete: "displayName",
    isRequired: true,
    placeholder: "Display Name",
  },
  {
    labelText: "Notes",
    labelFor: "notes",
    id: "notes",
    name: "notes",
    type: "textarea",
    autoComplete: "notes",
    isRequired: false,
    placeholder: "Notes",
  },
  {
    labelText: "Email",
    labelFor: "email",
    id: "email",
    name: "email",
    type: "text",
    autoComplete: "email",
    isRequired: true,
    placeholder: "Email",
  },
];

//signingAlgorithm
export {
  loginFields,
  signupFields,
  domainFields,
  companyFields,
  groupFields,
  connectionFields,
};
