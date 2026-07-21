"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * ボタン長押しで同じ操作を繰り返すためのカスタムフック
 *
 * Score / Token / Timer / OneOnOne などで共通していた
 * mousedown → setInterval → mouseup/leave で clear するパターンをまとめています。
 *
 * @param intervalMs - 繰り返し間隔（ミリ秒）。既定は 100ms
 * @returns onHoldStart / onHoldEnd（ボタンの onMouseDown / onMouseUp などに渡す）
 */
export function useHoldRepeat(intervalMs = 100) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // アンマウント時に必ずタイマーを解放する
  useEffect(() => clear, [clear]);

  /**
   * 長押し開始: まず 1 回実行し、以降は interval で繰り返す
   */
  const onHoldStart = useCallback(
    (action: () => void) => {
      clear();
      action();
      intervalRef.current = setInterval(action, intervalMs);
    },
    [clear, intervalMs]
  );

  /** 長押し終了（mouseup / mouseleave など） */
  const onHoldEnd = clear;

  return { onHoldStart, onHoldEnd };
}
