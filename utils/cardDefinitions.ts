/**
 * カード全体にかかわる定数をまとめる
 * カード個別の定数は、各カードのコンポーネント内に記述する
 */

import Dice from "../components/card/Dice";
// import Coin from "../components/card/Coin";
// import Roulette from "../components/card/Roulette";
// import OneOnOne from "../components/card/OneOnOne";
// import Timer from "../components/card/Timer";
// import Token from "../components/card/Token";
// import Score from "../components/card/Score";
// import Turn from "../components/card/Turn";
// import Winner from "../components/card/Winner";
// import PlayerSetting from "../components/card/PlayerSetting";
// import StyleSetting from "../components/card/StyleSetting";
// import Info from "../components/card/Info";
import { CardComponent } from "./types";
import { Shantell_Sans, Sansita_Swashed, Dancing_Script, Libre_Bodoni, Pixelify_Sans, Red_Hat_Text, Caveat, Stick_No_Bills, Tilt_Prism, Antonio } from 'next/font/google'

// カードコンポーネントとカード名の対応表
export const cardMap: {
  [key: string]: CardComponent;
} = {
  dice: Dice,
  // coin: Coin,
  // roulette: Roulette,
  // oneOnOne: OneOnOne,
  // timer: Timer,
  // token: Token,
  // score: Score,
  // turn: Turn,
  // winner: Winner,
  // playerSetting: PlayerSetting,
  // styleSetting: StyleSetting,
  // info: Info,

  // setter は特殊なコンポーネントなので、ここでは設定しない
  // setter: Setter,
};

// カードリストの最大サイズ
export const maxRange = { rows: 20, cols: 20 };

// 初期カード
// PC の場合は x,y で画面を構成、SP の場合は配列の順番で画面を構成
export const initialCardsList = [
  { component: "dice", x: 0, y: 1 },
  // { component: "coin", x: 2, y: 0 },
  // { component: "roulette", x: 2, y: 1 },
  // { component: "oneOnOne", x: 2, y: 2 },
  // { component: "timer", x: 0, y: 2 },
  // { component: "token", x: 1, y: 1 },
  // { component: "score", x: 1, y: 2 },
  // { component: "turn", x: 1, y: 0 },
  // { component: "winner", x: 0, y: 0 },
  // { component: "playerSetting", x: 0, y: 3 },
  // { component: "styleSetting", x: 1, y: 3 },
  // { component: "info", x: 2, y: 3 },
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

// フォントの設定
const font_1 = Shantell_Sans({ subsets: ['latin'] });
const font_2 = Sansita_Swashed({ subsets: ['latin'] });
const font_3 = Dancing_Script({ subsets: ['latin'] });
const font_4 = Libre_Bodoni({ subsets: ['latin'] });
const font_5 = Pixelify_Sans({ subsets: ['latin'] });
const font_6 = Red_Hat_Text({ subsets: ['latin'] });
const font_7 = Caveat({ subsets: ['latin'] });
const font_8 = Stick_No_Bills({ subsets: ['latin'] });
const font_9 = Tilt_Prism({ subsets: ['latin'] });
const font_10 = Antonio({ subsets: ['latin'] });
export const fonts = [font_1, font_2, font_3, font_4, font_5, font_6, font_7, font_8, font_9, font_10];