import { httpClient } from "./httpClient";

const url = `${import.meta.env.VITE_UNIDIR_AUTH_SERVER}`;

const getMFAImage = async (token) => {
  return await httpClient.get(`${url}/mfaImage`, {
    params: { token },
  });
};

const getMfaLink = async (domain, email, userId) => {
  return await httpClient.get(`${url}/mfaLink`, {
    params: { domain, email, userId },
  });
};
const getMfaLinkValue = async (token) => {
  return await httpClient.post(`${url}/mfaLinkValue`, { token });
};

const verifyTotp = async (user, totp) => {
  return await httpClient.post(`${url}/verifyTotp`, { user, totp });
};

const mfaApi = {
  getMFAImage,
  getMfaLink,
  verifyTotp,
  getMfaLinkValue,
};
export default mfaApi;
