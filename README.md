## 目的
ボドゲ等を遊ぶ時のダイス、トークン、勝利点等を表示するためのアプリを作成する。

## 使用コマンドメモ

1. `npx create-next-app`
2. `npm install three @react-three/fiber`
3. `npm i @react-three/drei`
4. `npm run dev`

## アイディア
- サウンドエフェクト追加
- カードと得点などの設定値、入力値をローカル保存する機能
- カードの背景色変更
- クリックしっぱなしで連打と同等の効果を出させる
- 追加カード
  - ターン表示
  - 投票システム
  - チーム分け
  - 20 ダイス
- リファクタリング
  - 各カード内の共通部分をパーツ化
  - カードの基本レイアウト（カードサイズ等）を共通化

## 参考URL
- react-three-fiber, drei などの紹介
  - あくまで紹介記事、導入のイメージ把握に使用
  - https://zenn.dev/solb/articles/d25e664154cc0c
  - https://hack.nikkei.com/blog/advent20231207/
- Tailwind ドキュメント
  - https://tailwindcss.com/docs
- ReactThreeFiber ドキュメント
  - 対して参考にならない・・・？
  - https://r3f.docs.pmnd.rs/getting-started/introduction
- Drei ドキュメント
  - ドキュメントとしての用途もだが、サンプルコードが多く掲載されており助かる
  - https://drei.docs.pmnd.rs/getting-started/introduction
- Three.js ドキュメント
  - 結局詳細な設定内容はここで確認することになる
  - https://threejs.org/docs/index.html
