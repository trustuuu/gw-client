import { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { encodeClientCredentials } from "../utils/Utils";
import axios from "axios";
import { useAuth } from "../component/AuthContext";
import { client, authServer } from "../api/igw-api";
import { uniDirServer } from "../api/igw-api";
import ButtonToolbox from "../component/ButtonToolbox";
import AuthFormHeader from "../component/AuthFormHeader";
import { httpClient, setHttpClient } from "../api/httpClient";
import { useCookies } from "react-cookie";

export default function AuthCallback(props) {
  const location = useLocation();
  const history = useHistory();
  const [title, setTitle] = useState("Logging.....");
  const {
    user,
    saveUser,
    saveClient,
    saveCompany,
    saveDomain,
    saveRootCompany,
    saveAccessToken,
  } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const [cookies, setCookie] = useCookies(["igw-udir"]);

  const form_data = {
    grant_type: "authorization_code",
    code: code,
    redirect_uri: client.redirect_uris[0],
  };

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization:
      "Basic " +
      encodeClientCredentials(client.client_id, client.client_secret),
  };

  useEffect(() => {
    (async function () {
      try {
        if (cookies.tokenJson) {
          await fetchDashboard(cookies.tokenJson);
          history.push("/dashboard");
        } else if (code && !user) {
          const axiosAuth = axios.create();
          const tokenJson = await axiosAuth.post(
            authServer.tokenEndpoint,
            form_data,
            { headers: headers }
          );

          saveUser(tokenJson.data.user);
          //saveAccessToken(tokenJson.data.access_token);
          saveClient(tokenJson.data.client);

          if (cookies.IsRemember) {
            setCookie("tokenJson", tokenJson, {
              Expires: new Date(Date.now() + 3600 * 1000), // expires in 1 hour
              Secure: true, // cookie will only be sent over HTTPS
              SameSite: "Strict", // prevent cross-site request
              //httpOnly: true
            });
          }
          if (tokenJson.data.access_token) {
            await fetchDashboard(tokenJson);
          }

          history.push("/dashboard");
        }
      } catch (error) {
        history.push("/error");
        console.log("error", error);
      }
    })();
  }, []);

  const fetchDashboard = async (tokenJson) => {
    saveUser(tokenJson.data.user);
    saveAccessToken(tokenJson.data.access_token);
    saveClient(tokenJson.data.client);

    if (tokenJson.data.access_token) {
      const header = {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${tokenJson.data.access_token}`,
      };
      //saveHeader(header);
      setHttpClient(header);
      //const com = await axiosAPI.get(`${uniDirServer.Endpoint}/companys/${tokenJson.data.client.companyId}`, {headers: header});
      const com = await httpClient.get(
        `${uniDirServer.Endpoint}/companys/${tokenJson.data.client.companyId}`
      );
      saveCompany(com.data);
      saveRootCompany(com.data);
      //const dom = await axiosAPI.get(`${uniDirServer.Endpoint}/companys/${tokenJson.data.client.companyId}/domainNames/${tokenJson.data.client.domain}`, {headers: header});
      const dom = await httpClient.get(
        `${uniDirServer.Endpoint}/companys/${tokenJson.data.client.companyId}/domainNames/${tokenJson.data.client.domain}`
      );
      saveDomain(dom.data);
      setTitle("Logged In.");
    }
  };
  const onClicLogin = function (e) {
    history.push("/login");
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
