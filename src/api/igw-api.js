import url from "url";
import forEach from "lodash/forEach";

export const igwApi = {
  loginWithiGoodWorks,
};
//export default igwApi;

export const client = {
  client_id: process.env.REACT_APP_UNIDIR_CLIENT_ID,
  client_secret: process.env.REACT_APP_UNIDIR_CLIENT_SECRET,
  redirect_uris: [process.env.REACT_APP_UNIDIR_REDIRECT_URI],
  scope: process.env.REACT_APP_UNIDIR_SCOPE,
  state: Math.random().toString(36).substring(2, 36),
};

export const authServer = {
  authorizationEndpoint: process.env.REACT_APP_UNIDIR_AUTHORIZATIONENDPOINT,
  tokenEndpoint: process.env.REACT_APP_UNIDIR_TOKENENDPOINT,
  authLogin: process.env.REACT_APP_UNIDIR_AUTHLOGIN,
};

export const uniDirServer = {
  Endpoint: process.env.REACT_APP_UNIDIR_API_ENDPOINT,
};

export const uniOAuthServer = {
  Endpoint: process.env.REACT_APP_UNIDIR_AUTH_API_ENDPOINT,
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

const buildUrl = function (base, options, hash) {
  var newUrl = url.parse(base, true);
  delete newUrl.search;
  if (!newUrl.query) {
    newUrl.query = {};
  }
  forEach(options, function (value, key, list) {
    newUrl.query[key] = value;
  });
  if (hash) {
    newUrl.hash = hash;
  }

  return url.format(newUrl);
};
