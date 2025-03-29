/**
 * カード全体にかかわる定数をまとめる
 * カード個別の定数は、各カードのコンポーネント内に記述する
 */

import Score from "../components/card/Score";
import Dice from "../components/card/Dice";
import OneOnOne from "../components/card/OneOnOne";
import Coin from "../components/card/Coin";
import Token from "../components/card/Token";
import Timer from "../components/card/Timer";
import Roulette from "../components/card/Roulette";
import Turn from "../components/card/Turn";
import Winner from "../components/card/Winner";
import Info from "../components/card/Info";
import StyleSetting from "../components/card/StyleSetting";
import PlayerSetting from "../components/card/PlayerSetting";
import { CardComponent } from "./types";

// カードコンポーネントとカード名の対応表
export const cardMap: {
  [key: string]: CardComponent;
} = {
  score: Score,
  dice: Dice,
  coin: Coin,
  token: Token,
  timer: Timer,
  roulette: Roulette,
  turn: Turn,
  winner: Winner,
  oneOnOne: OneOnOne,
  playerSetting: PlayerSetting,
  styleSetting: StyleSetting,
  info: Info,

  // setter は特殊なコンポーネントなので、ここでは設定しない
  // setter: Setter,
};

// カードリストの最大サイズ
export const maxRange = { rows: 20, cols: 20 };

// 初期カード
// PC の場合は x,y で画面を構成、SP の場合は配列の順番で画面を構成
export const initialCardsList = [
  { component: "dice", x: 0, y: 1 },
  { component: "coin", x: 2, y: 0 },
  { component: "roulette", x: 2, y: 1 },
  { component: "oneOnOne", x: 2, y: 2 },
  { component: "timer", x: 0, y: 2 },
  { component: "token", x: 1, y: 1 },
  { component: "score", x: 1, y: 2 },
  { component: "turn", x: 1, y: 0 },
  { component: "winner", x: 0, y: 0 },
  { component: "playerSetting", x: 0, y: 3 },
  { component: "styleSetting", x: 1, y: 3 },
  { component: "info", x: 2, y: 3 },
];

// 初期スタイル
export const initialStyle = {
  bgColor_1: "#432E54",
  bgColor_2: "#4B4376",
  fontColor_1: "#f0f6fc",
  fontColor_2: "#f0f6fc",
  fontStyle: 1,
};

// 初期プレイヤー
export const initialPlayers = [
  { name: "Player 1", color: "#aa11ff" },
  { name: "Player 2", color: "#5b97f9" },
  { name: "Player 3", color: "#11ff11" },
  { name: "Player 4", color: "#ffaa11" },
  { name: "Player 5", color: "#a91111" },
];
