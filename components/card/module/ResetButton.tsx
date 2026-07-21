/**
 * カード左下に共通で置くリセットボタン
 *
 * 見た目と配置を揃えるため、各カードで同じクラスを繰り返さず
 * このコンポーネント経由で描画します。
 */

type ResetButtonProps = {
  onClick: () => void;
  /** アクセシビリティ用のラベル */
  label?: string;
};

export default function ResetButton({
  onClick,
  label = "Reset",
}: ResetButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className="absolute bottom-1 left-2 text-xl cursor-pointer duration-200 opacity-30 hover:opacity-100"
      onClick={onClick}
    >
      ↺
    </button>
  );
}
