// ローカルストレージの操作を行うためのユーティリティ関数を定義

/**
 * ローカルストレージから値を取得する関数
 * @param {string} key - 取得するキー
 * @returns {string | null} - 値。存在しない場合はnullを返す
 */
export const getLocalStorage = (key: string): string | null => {
  return localStorage.getItem(key);
};

/**
 * ローカルストレージに値をセットする関数
 * @param {string} key - セットするキー
 * @param {string} value - セットする値
 * @returns {void}
 */
export const setLocalStorage = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};
