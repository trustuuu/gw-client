import axios from "axios";
import { uniDirServer } from "../api/igw-api";
import { navigate } from "../component/navigate";

const httpClient = axios.create();

const setHttpClient = (header) => {
  httpClient.defaults.headers = header;
};
// ✅ 초기 로그인 후 토큰 설정 예시
const setAccessToken = (token) => {
  //httpClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const header = {
    "Access-Control-Allow-Origin": "*",
    Authorization: `Bearer ${token}`,
  };
  httpClient.defaults.headers = header;
};

async function refreshAccessToken() {
  try {
    const data = { companyId: "company", domainId: "domain", userId: "user" };
    const res = await httpClient.post(uniDirServer.session, data, {
      withCredentials: true, // ✅ 쿠키 자동 포함!
      //credentials: "include",
    });
    //res.status(404).json({ error: "Not Found" });
    return res.data.accessToken;
  } catch (err) {
    if (err.response.status == 404) {
      sessionStorage.clear();
      navigate("/login");
    }
    console.error("🔴 Refresh token failed:", err);
    throw err;
  }
}

httpClient.interceptors.response.use(
  (response) => response, // 성공 응답 그대로 반환
  async (error) => {
    const originalRequest = error.config;

    // 401 + 아직 retry 안 했으면
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        if (httpClient.defaults.headers.common) {
          httpClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
        } else {
          setAccessToken(newAccessToken);
        }
        //originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
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
