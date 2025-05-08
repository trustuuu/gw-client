import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { igwApi } from "../api/igw-api";
import { setHttpClient } from "../api/httpClient";

// Create context
const AuthContext = createContext();

// Custom Hook for sessionStorage-persisted state
const usePersistedState = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    const stored = sessionStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  });

  const setPersistedState = (value) => {
    setState(value);
    sessionStorage.setItem(key, JSON.stringify(value));
  };

  return [state, setPersistedState];
};

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = usePersistedState("user", null);
  const [company, setCompany] = usePersistedState("company", {
    name: "",
    description: "",
  });
  const [rootCompany, setRootCompany] = usePersistedState("rootCompany", {
    name: "",
    description: "",
  });
  const [domain, setDomain] = usePersistedState("domain", null);
  const [client, setClient] = usePersistedState("client", null);
  const [accessToken, setAccessToken] = usePersistedState("accessToken", null);
  const [header, setHeader] = usePersistedState("header", null);

  const [role, setRole] = useState();
  const [scope, setScope] = useState();
  const [api, setApi] = useState();
  const [codeVerifier, setCodeVerifier] = usePersistedState("session", null);

  // Set HTTP header if present
  useEffect(() => {
    if (header) {
      setHttpClient(header);
    }
  }, [header]);

  // Auth actions
  const loginWithiGoodWorks = () => igwApi.loginWithiGoodWorks();

  const saveAccessToken = (token) => {
    setAccessToken(token);
    const newHeader = {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${token}`,
    };
    setHeader(newHeader);
    sessionStorage.setItem("header", JSON.stringify(newHeader));
  };

  const contextMemoValue = useMemo(
    () => ({
      loginWithiGoodWorks,
      saveUser: setUser,
      saveCompany: setCompany,
      saveRootCompany: setRootCompany,
      saveDomain: setDomain,
      saveClient: setClient,
      saveAccessToken,
      saveHeader: setHeader,
      user,
      company,
      rootCompany,
      domain,
      client,
      accessToken,
      header,
    }),
    [user, company, rootCompany, domain, client, accessToken, header]
  );

  const contextValue = {
    saveCodeVerifier: setCodeVerifier,
    setApi,
    saveRole: setRole,
    saveScope: setScope,
    codeVerifier,
    api,
    role,
    scope,
  };

  return (
    <AuthContext.Provider value={{ ...contextMemoValue, ...contextValue }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider.");
  }
  return context;
};

export { AuthContextProvider, useAuth };
