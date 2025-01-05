import Score from "../components/score";
import Dice from "../components/dice";
import Token from "../components/token";
import Timer from "../components/timer";
import Roulette from "../components/roulette";
import Turn from "../components/turn";
import Winner from "../components/winner";
import Info from "../components/info";

// カードコンポーネントとカード名の対応表
export const cardMap: {
  [key: string]: React.ComponentType<{ zoomRatio: number }>;
} = {
  score: Score,
  dice: Dice,
  token: Token,
  timer: Timer,
  roulette: Roulette,
  turn: Turn,
  winner: Winner,
  info: Info,

  // setter と styleSetting は特殊なコンポーネントなので、ここでは設定しない
  // setter: Setter,
  // styleSetting: StyleSetting,
};

// 初期カード
export const initialCards = [
  { component: "winner", x: 0, y: 0 },
  { component: "turn", x: 1, y: 0 },
  { component: "dice", x: 2, y: 0 },
  { component: "token", x: 0, y: 1 },
  { component: "roulette", x: 1, y: 1 },
  { component: "timer", x: 2, y: 1 },
  { component: "score", x: 0, y: 2 },
  { component: "styleSetting", x: 1, y: 2 },
  { component: "info", x: 2, y: 2 },
];

// 初期カード（SPモード、x=0 のみ）
export const initialCardsSP = [
  { component: "winner", x: 0, y: 0 },
  { component: "turn", x: 0, y: 1 },
  { component: "dice", x: 0, y: 2 },
  { component: "token", x: 0, y: 3 },
  { component: "roulette", x: 0, y: 4 },
  { component: "timer", x: 0, y: 5 },
  { component: "score", x: 0, y: 6 },
  { component: "styleSetting", x: 0, y: 7 },
  { component: "info", x: 0, y: 8 },
];
