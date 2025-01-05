// クッキーの操作を行うためのユーティリティ関数を定義

/**
 * クッキーを取得する関数
 * @param {string} key - 取得するクッキーのキー
 * @returns {string | null} - クッキーの値。存在しない場合はnullを返す
 */
export const getCookie = (key: string): string | null => {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${key}=`));
  return cookie ? cookie.split("=")[1] : null;
};

/**
 * クッキーをセットする関数
 * @param {string} key - セットするクッキーのキー
 * @param {string} value - セットするクッキーの値
 * @returns {void}
 */
export const setCookie = (key: string, value: string): void => {
  document.cookie = `${key}=${value}`;
};