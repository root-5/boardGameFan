/**
 * カード全体にかかわる定数をまとめる
 * カード個別の定数は、各カードのコンポーネント内に記述する
 */

import Score from "../components/card/Score";
import Dice from "../components/card/Dice";
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
  info: Info,
  styleSetting: StyleSetting,
  playerSetting: PlayerSetting,

  // setter は特殊なコンポーネントなので、ここでは設定しない
  // setter: Setter,
};

// カードリストの最大サイズ
export const maxRange = { rows: 20, cols: 20 };

// 初期カード
export const initialCardsList = [
  { component: "winner", x: 0, y: 0 },
  { component: "turn", x: 1, y: 0 },
  { component: "coin", x: 2, y: 0 },
  { component: "dice", x: 0, y: 1 },
  { component: "token", x: 1, y: 1 },
  { component: "roulette", x: 2, y: 1 },
  { component: "timer", x: 0, y: 2 },
  { component: "score", x: 1, y: 2 },
  { component: "styleSetting", x: 2, y: 2 },
  { component: "playerSetting", x: 0, y: 3 },
  { component: "info", x: 1, y: 3 },
];

// 初期カード（SPモード、x=0 のみ）
export const initialCardsListSP = [
  { component: "winner", x: 0, y: 0 },
  { component: "turn", x: 0, y: 1 },
  { component: "dice", x: 0, y: 2 },
  { component: "token", x: 0, y: 3 },
  { component: "roulette", x: 0, y: 4 },
  { component: "timer", x: 0, y: 5 },
  { component: "score", x: 0, y: 6 },
  { component: "styleSetting", x: 0, y: 7 },
  { component: "info", x: 0, y: 8 },
  { component: "playerSetting", x: 0, y: 9 },
];

// 初期スタイル
export const initialStyle = {
  bgColor_1: "#432E54",
  bgColor_2: "#4B4376",
  fontColor_1: "#f0f6fc",
  fontColor_2: "#f0f6fc",
  fontStyle: "Comic Sans MS",
};

// 初期プレイヤー
export const initialPlayers = [
  { name: "Player 1", color: "#aa11ff" },
  { name: "Player 2", color: "#5b97f9" },
  { name: "Player 3", color: "#11ff11" },
  { name: "Player 4", color: "#ffaa11" },
  { name: "Player 5", color: "#a91111" },
];
