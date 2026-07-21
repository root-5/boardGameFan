/**
 * カード全体で共有する型定義
 *
 * カード個別の内部型は、各コンポーネント内に置いてください。
 */

import type { ComponentType } from "react";

/** プレイヤー情報（名前・表示色） */
export type Player = {
  name: string;
  color: string;
};

/** グリッド上のカード配置情報 */
export type CardSetting = {
  /** cardMap のキー、または "setter"（空き枠） */
  component: string;
  x: number;
  y: number;
};

/** カード全体の見た目設定 */
export type CardStyle = {
  bgColor_1: string;
  fontColor_1: string;
  bgColor_2: string;
  fontColor_2: string;
  /** fonts 配列の 1 始まりインデックス */
  fontStyle: number;
};

/**
 * 各カードコンポーネントが受け取る共通 props
 *
 * Grid / GridSP から一括で渡されます。
 * 使わない props があっても受け取り側で省略して問題ありません。
 */
export type CardProps = {
  zoomRatio: number;
  players: Player[];
  setPlayers: (players: Player[]) => void;
  cardStyle: CardStyle;
  setCardStyle: (style: CardStyle) => void;
  setCardList: (list: CardSetting[]) => void;
  /**
   * SP モード向け: 現在表示中のカードのみ true。
   * 非アクティブ時は重い Canvas を破棄し、同時 WebGL コンテキスト数を抑えます。
   */
  isActive?: boolean;
};

/** cardMap に登録するコンポーネント型 */
export type CardComponent = ComponentType<Partial<CardProps> & { zoomRatio?: number }>;
