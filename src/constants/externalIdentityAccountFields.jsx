export const externalIdentityAccountFields = [
  {
    labelText: "Name",
    labelFor: "name",
    id: "name",
    name: "name",
    type: "text",
    autoComplete: "name",
    isRequired: true,
    placeholder: "Name",
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
    labelText: "User Id",
    labelFor: "userId",
    id: "userId",
    name: "userId",
    type: "text",
    autoComplete: "userId",
    isRequired: true,
    placeholder: "User Id",
  },
  // {
  //   labelText: "Provider",
  //   labelFor: "provider",
  //   id: "provider",
  //   parentId: "connection",
  //   name: "provider",
  //   type: "select",
  //   list: [
  //     { key: "google", value: "Google" },
  //     { key: "azure", value: "Azure" },
  //     { key: "okta", value: "Okta" },
  //     {
  //       key: "custom",
  //       value: "Custom",
  //     },
  //   ],
  //   autoComplete: "provider",
  //   isRequired: true,
  //   placeholder: "provider",
  //   handleChange: (handleChange) => {
  //     return (e) => {
  //       console.log("e handleChange", e);
  //       const itemValue = e.target.value;
  //       console.log("source itemValue handleChange", itemValue);
  //       handleChange(e, itemValue);
  //       return itemValue;
  //     };
  //   },
  // },
  {
    labelText: "Connection",
    labelFor: "connection",
    id: "connection",
    parentId: "connection",
    name: "connection",
    type: "select",
    list: [],
    default: "google",
    autoComplete: "connection",
    isRequired: true,
    placeholder: "Connection",
    handleChange: (handleChange) => {
      return (e) => {
        const itemValue = e.target.value;
        handleChange(e, itemValue);
        return itemValue;
      };
    },
    source: {
      labelText: "Provider",
      labelFor: "provider",
      id: "provider",
      parentId: "connection",
      name: "provider",
      type: "select",
      list: [
        { key: "google", value: "Google" },
        { key: "azure", value: "Azure" },
        { key: "okta", value: "Okta" },
        {
          key: "custom",
          value: "Custom",
        },
      ],
      autoComplete: "provider",
      isRequired: true,
      placeholder: "provider",
      handleChange: (handleChange) => {
        return (e) => {
          const itemValue = e.target.value;
          handleChange(e, itemValue);
          return itemValue;
        };
      },
    },
  },
  // {
  //   labelText: "Provider",
  //   labelFor: "provider",
  //   id: "provider",
  //   name: "provider",
  //   type: "select",
  //   list: [
  //     { key: "google", value: "Google" },
  //     { key: "azure", value: "Azure" },
  //     { key: "okta", value: "Okta" },
  //     // {
  //     //   key: "custom",
  //     //   value: "Custom",
  //     // },
  //   ],
  //   default: "google",
  //   autoComplete: "provider",
  //   isRequired: true,
  //   placeholder: "Provider",
  //   handleChange: (handleChange) => {
  //     return (e) => {
  //       const itemValue = e.target.value;
  //       handleChange(e, itemValue);
  //       return itemValue;
  //     };
  //   },
  //   source: {
  //     labelText: "Connection",
  //     labelFor: "connection_select",
  //     id: "connection_select",
  //     parentId: "connection",
  //     name: "connection_select",
  //     type: "select",
  //     list: [
  //       { key: "google", value: "Google" },
  //       { key: "azure", value: "Azure" },
  //       { key: "okta", value: "Okta" },
  //       {
  //         key: "custom",
  //         value: "Custom",
  //       },
  //     ],
  //     autoComplete: "connection",
  //     isRequired: true,
  //     placeholder: "connection",
  //     handleChange: (handleChange) => {
  //       return (e) => {
  //         const itemValue = e.target.value;
  //         console.log("itemValue handleChange", itemValue);
  //         handleChange(e, itemValue);
  //         return itemValue;
  //       };
  //     },
  //   },
  // },
  // {
  //   labelText: "",
  //   labelFor: "connection",
  //   id: "connection",
  //   name: "connection",
  //   type: "text",
  //   source: {
  //     labelText: "Connection",
  //     labelFor: "connection_select",
  //     id: "connection_select",
  //     parentId: "connection",
  //     name: "connection_select",
  //     type: "select",
  //     list: [
  //       { key: "google", value: "Google" },
  //       { key: "azure", value: "Azure" },
  //       { key: "okta", value: "Okta" },
  //       {
  //         key: "custom",
  //         value: "Custom",
  //       },
  //     ],
  //     autoComplete: "connection",
  //     isRequired: true,
  //     placeholder: "connection",
  //     handleChange: (handleChange) => {
  //       return (e) => {
  //         const itemValue = e.target.value;
  //         console.log("itemValue handleChange", itemValue);
  //         handleChange(e, itemValue);
  //         return itemValue;
  //       };
  //     },
  //   },
  //   autoComplete: "connection",
  //   isRequired: true,
  //   placeholder: "connection",
  // },

  {
    labelText: "Provider User Id",
    labelFor: "providerUserId",
    id: "providerUserId",
    name: "providerUserId",
    type: "text",
    valueType: "array",
    autoComplete: "providerUserId",
    isRequired: true,
    placeholder: "Provider User Id",
  },
  {
    labelText: "Provider Refresh Token",
    labelFor: "Provider Refresh Token",
    id: "providerRefreshToken",
    name: "providerRefreshToken",
    type: "password",
    autoComplete: "providerRefreshToken",
    isRequired: false,
    placeholder: "Provider Refresh Token",
  },
  {
    labelText: "Provider Access Token",
    labelFor: "Provider Access Token",
    id: "providerAccessToken",
    name: "providerAccessToken",
    type: "password",
    autoComplete: "providerAccessToken",
    isRequired: true,
    placeholder: "Provider Access Token",
    component: ({ mode, handleClick }) => {
      return mode == "edit" ? (
        <input
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded max-w-40"
          type="button"
          value="Get New Token"
          onClick={handleClick}
        />
      ) : (
        <></>
      );
    },
  },
  {
    labelText: "Provider Access Expires At (Seconds)",
    labelFor: "providerAccessExpiresAt",
    id: "providerAccessExpiresAt",
    name: "providerAccessExpiresAt",
    type: "text",
    autoComplete: "providerAccessExpiresAt",
    isRequired: false,
    placeholder: "36000 seconds",
  },
  {
    labelText: "Provider Scopes",
    labelFor: "providerScopes",
    id: "providerScopes",
    name: "providerScopes",
    type: "textarea",
    valueType: "array",
    autoComplete: "providerScopes",
    isRequired: true,
    placeholder: "Provider Scopes",
  },
  {
    labelText: "Enabled",
    labelFor: "enabled",
    id: "enabled",
    name: "enabled",
    type: "checkbox",
    autoComplete: "enabled",
    isRequired: false,
    placeholder: "Enabled",
  },
];
