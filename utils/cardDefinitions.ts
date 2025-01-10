import Score from "../components/score";
import Dice from "../components/dice";
import Token from "../components/token";
import Timer from "../components/timer";
import Roulette from "../components/roulette";
import Turn from "../components/turn";
import Winner from "../components/winner";
import Info from "../components/info";
import PlayerSetting from "../components/playerSetting";
import { CardComponent } from "./types";

// カードコンポーネントとカード名の対応表
export const cardMap: {
  [key: string]: CardComponent;
} = {
  score: Score,
  dice: Dice,
  token: Token,
  timer: Timer,
  roulette: Roulette,
  turn: Turn,
  winner: Winner,
  info: Info,
  playerSetting: PlayerSetting,

  // setter と styleSetting は特殊なコンポーネントなので、ここでは設定しない
  // setter: Setter,
  // styleSetting: StyleSetting,
};

// 初期カード
export const initialCardsSetting = [
  { component: "winner", x: 0, y: 0 },
  { component: "turn", x: 1, y: 0 },
  { component: "dice", x: 2, y: 0 },
  { component: "token", x: 0, y: 1 },
  { component: "roulette", x: 1, y: 1 },
  { component: "timer", x: 2, y: 1 },
  { component: "score", x: 0, y: 2 },
  { component: "styleSetting", x: 1, y: 2 },
  { component: "info", x: 2, y: 2 },
  { component: "playerSetting", x: 0, y: 3 },
];

// 初期カード（SPモード、x=0 のみ）
export const initialCardsSettingSP = [
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
  bgColor_1: "#390ba2",
  bgColor_2: "#5216df",
  fontColor_1: "#eeeeee",
  fontColor_2: "#ffffff",
  fontStyle: "Comic Sans MS",
};

// 初期プレイヤー
export const initialPlayers = [
  { name: "Player 1", color: "#ff0000" },
  { name: "Player 2", color: "#00ff00" },
  { name: "Player 3", color: "#0000ff" },
  { name: "Player 4", color: "#ffff00" },
  { name: "Player 5", color: "#ff00ff" },
  { name: "Player 6", color: "#00ffff" },
];
