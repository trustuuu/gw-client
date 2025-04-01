import url from "url";
import forEach from "lodash/forEach";

export const igwApi = {
  loginWithiGoodWorks,
};
//export default igwApi;

export const client = {
  client_id: process.env.REACT_APP_UNIDIR_CLIENT_ID,
  client_secret: process.env.REACT_APP_UNIDIR_CLIENT_SECRET,
  //redirect_uris: ["http://unidir.igoodworks.com/callback"],
  redirect_uris: ["http://localhost:3000/callback"],
  scope: "username email email_verified openId user:admin",
  state: Math.random().toString(36).substring(2, 36),
};

export const authServer = {
  authorizationEndpoint:
    "https://gw-oauth-server-hcf3ceajdpg2gcbg.canadacentral-01.azurewebsites.net/oauth/authorize",
  //"http://localhost/oauth/authorize",
  tokenEndpoint:
    "https://gw-oauth-server-hcf3ceajdpg2gcbg.canadacentral-01.azurewebsites.net/oauth/token",
  //"http://localhost/oauth/token",
  userInfoEndpoint: "http://localhost:9002/userinfo",
  authLogin:
    "https://gw-oauth-server-hcf3ceajdpg2gcbg.canadacentral-01.azurewebsites.net/oauth/login",
  //"http://localhost/oauth/login",
};

export const uniDirServer = {
  Endpoint:
    "https://gw-oauth-server-hcf3ceajdpg2gcbg.canadacentral-01.azurewebsites.net/api",
  //"http://localhost/api",
};

export const uniOAuthServer = {
  Endpoint:
    "https://gw-oauth-server-hcf3ceajdpg2gcbg.canadacentral-01.azurewebsites.net/oauthapi",
  //"http://localhost/oauthapi",
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
