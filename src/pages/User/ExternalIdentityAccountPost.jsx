import { useEffect, useState } from "react";
import { externalIdentityAccountFields } from "../../constants/externalIdentityAccountFields";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../../component/AuthContext";
import userApi from "../../api/user-api";
import Input from "../../component/Input";
import FormAction from "../../component/FormAction";
import ItemView from "../../component/ItemView";
import domainApi from "../../api/domain-api";
import { httpClient } from "../../api/httpClient";

const orgFields = externalIdentityAccountFields;
let fieldsState = {};
orgFields.forEach(
  (field) =>
    (fieldsState[field.id] =
      field.type == "checkbox" ? false : field.default ?? "")
);
export default function ExternalIdentityAccountPost() {
  const location = useLocation();
  const navigate = useNavigate();
  const [errorText, setError] = useState();
  //const { account, domain, company, user } = location.state;
  const {
    user: userAuth,
    setIsLoading,
    company: companyAuth,
    domain: domainAuth,
  } = useAuth();
  const {
    account: accountState,
    company: companyState,
    domain: domainState,
    user: userState,
    mode: modeState,
  } = location.state || {};

  const user = userState ? userState : userAuth;
  const domain = domainState ? domainState : domainAuth;
  const company = companyState ? companyState : companyAuth;
  const [searchParams] = useSearchParams();
  const [account, setAccount] = useState(accountState);

  useEffect(() => {
    const fetchData = async () => {
      if (!account) {
        const encodedData = searchParams.get("data");

        if (encodedData) {
          try {
            // Step 1: Decode the Base64 string into a raw string
            const rawJsonString = atob(encodedData);

            // Step 2: Convert the raw string (which might contain Unicode characters)
            // to a URI-safe string before parsing. This is usually necessary for complex objects.
            const jsonString = decodeURIComponent(escape(rawJsonString));
            // Final Step: Parse the JSON object
            const data = JSON.parse(jsonString);
            setMode(data.mode);
            const acc = await userApi.getExternalIdentityAccount(
              company.id,
              domain.id,
              user.id,
              data.accountId
            );
            // 3. Set your state using the recovered object
            setAccount(acc.data);
            setItemState(acc.data);
          } catch (e) {
            console.error("Failed to decode session data:", e);
            // Handle error (e.g., redirect to an error page)
          }
        }
      }
    };
    fetchData();
  }, [searchParams]);

  const [mode, setMode] = useState(modeState);
  const [itemState, setItemState] = useState(
    mode == "new" ? { ...fieldsState } : { ...account }
  );
  const [currentConnections, setCurrentConnections] = useState([]);
  const [fields, setFields] = useState(orgFields);

  const getConnections = async (provider) => {
    try {
      setIsLoading(true);
      const dom = await domainApi.getConnections(company.id, domain.id);
      setIsLoading(false);
      return dom.data.filter((c) => c.provider == provider);
    } catch (error) {
      if (error.status === 401) navigate("/");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (account && account.provider) {
      getConnections(account.provider).then((newValue) => {
        const newValues = Array.isArray(newValue)
          ? newValue.map((c) => ({ key: c.id, value: c.name }))
          : [];
        setCurrentConnections(newValue);
        setFields((prev) =>
          prev.map((item) =>
            item.id === "connection"
              ? {
                  ...item,
                  list: newValues,
                  labelText: mode == "view" ? "Connection" : "",
                }
              : item
          )
        );
      });
    }
  }, []);

  const handleChange = async (e, sourceValue) => {
    if (sourceValue) {
      const targetId = e.target.getAttribute("parentid")
        ? e.target.getAttribute("parentid")
        : e.target.id;
      //const currentItem = fields.filter((f) => f.id === targetId)[0];
      const newValue = await getConnections(sourceValue);
      setCurrentConnections(newValue);
      const newValues = Array.isArray(newValue)
        ? newValue.map((c) => ({ key: c.id, value: c.name }))
        : [];
      setFields((prev) =>
        prev.map((item) =>
          item.id === targetId
            ? { ...item, list: [{ key: "", value: "" }, ...newValues] }
            : item
        )
      );
    }

    setItemState({
      ...itemState,
      [e.target.id]:
        e.target.value == "true" || e.target.value == "false"
          ? e.target.checked
          : e.target.value,
    });
  };

  const handleSubmit = (event) => {
    setIsLoading(true);
    createAccount();
    setIsLoading(false);
    event.preventDefault();
  };

  const createAccount = async () => {
    try {
      const data = {
        ...itemState,
        //id: itemState.name,
      };
      await userApi.addExternalIdentityAccount(
        company.id,
        domain.id,
        user.id,
        data
      );
      navigate(-1);
    } catch (err) {
      if (err.response.status == 409) {
        setError(`duplicated error: ${itemState.name} already exist!`);
      } else {
        setError(err.message);
      }
      console.log(err);
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();

    if (event.target.textContent == "Cancel") {
      if (mode == "edit") setMode("view");
      else navigate(-1);
    } else if (window.history.length) {
      navigate("/users-view-external-identity-account");
    } else navigate(-1);
  };

  const handleEdit = (event) => {
    setMode("edit");
    setFields((prev) =>
      prev.map((item) =>
        item.id === "connection"
          ? {
              ...item,
              labelText: "",
            }
          : item
      )
    );
    event.preventDefault();
  };

  const handleSave = async (event) => {
    setIsLoading(true);
    saveItem();
    setIsLoading(false);
    event.preventDefault();
  };

  const saveItem = async () => {
    try {
      await userApi.updateExternalIdentityAccount(
        company.id,
        domain.id,
        user.id,
        itemState
      );
      setMode("view"); //navigate(-1);
    } catch (err) {
      if (err.response.status == 409) {
        setError(`duplicated error: ${itemState.name} already exist!`);
      } else {
        setError(err.message);
      }
      console.log(err);
    }
  };

  const onClickToken = async () => {
    try {
      // if (
      //   !httpClient.defaults.headers.common ||
      //   !httpClient.defaults.headers.common["Authorization"].startsWith(
      //     "Bearer "
      //   )
      // ) {
      //   throw new Error(
      //     "Authorization header not found or not in Bearer format."
      //   );
      // }
      // const data = {
      //   grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
      //   subject_token: httpClient.defaults.headers.common["Authorization"],
      //   subject_token_type: "urn:ietf:params:oauth:token-type:access_token",
      //   audience: "google-native-token",
      //   scope: itemState.providerScopes,
      // };
      // const token = await userApi.retrieveExternalIdentityAccountNewToken(data);
      // console.log("token", token);

      const connection = currentConnections.find(
        (c) => c.connection === c.connection
      );
      //const tokenEndpointGoogle = "https://oauth2.googleapis.com/token";
      const authUrlGoogle = import.meta.env.VITE_AUTH_URL_GOOGLE; //"https://accounts.google.com/o/oauth2/v2/auth";
      console.log(
        import.meta.env.VITE_AUTH_URL_GOOGLE,
        "https://accounts.google.com/o/oauth2/v2/auth"
      );
      const authUrl = new URL(authUrlGoogle);
      authUrl.searchParams.append("client_id", connection.clientId);
      authUrl.searchParams.append("redirect_uri", connection.redirectUrl);
      authUrl.searchParams.append("response_type", "code"); // Requesting the authorization code
      authUrl.searchParams.append("scope", connection.scopes.join(" "));
      authUrl.searchParams.append("access_type", "offline"); // MANDATORY to get a Refresh Token
      authUrl.searchParams.append("prompt", "consent"); // MANDATORY to ensure you get a Refresh Token on first consent
      const reqId = `google-${Math.random().toString(8).substring(2, 8)}`;
      const stateData = {
        companyId: company.id,
        domainId: domain.id,
        userId: user.id,
        accountId: account.id,
        connectionId: connection.id,
        csrfToken: reqId,
        origin: window.location.origin,
      };
      const encodedState = btoa(JSON.stringify(stateData));
      // Now send this encodedState in your authorization request
      authUrl.searchParams.append("state", encodedState);
      window.location.href = authUrl;
      //const authWindow = window.open(authUrl, '_blank', 'width=600,height=700');
      navigate("/users-external-account-view");
      //setMode("view"); //navigate(-1);
    } catch (err) {
      if (err.response && err.response.status == 409) {
        setError(`duplicated error: ${itemState.name} already exist!`);
      } else {
        setError(err.message);
      }
      console.log(err);
    }
  };
  const customClassEdit =
    "ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 min-w-80 dark:bg-gray-800 bg-gray-400 text-gray-800";
  const customClass =
    "ms-2 text-sm font-medium text-gray-900 dark:text-gray-800 min-w-80 dark:bg-gray-300";

  if (mode == "new" || mode == "edit") {
    return (
      <div className="flex justify-center">
        <form className="mt-8 space-y-6">
          <h4 className="text-red-400">{errorText}</h4>
          <div className="space-y-4">
            {fields.map((field) => {
              return (
                <div>
                  <Input
                    key={field.id}
                    handleChange={handleChange}
                    value={itemState[field.id]}
                    field={field}
                    customClass={
                      field.customClass ? field.customClass : customClass
                    }
                  />
                  {field.component ? (
                    field.component({
                      mode: mode,
                      handleClick: onClickToken,
                    })
                  ) : (
                    <></>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-center">
            <div className="mr-3">
              <FormAction
                handleSubmit={mode == "new" ? handleSubmit : handleSave}
                text={mode == "new" ? "Create" : "Save"}
              />
            </div>
            <div>
              <FormAction handleSubmit={handleCancel} text="Cancel" />
            </div>
          </div>
        </form>
      </div>
    );
  } else {
    return (
      <div className="flex justify-center">
        <form className="mt-8 space-y-6 w-full max-w-md sm:max-w-lg">
          <h4 className="text-red-400">{errorText}</h4>
          <div className="space-y-4">
            {account
              ? fields.map((field) => (
                  <ItemView
                    Item={account}
                    key={field.id}
                    handleChange={handleChange}
                    value={itemState[field.id]}
                    field={field}
                    customClass={
                      field.customClass ? field.customClass : customClassEdit
                    }
                  />
                ))
              : null}
          </div>
          <div className="flex justify-center">
            <div className="mr-3">
              <FormAction handleSubmit={handleEdit} text="Edit" />
            </div>
            <div>
              <FormAction handleSubmit={handleCancel} text="Close" />
            </div>
          </div>
        </form>
      </div>
    );
  }
}
