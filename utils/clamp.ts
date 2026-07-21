/**
 * 数値を指定範囲内に収めるユーティリティ
 *
 * Score / Token / Timer / Winner などで同じ上限・下限チェックが
 * 重複していたため、共通関数として切り出しています。
 */

/**
 * value を [min, max] の範囲にクランプする
 * @param value - 対象の値
 * @param min - 下限値
 * @param max - 最大値
 * @returns 範囲内に収めた値
 */
export function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}
