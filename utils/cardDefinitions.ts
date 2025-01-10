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
  { componentName: "winner", x: 0, y: 0 },
  { componentName: "turn", x: 1, y: 0 },
  { componentName: "dice", x: 2, y: 0 },
  { componentName: "token", x: 0, y: 1 },
  { componentName: "roulette", x: 1, y: 1 },
  { componentName: "timer", x: 2, y: 1 },
  { componentName: "score", x: 0, y: 2 },
  { componentName: "styleSetting", x: 1, y: 2 },
  { componentName: "info", x: 2, y: 2 },
  { componentName: "playerSetting", x: 0, y: 3 },
];

// 初期カード（SPモード、x=0 のみ）
export const initialCardsSettingSP = [
  { componentName: "winner", x: 0, y: 0 },
  { componentName: "turn", x: 0, y: 1 },
  { componentName: "dice", x: 0, y: 2 },
  { componentName: "token", x: 0, y: 3 },
  { componentName: "roulette", x: 0, y: 4 },
  { componentName: "timer", x: 0, y: 5 },
  { componentName: "score", x: 0, y: 6 },
  { componentName: "styleSetting", x: 0, y: 7 },
  { componentName: "info", x: 0, y: 8 },
  { componentName: "playerSetting", x: 0, y: 9 },
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
