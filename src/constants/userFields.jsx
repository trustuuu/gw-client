import AddressList from "../pages/User/AddressList";
import ObjectPost from "../pages/User/ObjectPost";
import ValueList from "../pages/User/ValueList";

export const userFields = [
  {
    labelText: "User Name",
    labelFor: "userName",
    id: "userName",
    name: "userName",
    type: "text",
    autoComplete: "userName",
    isRequired: true,
    placeholder: "User Name",
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
    labelText: "Name",
    labelFor: "name",
    id: "name",
    name: "name",
    type: "component",
    autoComplete: "name",
    isRequired: false,
    placeholder: "Name",
    initOpen: true,
    component: ({ mode, values, handleChange, propName }) => {
      return (
        <>
          {/* <div className="px-2">
            {propName.charAt(0).toUpperCase() + propName.slice(1)}
          </div> */}
          <ObjectPost
            key={propName}
            propName={propName}
            modeObject={mode}
            Item={values}
            fields={nameFields}
            //   handleCancel={handleClose}
            //   handleCreate={handleCreate}
            //handleSave={handleChange}
            handleParent={handleChange}
          />
        </>
      );
    },
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
  {
    labelText: "Addresses",
    labelFor: "addresses",
    id: "addresses",
    name: "addresses",
    type: "component",
    autoComplete: "addresses",
    isRequired: false,
    placeholder: "addresses",
    component: ({ mode, values, handleChange, propName }) => {
      return (
        <AddressList
          key={propName}
          modeAddress={mode}
          addresses={values}
          handleChange={handleChange}
          propName={propName}
        />
      );
    },
  },
  {
    labelText: "Emails",
    labelFor: "emails",
    id: "emails",
    name: "emails",
    type: "component",
    autoComplete: "emails",
    isRequired: false,
    placeholder: "emails",
    component: ({ mode, values, handleChange, propName }) => {
      return (
        <ValueList
          key={propName}
          modeValue={mode}
          values={values}
          handleChange={handleChange}
          propName={propName}
        />
      );
    },
  },
  {
    labelText: "PhoneNumbers",
    labelFor: "phoneNumbers",
    id: "phoneNumbers",
    name: "phoneNumbers",
    type: "component",
    autoComplete: "phoneNumbers",
    isRequired: false,
    placeholder: "phoneNumbers",
    component: ({ mode, values, handleChange, propName }) => {
      return (
        <ValueList
          key="phoneNumbers"
          modeValue={mode}
          values={values}
          handleChange={handleChange}
          propName={propName}
        />
      );
    },
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

export const nameFields = [
  {
    labelText: "Family Name",
    labelFor: "familyName",
    id: "familyName",
    name: "familyName",
    type: "text",
    autoComplete: "familyName",
    isRequired: false,
    placeholder: "Family Name",
  },
  {
    labelText: "Formatted Name",
    labelFor: "formatted",
    id: "formatted",
    name: "formatted",
    type: "text",
    autoComplete: "formatted",
    isRequired: false,
    placeholder: "Formatted Name",
  },
  {
    labelText: "Given Name",
    labelFor: "givenName",
    id: "givenName",
    name: "givenName",
    type: "text",
    autoComplete: "givenName",
    isRequired: false,
    placeholder: "Given Name",
  },
  {
    labelText: "Honorific Prefix",
    labelFor: "honorificPrefix",
    id: "honorificPrefix",
    name: "honorificPrefix",
    type: "text",
    autoComplete: "honorificPrefix",
    isRequired: false,
    placeholder: "Honorific Prefix",
  },
  {
    labelText: "Honorific Suffix",
    labelFor: "honorificSuffix",
    id: "honorificSuffix",
    name: "honorificSuffix",
    type: "text",
    autoComplete: "honorificSuffix",
    isRequired: false,
    placeholder: "Honorific Suffix",
  },
];
