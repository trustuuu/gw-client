import axios from "axios";

const httpClient = axios.create();

const setHttpClient = (header) => {
  httpClient.defaults.headers = header;
};

// httpClient.interceptors.request.use((config) => {
// const token = localStorage.getItem('authToken'); // or sessionStorage, or Recoil, etc.
// if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
// }
// return config;
// });

// httpClient.interceptors.response.use(
//     response => response,
//     async error => {
//       if (error.response?.status === 401) {
//         // try to refresh token logic here
//       }
//       return Promise.reject(error);
//     }
// );

export { httpClient, setHttpClient };
