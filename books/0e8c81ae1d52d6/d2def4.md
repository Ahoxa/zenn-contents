---
title: "コンポーネントを作ろう"
free: false
---

## 真打登場！（）
さあコンポーネントの実装です。
ahouiでは`core`ディレクトリにベースのコンポーネントを実装して、`react`や`solid`ディレクトリにインポートする形をとるのでまずはcoreさえ作れば、実装が完了したことに近いです。さあ！ここまでのセッティングでみなさんお疲れでしょうが、ここからはしばらく楽しいですよ！

### coreに必要なライブラリをインポートする
coreにVEをインストールします。
```zsh
bun add -D @vanilla-extract/css @vanilla-extract/recipes @vanilla-extract/esbuild-plugin --cwd packages/core
```