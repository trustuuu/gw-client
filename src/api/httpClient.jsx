import axios from "axios";
import { authServer, uniDirServer } from "../api/igw-api";
import { navigate } from "../component/navigate";
import { getDeviceId, getUTC } from "../utils/Utils";

const httpClient = axios.create();
let serverSessionData = null;

const setHttpClient = (headers) => {
  httpClient.defaults.headers = headers;
};
// ✅ 초기 로그인 후 토큰 설정 예시
const setAccessToken = (token) => {
  //httpClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const deviceId = getDeviceId();
  const deviceHeader = `x-${import.meta.env.VITE_DEVICE_ID}`;
  const headers = {
    //"Access-Control-Allow-Origin": "*",
    [deviceHeader]: deviceId,
    Authorization: `Bearer ${token}`,
  };
  httpClient.defaults.headers = headers;
};

async function gethAccessToken() {
  try {
    const data = { companyId: "company", domainId: "domain", userId: "user" };
    const res = await httpClient.post(uniDirServer.session, data, {
      withCredentials: true, // ✅ 쿠키 자동 포함!
      //credentials: "include",
    });
    //res.status(404).json({ error: "Not Found" });
    serverSessionData = res.data;

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
      navigate("/login");
    }
    console.error("🔴 Refresh token failed:", err);
    throw err;
  }
}
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

  const tokenJson = await axiosAuth.post(authServer.tokenEndpoint, body, {
    withCredentials: true,
    headers: headers,
  });

  return tokenJson.data.access_token;
}

httpClient.interceptors.response.use(
  (response) => response, // 성공 응답 그대로 반환
  async (error) => {
    const originalRequest = error.config;

    // 401 + 아직 retry 안 했으면
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        let newAccessToken = await gethAccessToken();
        if (!newAccessToken) {
          //await getRefreshToken();
          newAccessToken = await getRefreshToken();
        }

        if (httpClient.defaults.headers.common) {
          httpClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
        } else {
          setAccessToken(newAccessToken);
        }
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };
        return httpClient(originalRequest); // 원래 요청 다시 시도
      } catch (refreshErr) {
        if (refreshErr.response.status == 404) {
          sessionStorage.clear();
          navigate("/login");
        }
        return Promise.reject(refreshErr); // 실패 시 전파
      }
    }

    return Promise.reject(error);
  }
);

export { httpClient, setHttpClient, setAccessToken };
