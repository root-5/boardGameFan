/**
 * ローカルストレージの読み書きユーティリティ
 *
 * 設定（カード配置・スタイル・プレイヤー）をブラウザに永続化します。
 * 本アプリは静的ホスト（Cloudflare Pages）前提のため、サーバー側の暗号化は行っていません。
 * 保存内容は端末ローカルの UI 設定のみで、機密情報は扱いません。
 */

/**
 * ローカルストレージから文字列を取得する
 * @param key - 取得するキー
 * @returns 値。存在しない場合は null
 */
export const getLocalStorage = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch (error) {
    // Private Mode などで localStorage が使えない場合に備える
    console.warn("localStorage の読み込みに失敗しました:", error);
    return null;
  }
};

/**
 * ローカルストレージに文字列を保存する
 * @param key - セットするキー
 * @param value - セットする値
 */
export const setLocalStorage = (key: string, value: string): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn("localStorage の保存に失敗しました:", error);
  }
};

/**
 * ローカルストレージから JSON をパースして取得する
 * パース失敗時は fallback を返す
 */
export const getLocalJson = <T>(key: string, fallback: T): T => {
  const raw = getLocalStorage(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`localStorage の JSON パースに失敗しました (${key}):`, error);
    return fallback;
  }
};
