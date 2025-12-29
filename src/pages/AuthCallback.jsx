import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { jwtVerify, createRemoteJWKSet } from "jose";

import { useAuth } from "../component/AuthContext";
import { encodeClientCredentials, getDeviceId } from "../utils/Utils";
import { client, authServer, uniDirServer } from "../api/igw-api";
import { httpClient, setHttpClient } from "../api/httpClient";

import AuthFormHeader from "../component/AuthFormHeader";
import ButtonToolbox from "../component/ButtonToolbox";

export default function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cookies, _] = useCookies(["igw-udir"]);

  const [title, setTitle] = useState("Logging in...");
  const [errorMessage, setErrorMessage] = useState("");
  const [authReady, setAuthReady] = useState(false);
  const {
    saveUser,
    saveClient,
    saveCompany,
    saveDomain,
    codeVerifier,
    saveCodeVerifier,
  } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  // Clear codeVerifier once when component mounts
  useEffect(() => {
    saveCodeVerifier(null);
  }, []);

  // ------------------------------
  // 🔥 STEP 1 — Fetch access token
  // ------------------------------
  const exchangeCodeForToken = useCallback(async () => {
    if (!code) return null;

    const form_data = {
      grant_type: "authorization_code",
      code,
      redirect_uri: client.redirect_uris[0],
      code_verifier: codeVerifier,
    };

    const deviceId = getDeviceId();
    const deviceHeader = `x-${import.meta.env.VITE_DEVICE_ID}`;

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      [deviceHeader]: deviceId,
      Authorization:
        "Basic " +
        encodeClientCredentials(client.client_id, client.client_secret),
    };

    try {
      const res = await axios.post(authServer.tokenEndpoint, form_data, {
        withCredentials: true,
        headers,
        timeout: 15000, // Set a 15-second timeout
      });

      return res.data;
    } catch (err) {
      console.error("Token exchange failed", err);
      throw new Error("Token exchange failed");
    }
  }, [code, codeVerifier]);

  // ------------------------------
  // 🔥 STEP 2 — Validate ID token
  // ------------------------------
  const validateIdToken = useCallback(async (token) => {
    const JWKS = createRemoteJWKSet(new URL(import.meta.env.VITE_UNIDIR_JWKS));

    try {
      const { payload } = await jwtVerify(token, JWKS, {
        issuer: import.meta.env.VITE_UNIDIR_ISSUER,
        audience: import.meta.env.VITE_UNIDIR_CLIENT_ID,
      });

      return payload;
    } catch (err) {
      console.error("ID Token verify failed", err);
      throw new Error("ID token invalid");
    }
  }, []);

  // ------------------------------
  // 🔥 STEP 3 — Fetch Company + Domain + Save Context
  // ------------------------------
  const hydrateUserSession = useCallback(
    async (id_token, access_token) => {
      setAuthReady(false);
      const deviceId = getDeviceId();
      const deviceHeader = `x-${import.meta.env.VITE_DEVICE_ID}`;

      const headers = {
        [deviceHeader]: deviceId,
        Authorization: `Bearer ${access_token}`,
      };

      setHttpClient(headers);

      // Fetch company
      const com = await httpClient.get(
        `${uniDirServer.Endpoint}/companys/${id_token.companyId}`
      );

      const companySession = {
        id: com.data.id,
        name: com.data.name,
        displayName: com.data.displayName,
        parent: com.data.parent,
        type: com.data.type ?? "customer",
      };
      saveCompany(companySession);

      // Fetch domain
      const dom = await httpClient.get(
        `${uniDirServer.Endpoint}/companys/${id_token.companyId}/domainNames/${id_token.domainId}`
      );

      const domainSession = {
        id: dom.data.id,
        name: dom.data.name,
        description: dom.data.description,
      };
      saveDomain(domainSession);

      // Save client + user
      saveClient({
        companyId: id_token.companyId,
        domainId: id_token.domainId,
      });

      saveUser({
        id: id_token.id,
        email: id_token.email,
        companyId: id_token.companyId,
        domainId: id_token.domainId,
        root: id_token.root,
        type: com.data.type ?? "customer",
      });

      setTitle("Logged in");
      setAuthReady(true);
    },
    [saveClient, saveCompany, saveDomain, saveUser]
  );

  // ------------------------------
  // 🔥 STEP 4 — Invoke callback (server session)
  // ------------------------------
  const callServerCallback = useCallback(async (tokenJson, id_token) => {
    const deviceId = getDeviceId();
    const deviceHeader = `x-${import.meta.env.VITE_DEVICE_ID}`;
    const headers = {
      [deviceHeader]: deviceId,
      Authorization: `Bearer ${tokenJson.access_token}`,
    };

    const token_data = {
      companyId: id_token.companyId,
      domainId: id_token.domainId,
      email: id_token.email,
      accessToken: tokenJson.access_token,
      refreshToken: tokenJson.refresh_token,
      idToken: tokenJson.id_token,
      userId: id_token.id,
    };

    await httpClient.post(uniDirServer.callback, token_data, {
      withCredentials: true,
      headers,
    });
  }, []);

  // ------------------------------
  // 🔥 STEP 5 — Whole Login Flow
  // ------------------------------
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      return;
    }
    if (!code) return;

    (async () => {
      try {
        const tokenJson = await exchangeCodeForToken();
        if (!tokenJson?.access_token) throw new Error("No access token");

        const id_token = await validateIdToken(tokenJson.id_token);
        await hydrateUserSession(id_token, tokenJson.access_token);
        await callServerCallback(tokenJson, id_token);
        // Navigation after everything is fully complete
        //setTimeout(() => navigate("/dashboard"), 50);
      } catch (err) {
        console.error(err);
        setErrorMessage(err.message);
        navigate("/error");
      }
    })();
  }, [code, error]);

  useEffect(() => {
    if (authReady) {
      navigate("/dashboard");
    }
  }, [authReady]);

  // ------------------------------
  // Rendering
  // ------------------------------
  return (
    <div>
      <AuthFormHeader
        heading={title}
        paragraph="Don't have an account yet?"
        linkName="Signup"
        linkUrl="/signup"
      />

      <form className="mt-8 space-y-6">
        {errorMessage ? (
          <div className="text-center text-red-600">
            <p>{errorMessage}</p>
            <div className="py-10">
              <ButtonToolbox
                text="Login"
                clickHandle={() => navigate("/login")}
                customClass="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
              />
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Please wait...</p>
        )}
      </form>
    </div>
  );
}
