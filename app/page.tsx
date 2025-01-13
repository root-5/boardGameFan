"use client";

import { useState, useEffect, useRef } from "react";
import {
  cardMap,
  initialCardsSetting,
  // initialCardsSettingSP,
  initialStyle,
  initialPlayers,
} from "../utils/cardDefinitions";
import { getLocalStorage, setLocalStorage } from "../utils/localStorageUtils";
import { useDragDrop } from "../utils/dragDropUtils";
import DragIcon from "../components/cardModule/DragIcon";
import CloseButton from "../components/cardModule/CloseButton";
import Setter from "../components/setter";
import StyleSetting from "../components/styleSetting";
import PlayerSetting from "../components/playerSetting";

export default function App() {
  // ======================================================================
  // 定数定義
  // ======================================================================
  // 内部的に保持するカードリストの最大サイズ
  const maxCardListCols = 20;
  const maxCardListRows = 20;

  // initialCardsSetting の空きを setter カードで埋める
  for (let y = 0; y < maxCardListRows; y++) {
    for (let x = 0; x < maxCardListCols; x++) {
      const existingComponent = initialCardsSetting.find(
        (comp) => comp.x === x && comp.y === y
      );
      if (!existingComponent) {
        initialCardsSetting.push({ component: "setter", x, y });
      }
    }
  }

  // ======================================================================
  // ステート定義
  // ======================================================================
  const [isCookieLoaded, setIsCookieLoaded] = useState(false); // クッキー読み込み完了フラグ
  const [cardList, setCardList] = useState(initialCardsSetting); // カードリスト
  const [cardStyle, setCardStyle] = useState(initialStyle); // スタイル設定
  const [zoomRatio, setZoomRatio] = useState(1); // ズーム倍率
  const [viewRange, setViewRange] = useState({
    x: maxCardListCols,
    y: maxCardListRows,
  }); // 表示範囲
  const [players, setPlayers] = useState(initialPlayers); // プレイヤーデータ

  // ドラッグ＆ドロップ関連
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(
    null
  );

  // ======================================================================
  // リファレンス定義
  // ======================================================================
  const cardListRef = useRef(cardList);
  useEffect(() => {
    cardListRef.current = cardList;
  }, [cardList]);

  // ======================================================================
  // ドラッグ＆ドロップ処理
  // ======================================================================
  const { handleDragStart, handleDragOver, handleDrop } = useDragDrop(
    setDragIndex,
    setDragOffset,
    dragIndex,
    dragOffset,
    cardList,
    setCardList
  );

  // ======================================================================
  // グリッド関連処理
  // ======================================================================
  // window 幅をもとに、カードの列数とズーム倍率を計算する関数
  const calcColsAndZoomRatio = () => {
    const cardSize = 224; // 基本のカードの幅（w-56 h-56 の px 値）
    let zoomRatio = 1;
    let cols = 1;
    // 幅が 500px 以下は列数を１にしてカード幅を画面幅に合わせる
    if (window.outerWidth <= 500) {
      zoomRatio = window.outerWidth / cardSize;
    } else {
      cols = Math.floor(window.innerWidth / cardSize);
      zoomRatio = Math.min(window.innerWidth / (cols * cardSize));
    }
    return { cols, zoomRatio };
  };
  // ロード時と window 幅が変わったときに呼び出される関数
  // window 幅、カードリストをもとにカードの行数、列数、ズーム倍率を計算し、カードリストを更新する
  const updateGrid = () => {
    // 内部的に保持するカードリストの最大サイズ
    const { cols, zoomRatio } = calcColsAndZoomRatio();
    const rows = Math.floor(window.innerHeight / 224);
    const cardListStorage = getLocalStorage("cardList");
    const cardStyleStorage = getLocalStorage("cardStyle");
    setCardList(
      cardListStorage ? JSON.parse(cardListStorage) : initialCardsSetting
    );
    setCardStyle(
      cardStyleStorage ? JSON.parse(cardStyleStorage) : initialStyle
    );
    setZoomRatio(zoomRatio);
    setViewRange({ x: cols, y: rows });
  };

  // ======================================================================
  // useEffect
  // ======================================================================
  // グリッドの更新 useEffect
  useEffect(() => {
    updateGrid();
    const handleResize = () => updateGrid();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isCookieLoaded]); // 初回のみ実行でいいので、isCookieLoaded を監視対象にする

  // ローカルストレージからステートを読み込む useEffect
  useEffect(() => {
    if (isCookieLoaded) return;
    const cardListStorage = getLocalStorage("cardList");
    const cardStyleStorage = getLocalStorage("cardStyle");
    setCardList(
      cardListStorage ? JSON.parse(cardListStorage) : initialCardsSetting
    );
    setCardStyle(
      cardStyleStorage ? JSON.parse(cardStyleStorage) : initialStyle
    );
    setIsCookieLoaded(true);
  }, [isCookieLoaded]);

  // 各ステート変更をローカルストレージに保存する useEffect
  useEffect(() => {
    if (cardList === initialCardsSetting) return;
    setLocalStorage("cardList", JSON.stringify(cardList));
  }, [cardList]);
  useEffect(() => {
    if (cardStyle === initialStyle) return;
    setLocalStorage("cardStyle", JSON.stringify(cardStyle));
  }, [cardStyle]);

  // ======================================================================
  // レンダリング
  // ======================================================================
  return (
    <>
      <div
        className={"relative w-full h-full"}
        id="card-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          fontFamily: `${cardStyle.fontStyle}`,
          zoom: zoomRatio,
        }}
      >
        {cardList.map((item, index) => {
          // 表示範囲外のカードはレンダリングしない
          if (item.x >= viewRange.x || item.y >= viewRange.y) return null;

          // 背景色、フォント色を設定
          const isEven = (item.x + item.y) % 2 === 0;
          const itemBgColor = isEven
            ? cardStyle.bgColor_1
            : cardStyle.bgColor_2;
          const itemFontColor = isEven
            ? cardStyle.fontColor_1
            : cardStyle.fontColor_2;
          const Component = cardMap[item.component];

          return (
            <div key={`${item.x}-${item.y}`}>
              {item.component === "setter" ? (
                // Setter カードのみ特殊呼び出し
                <Setter
                  item={item}
                  cardMap={cardMap}
                  cardList={cardList}
                  setCardList={setCardList}
                  itemBgColor={itemBgColor}
                  fontColor={itemFontColor}
                />
              ) : (
                <div
                  className={"absolute w-56 h-56 text-center"}
                  style={{
                    backgroundColor: itemBgColor,
                    color: itemFontColor,
                    left: item.x * 224, // 224 は カードの幅
                    top: item.y * 224, // 224 は カードの幅
                  }}
                >
                  {/* ドラッグアイコン */}
                  <DragIcon
                    index={index}
                    handleDragStart={handleDragStart}
                    itemFontColor={itemFontColor}
                  />

                  {/* 閉じるボタン */}
                  <CloseButton
                    index={index}
                    cardList={cardList}
                    setCardList={setCardList}
                    isHidden={
                      item.component === "styleSetting"
                        ? true
                        : item.component === "playerSetting"
                        ? true
                        : false
                    }
                  />

                  {/* カードの中身 */}
                  {item.component === "styleSetting" ? (
                    <StyleSetting
                      cardStyle={cardStyle}
                      setCardStyle={setCardStyle}
                    />
                  ) : item.component === "playerSetting" ? (
                    <PlayerSetting players={players} setPlayers={setPlayers} />
                  ) : (
                    <Component zoomRatio={zoomRatio} players={players} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
