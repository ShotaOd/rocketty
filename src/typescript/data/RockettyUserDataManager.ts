import RockettyRestClient from "../api/RockettyRestClient";
import {AsyncStorage} from "react-native";
import {ClientInfo} from "../common/Types";

type UserInfo = {
  clientInfo: ClientInfo,
  highScore: number,
  displayName?: string,
}

let initializeSuccess = false;
const USER_INFO_STORAGE_KEY = 'rocketty.user.info';
const getUserInfoFromStorage = (): Promise<UserInfo | null> => AsyncStorage
  .getItem(USER_INFO_STORAGE_KEY)
  .then(item => {
    if (item) return JSON.parse(item);
    return null;
  });
const clearUserInfoFromStorage = () => AsyncStorage.removeItem(USER_INFO_STORAGE_KEY);
const saveUserInfoToStorage = (userInfo: UserInfo) => AsyncStorage
  .setItem(USER_INFO_STORAGE_KEY, JSON.stringify(userInfo));

const registerApp = async () => {
  const clientInfo: ClientInfo = await RockettyRestClient.registerApp();
  return Object.assign({}, {clientInfo}, {highScore: 0, userRegistered: false});
};

const initialize = async () => {
  // get information from local storage
  let localUserInfo = await getUserInfoFromStorage();
  if (!localUserInfo) {
    localUserInfo = await registerApp()
  }
  // authentication app
  try {
    await RockettyRestClient.authApp(localUserInfo.clientInfo);
  } catch (e) {
    await clearUserInfoFromStorage();
    localUserInfo = await registerApp();
  }

  const remoteUserInfo = await RockettyRestClient.fetchUserInfo();
  // update info by remote info
  const latestUserInfo: UserInfo = {
    clientInfo: localUserInfo.clientInfo,
    highScore: remoteUserInfo.highScore || 0,
    displayName: remoteUserInfo.displayName,
  };
  await saveUserInfoToStorage(latestUserInfo);

  initializeSuccess = true;
};

const saveScore = async (score: number) => {
  if (!initializeSuccess) throw new Error('not initialized');
  const localUserInfo = await getUserInfoFromStorage();
  if (!localUserInfo) throw new Error('not initialized');

  const {highScore} = localUserInfo;
  if (score <= highScore) return;

  await saveUserInfoToStorage(Object.assign({}, localUserInfo, {highScore: score}));
  await RockettyRestClient.saveScore(score);
};

const saveDisplayName = async (displayName: string) => {
  const userInfo = await getUserInfoFromStorage();
  await saveUserInfoToStorage(Object.assign({}, userInfo, {displayName}));
  await RockettyRestClient.saveUsername(displayName);
};

const fetchDisplayName = async () => {
  const localUserInfo = await getUserInfoFromStorage();
  if (!localUserInfo) throw new Error('not initialized');
  return localUserInfo.displayName;
};

export default {
  initialize,
  saveScore,
  saveDisplayName,
  fetchDisplayName,
};
