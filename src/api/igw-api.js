import url from "url";
import forEach from "lodash/forEach";
import { httpClient } from "./httpClient";

export const igwApi = {
  loginWithiGoodWorks,
  logoutWithGoodWorks,
};

export const client = {
  client_id: import.meta.env.VITE_UNIDIR_CLIENT_ID,
  client_secret: import.meta.env.VITE_UNIDIR_CLIENT_SECRET,
  redirect_uris: [import.meta.env.VITE_UNIDIR_REDIRECT_URI],
  scope: import.meta.env.VITE_UNIDIR_SCOPE,
  state: Math.random().toString(36).substring(2, 36),
};

export const authServer = {
  authorizationEndpoint: import.meta.env.VITE_UNIDIR_AUTHORIZATIONENDPOINT,
  tokenEndpoint: import.meta.env.VITE_UNIDIR_TOKENENDPOINT,
  authLogin: import.meta.env.VITE_UNIDIR_AUTHLOGIN,
  signup: import.meta.env.VITE_UNIDIR_SIGNUP,
};

export const uniDirServer = {
  Endpoint: import.meta.env.VITE_UNIDIR_API_ENDPOINT,
  callback: import.meta.env.VITE_UNIDIR_CALLBACK_POINT,
  session: import.meta.env.VITE_UNIDIR_GET_SESSION,
};

export const uniOAuthServer = {
  Endpoint: import.meta.env.VITE_UNIDIR_AUTH_API_ENDPOINT,
};

function loginWithiGoodWorks() {
  let state = null;
  const data = {
    response_type: "code",
    scope: client.scope,
    client_id: client.client_id,
    redirect_uri: client.redirect_uris[0],
    state: state,
  };

  const authorizeUrl = buildUrl(authServer.authorizationEndpoint, data);

  window.location.href = authorizeUrl;
  return null;
}

async function logoutWithGoodWorks() {
  // const inspect = await httpClient.post(
  //   import.meta.env.VITE_UNIDIR_INTROSPECT,
  //   { token: access_token },
  //   {
  //     withCredentials: true,
  //   }
  // );
  // console.log("inspect", inspect);

  return await httpClient.get(import.meta.env.VITE_UNIDIR_LOGOUT, {
    withCredentials: true,
    params: { redirect_url: import.meta.env.VITE_UNIDIR_LOGOUT_REDIRECT },
  });
}

const buildUrl = function (base, options, hash) {
  var newUrl = url.parse(base, true);
  delete newUrl.search;
  if (!newUrl.query) {
    newUrl.query = {};
  }
  forEach(options, function (value, key) {
    newUrl.query[key] = value;
  });
  if (hash) {
    newUrl.hash = hash;
  }

  return url.format(newUrl);
};
