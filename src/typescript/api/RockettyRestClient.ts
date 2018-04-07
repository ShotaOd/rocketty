import {encrypt} from "./support/encrypt";
import {appSecret, server} from "../Property";
import {RankResp, UserInfoResp} from "./ResponseType";
import {ClientInfo} from "../common/Types";

const BASE_HEADER = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};


// ===================================================================================
//                                                                          Helpers
//                                                                          ==========
const getURLParam = (param: any) =>
  '?' + Object.keys(param)
    .map(key => `${key}=${param[key]}`)
    .join('&');

// ===================================================================================
//                                                                          Exports
//                                                                          ==========
const registerApp = () => {
  let clientInfo: ClientInfo;
  return fetch(server.API_ROOT + '/auth/register', {
    method: 'POST',
    headers: BASE_HEADER,
    body: JSON.stringify({
      appSecret: appSecret,
    }),
  })
    .then(resp => resp.json())
    .then(json => {
      const {clientId, clientSecret} = json;
      clientInfo = {clientId, clientSecret};
      return confirmApp(json.clientId, json.clientSecret)
    })
    .then(() => clientInfo);
};

const confirmApp = (clientId: string, clientSecret: string) => {
  return fetch(server.API_ROOT + '/auth/confirm', {
    method: 'POST',
    headers: BASE_HEADER,
    body: JSON.stringify({
      clientId,
      clientSecret,
    }),
  });
};

let sessionKey: string;
const authApp = (clientInfo: ClientInfo) => {
  return fetch(server.API_ROOT + '/auth', {
    method: 'POST',
    headers: BASE_HEADER,
    body: JSON.stringify(clientInfo),
  })
    .then(resp => {
      if (resp.status === 401) {
        throw new Error(resp.statusText);
      }
      return  resp;
    })
    .then(resp => resp.headers.get('X-ROCKETTY-SESSION'))
    .then(key => {
      if (key) sessionKey = key;
      return key;
    })
};

const getSessionHeader = () => Object.assign({}, BASE_HEADER, {
  'X-ROCKETTY-SESSION': sessionKey
});

const saveUsername = (displayName: string) => {
  return fetch(server.API_ROOT + '/users', {
    method: 'PUT',
    headers: getSessionHeader(),
    body: JSON.stringify({
      displayName,
    }),
  });
};

const saveScore = (value: number) => {
  return fetch(server.API_ROOT + '/ranks', {
    method: 'PUT',
    headers: getSessionHeader(),
    body: JSON.stringify({
      score: encrypt(JSON.stringify({
        value,
        isoDateTime: new Date().toISOString(),
      })),
    }),
  });
};

const fetchScore = (p: number, s: number): Promise<RankResp> => {
  return fetch(server.API_ROOT + '/ranks' + getURLParam({p, s}), {
    method: 'GET',
    headers: getSessionHeader(),
  })
    .then(resp => resp.json())
    ;
};


const fetchUserInfo = (): Promise<UserInfoResp> => {
  return fetch(server.API_ROOT + '/users/me', {
    method: 'GET',
    headers: getSessionHeader(),
  })
    .then(resp => resp.json())
    ;
};

export default {
  registerApp,
  authApp,
  saveUsername,
  saveScore,
  fetchScore,
  fetchUserInfo,
};