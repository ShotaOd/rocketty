import {string} from "prop-types";

export type Rank = {
  score: number,
  displayName: string,
}
export type Page = {
  next: boolean,
  prev: boolean,
}
export type RankResp = {
  ranks: Rank[],
  page: Page,
};

export type UserInfoResp = {
  highScore?: number,
  displayName:string,
};
