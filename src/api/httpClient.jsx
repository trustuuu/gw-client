import axios from "axios";
import { authServer, uniDirServer } from "../api/igw-api";
import { navigate } from "../component/navigate";
import { getDeviceId, getUTC } from "../utils/Utils";
import cryptoManager from "../utils/CryptoManager";
import { generateDpopProof } from "../utils/dpop";

const httpClient = axios.create();
let serverSessionData = null;

const setHttpClient = (headers) => {
  httpClient.defaults.headers = headers;
};

const setAccessToken = async (token) => {
  const deviceId = getDeviceId();
  const deviceHeader = `x-${import.meta.env.VITE_DEVICE_ID}`;
  const headers = {
    [deviceHeader]: deviceId,
    Authorization: `Bearer ${token}`,
  };
  httpClient.defaults.headers = headers;
};

const gethAccessToken = async () => {
  try {
    const data = { companyId: "company", domainId: "domain", userId: "user" };
    const axiosAuth = axios.create();

    // Generate DPoP proof for session endpoint
    const sessionUrl = uniDirServer.session;
    console.log("[DPoP] Generating proof for session endpoint:", sessionUrl);
    const dpopProof = await generateDpopProof(sessionUrl, "POST");
    console.log("[DPoP] Session proof generated successfully");

    const res = await axiosAuth.post(uniDirServer.session, data, {
      withCredentials: true, //Cookie included !
      headers: {
        DPoP: dpopProof,
      },
    });
    serverSessionData = res.data;
    console.log("new session data retrieved");
    const expires_in =
      Math.floor(serverSessionData.accessToken.expires_in) <
      Math.floor(getUTC() / 1000);
    if (!expires_in) {
      return serverSessionData.accessToken;
    } else {
      return null;
    }
  } catch (err) {
    if (err.response.status == 404) {
      sessionStorage.clear();
      localStorage.removeItem("unidir_chat_history");
      localStorage.removeItem("unidir_raw_context");
      cryptoManager.clearKey().catch(console.error);
      navigate("/login");
    }
    console.error("Get access token failed:", err);
    throw err;
  }
};
async function getRefreshToken() {
  const axiosAuth = axios.create();
  const deviceId = getDeviceId();
  const deviceHeader = `x-${import.meta.env.VITE_DEVICE_ID}`;
  const headers = {
    [deviceHeader]: deviceId,
  };
  const body = {
    client_id: import.meta.env.VITE_UNIDIR_CLIENT_ID,
    grant_type: "refresh_token",
    refresh_token: serverSessionData.refreshToken,
  };

  // Generate DPoP proof for token endpoint
  const tokenUrl = authServer.tokenEndpoint;
  console.log("[DPoP] Generating proof for token endpoint:", tokenUrl);
  const dpopProof = await generateDpopProof(tokenUrl, "POST");
  headers.DPoP = dpopProof;
  console.log("[DPoP] Token proof generated successfully");
  const tokenJson = await axiosAuth.post(authServer.tokenEndpoint, body, {
    withCredentials: true,
    headers: headers,
  });

  return tokenJson.data.access_token;
}

// Request interceptor to add DPoP header to all requests
httpClient.interceptors.request.use(
  async (config) => {
    // Generate DPoP proof for this request
    // Construct the full URL for the DPoP proof
    let url;

    // Check if config.url is already an absolute URL
    if (config.url.startsWith("http://") || config.url.startsWith("https://")) {
      url = config.url;
    } else if (config.baseURL) {
      // config.url is relative, combine with baseURL
      url = `${config.baseURL}${config.url}`;
    } else {
      // No baseURL, construct from window.location
      const protocol = window.location.protocol; // Already includes ':'
      const host = window.location.host;
      url = `${protocol}//${host}${config.url}`;
    }

    const method = config.method.toUpperCase();
    console.log("[DPoP] Request interceptor - URL:", url, "Method:", method);
    try {
      // Get access token from headers if present
      const accessToken = config.headers?.Authorization?.replace("Bearer ", "");
      const dpopProof = await generateDpopProof(url, method, accessToken);
      config.headers.DPoP = dpopProof;
      console.log("[DPoP] Proof added to request headers");
    } catch (error) {
      console.error("[DPoP] Error generating proof:", error);
      // Continue without DPoP if generation fails
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

httpClient.interceptors.response.use(
  (response) => response, // Success and return repsonse
  async (error) => {
    const originalRequest = error.config;
    // 401 + if retry never done.
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.log("getting new token...");
        let newAccessToken = await gethAccessToken();
        if (!newAccessToken) {
          console.log("getting refresh token...");
          newAccessToken = await getRefreshToken();
        }

        if (newAccessToken) console.log("successfully got new token!");
        if (httpClient.defaults.headers.common) {
          httpClient.defaults.headers.common["Authorization"] =
            `Bearer ${newAccessToken}`;
        } else {
          setAccessToken(newAccessToken);
        }
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };
        return httpClient(originalRequest); // retry request
      } catch (refreshErr) {
        if (refreshErr.response.status == 404) {
          sessionStorage.clear();
          localStorage.removeItem("unidir_chat_history");
          localStorage.removeItem("unidir_raw_context");
          cryptoManager.clearKey().catch(console.error);
          navigate("/login");
        }
        return Promise.reject(refreshErr); // return fail
      }
    }

    return Promise.reject(error);
  },
);

export { httpClient, setHttpClient, setAccessToken, gethAccessToken };
