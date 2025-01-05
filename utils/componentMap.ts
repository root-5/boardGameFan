import Score from "../components/score";
import Dice from "../components/dice";
import Token from "../components/token";
import Timer from "../components/timer";
import Roulette from "../components/roulette";
import Turn from "../components/turn";
import Winner from "../components/winner";
import Info from "../components/info";

export const componentMap: {
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
