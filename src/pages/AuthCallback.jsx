import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { encodeClientCredentials, getDeviceId } from "../utils/Utils";
import axios from "axios";
import { useAuth } from "../component/AuthContext";
import { client, authServer, uniDirServer } from "../api/igw-api";
import ButtonToolbox from "../component/ButtonToolbox";
import AuthFormHeader from "../component/AuthFormHeader";
import { httpClient, setHttpClient } from "../api/httpClient";
import { useCookies } from "react-cookie";
import { jwtVerify, createRemoteJWKSet } from "jose";

export default function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const [title, setTitle] = useState("Logging.....");
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
  const [cookies, _] = useCookies(["igw-udir"]);
  const form_data = {
    grant_type: "authorization_code",
    code: code,
    redirect_uri: client.redirect_uris[0],
    code_verifier: codeVerifier,
  };

  saveCodeVerifier(null);
  const deviceId = getDeviceId();
  const deviceHeader = `x-${import.meta.env.VITE_DEVICE_ID}`;
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    [deviceHeader]: deviceId,
    Authorization:
      "Basic " +
      encodeClientCredentials(client.client_id, client.client_secret),
  };

  useEffect(() => {
    (async function () {
      try {
        if (code) {
          const axiosAuth = axios.create();
          const tokenJson = await axiosAuth.post(
            authServer.tokenEndpoint,
            form_data,
            { withCredentials: true, headers: headers }
          );

          if (tokenJson.data.access_token) {
            await fetchDashboard(tokenJson, cookies.IsRemember);
          }

          navigate("/dashboard");
        }
      } catch (error) {
        console.log("error", error);
        navigate("/error");
      }
    })();
  }, []);

  const fetchDashboard = async (tokenJson) => {
    const JWKS = createRemoteJWKSet(new URL(import.meta.env.VITE_UNIDIR_JWKS));

    const { payload: id_token } = await jwtVerify(
      tokenJson.data.id_token,
      JWKS,
      {
        issuer: import.meta.env.VITE_UNIDIR_ISSUER,
        audience: import.meta.env.VITE_UNIDIR_CLIENT_ID,
      }
    );

    // 디코딩 (단, 검증 없이 decode만 할 경우 주의 필요)
    const clientSession = {
      companyId: id_token.companyId,
      domainId: id_token.domainId,
    };
    saveClient(clientSession);
    if (tokenJson.data.access_token) {
      const deviceId = getDeviceId();
      const deviceHeader = `x-${import.meta.env.VITE_DEVICE_ID}`;

      const headers = {
        [deviceHeader]: deviceId,
        Authorization: `Bearer ${tokenJson.data.access_token}`,
      };
      setHttpClient(headers);
      const com = await httpClient.get(
        `${uniDirServer.Endpoint}/companys/${id_token.companyId}`
      );
      const companySession = {
        id: com.data.id,
        name: com.data.name,
        displayName: com.data.displayName,
        parent: com.data.parent,
        type: com.data.type ? com.data.type : "customer",
      };
      saveCompany(companySession);

      const dom = await httpClient.get(
        `${uniDirServer.Endpoint}/companys/${id_token.companyId}/domainNames/${id_token.domainId}`
      );
      const domainSession = {
        id: dom.data.id,
        name: dom.data.name,
        description: dom.data.description,
      };
      saveDomain(domainSession);

      const userSession = {
        id: id_token.id,
        email: id_token.email,
        companyId: id_token.companyId,
        domainId: id_token.domainId,
        root: id_token.root,
        type: com.data.type ? com.data.type : "customer",
      };
      saveUser(userSession);

      setTitle("Logged In.");

      const token_data = {
        companyId: com.data.id,
        domainId: dom.data.id,
        email: id_token.email,
        accessToken: tokenJson.data.access_token,
        refreshToken: tokenJson.data.refresh_token,
        idToken: tokenJson.data.id_token,
        userId: id_token.id,
      };

      await httpClient.post(uniDirServer.callback, token_data, {
        withCredentials: true,
        headers: headers,
      });
    }
  };
  const onClicLogin = function () {
    navigate("/login");
  };
  const loginButtonClass =
    " bg-gray-300 disabled:hover:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 enabled:transition enabled:transform enabled:hover:translate-x-1 enabled:hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center";

  return (
    <div>
      <AuthFormHeader
        heading={title}
        paragraph="Don't have an account yet? "
        linkName="Signup"
        linkUrl="/signup"
      />
      <form className="mt-8 space-y-6">
        <div className="-space-y-px">
          {error ? (
            <div className="col-md-12 text-center ">
              <div className="col-md-12 text-center ">
                <p>Message: {error}</p>
              </div>
              <div className="py-10 col-md-12 text-center inline-flex items-center">
                <ButtonToolbox
                  text="LogIn"
                  clickHandle={onClicLogin}
                  customClass={loginButtonClass}
                />
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </form>
    </div>
  );
}
