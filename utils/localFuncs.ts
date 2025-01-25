/**
 * ローカルストレージの操作を行うためのユーティリティ関数を定義
 */

// 目的は保存する値を取得されても安易に見られないようにするため暗号化を行っている
// ただフロントでの処理の時点で程度は知れれている、本格的にセキュリティを考慮する場合はサーバーサイドで暗号化を行うべき
const isEncryption = false; // 暗号化を行うかどうか
const secretKey = "your-secret-key"; // 秘密鍵を設定

/**
 * 簡単な暗号化関数
 * @param {string} value - 暗号化する値
 * @returns {string} - 暗号化された値
 */
const encrypt = (value: string): string => {
  const textToChars = (text: string) => text.split('').map(c => c.charCodeAt(0));
  const byteHex = (n: number) => ("0" + Number(n).toString(16)).substring(-2);
  const applySecretToChar = (code: number) => textToChars(secretKey).reduce((a, b) => a ^ b, code);
  return value.split('')
    .map(c => applySecretToChar(c.charCodeAt(0)))
    .map(byteHex)
    .join('');
};

/**
 * 簡単な復号化関数
 * @param {string} encrypted - 復号化する値
 * @returns {string} - 復号化された値
 */
const decrypt = (encrypted: string): string => {
  const textToChars = (text: string) => text.split('').map(c => c.charCodeAt(0));
  const applySecretToChar = (code: number) => textToChars(secretKey).reduce((a, b) => a ^ b, code);
  const match = encrypted.match(/.{1,2}/g);
  if (!match) {
    return '';
  }
  return match.map(hex => parseInt(hex, 16))
    .map(applySecretToChar)
    .map(charCode => String.fromCharCode(charCode))
    .join('');
};

/**
 * ローカルストレージから値を取得する関数
 * @param {string} key - 取得するキー
 * @returns {string | null} - 値。存在しない場合はnullを返す
 */
export const getLocalStorage = (key: string): string | null => {
  const encryptedValue = localStorage.getItem(key);
  if (encryptedValue) {
    return isEncryption ? decrypt(encryptedValue) : encryptedValue;
  }
  return null;
};

/**
 * ローカルストレージに値をセットする関数
 * @param {string} key - セットするキー
 * @param {string} value - セットする値
 * @returns {void}
 */
export const setLocalStorage = (key: string, value: string): void => {
  const encryptedValue = isEncryption ? encrypt(value) : value;
  localStorage.setItem(key, encryptedValue);
};
