# プロジェクト概要
- 言語・フレームワーク: 【BackEnd】Laravel12(PHP)　【FrontEnd】React18(TypeScript)
- 主なライブラリ: 【BackEnd】laravel-breeze　【FrontEnd】materialUI-v9.4.0 leaflet-v1.9.4 react-leaflet-v4.2.1
- 目的: P2P地震情報API（https://www.p2pquake.net/develop/json_api_v2）を用いた地震情報検知アプリの開発

## 応答ルール
- **言語**: 必ず日本語で回答すること。
- **トーン**: 簡潔で論理的な文体にする（結論ファースト）。
- **出力形式**: 箇条書きを多用し、長すぎる説明は避ける。
- **コマンド実行**: コマンド実行時は必ず事前に確認を取ること。

## 開発・ビルドコマンド
- BackEnd起動: `php artisan serve`
- BackEndリセット: `php artisan config:clear`,`php artisan route:clear`,`php artisan cache:clear`
- FrontEnd起動: `npm run dev`
- FrontEndキャッシュ削除: `npm cache verify`
- FrontEndビルド: `npm cache verify`,`npm run build`

## コーディング規約・ルール
- 既存のコードスタイル（インデント、命名規則）に従うこと。
- 破壊的な変更や、確認なしのファイル削除・上書きは禁止。
- 不明点や曖昧な指示がある場合は、勝手に推測せず実行前にユーザーへ確認すること。

## 禁止事項
- 本番環境データや機密情報（APIキー、パスワード等）を出力・ハードコードしない。
- 実行するコマンドの意味が不明な場合は勝手に走らせず、事前に説明すること。
