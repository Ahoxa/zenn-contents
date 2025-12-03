---
title: "オレ流最強のローカル記事執筆環境構築方法"
emoji: "✒️"
type: "idea" # tech: 技術記事 / idea: アイデア
topics: ["zenncli", "textlint", "markdownlint", "cspell", "記事執筆"]
published: false
publication_name: "hrbrain"
---

みなさん！技術記事！書いてますか！

僕は！**技術記事！書いてません！**
そんな形から入る三日坊主の私が形から入ってはまってしまったローカル記事執筆環境の中身をご照覧あれ。[^1]

私の最強リポジトリはこちら
https://github.com/Ahoxa/zenn-contents

[^1]: ご照覧あれい！https://kamikouryaku.net/eldenring/?%E3%81%94%E7%85%A7%E8%A6%A7%E3%81%82%E3%82%8C%E3%81%84%EF%BC%81

## 前提

まずまず、大前提として、私はZenn CLI (`zenn-cli`) を使って記事を書いています。
まだZenn CLIを使ってないよ〜って方は、[公式ドキュメント](https://zenn.dev/zenn/articles/zenn-cli-guide)を参考にセットアップしてください。

https://zenn.dev/zenn/articles/install-zenn-cli

https://zenn.dev/zenn/articles/connect-to-github

https://zenn.dev/zenn/articles/setup-zenn-github-with-export

## ディレクトリ構成

ディレクトリ構成はこんな感じです。

```text
/zenn-contents
├─ .github
│  └─ workflows
│     └─ lint.yml
├─ articles
├─ books
├─ images
├─ scripts
│  ├─ new-article.ts
│  └─ new-book.ts
├─ .markdownlint-cli2.cjs
├─ .textlintrc.json
├─ cspell.config.cjs
└─ package.json

```

## 記事・本の作成

CLI上で記事や本を新規作成しようとすると、結構面倒です。
slugやtitleをコマンド入力するとさらに面倒。
そこで、記事や本の作成を簡単にするためのスクリプトを用意しました。

```typescript:scripts/new-article.ts
// コマンドライン引数から slug と title を取得
const [, , slug, title] = Bun.argv;

if (!slug) {
  console.error("コマンドが正しくありません。記事のslugを指定してください。");
  process.exit(1);
}

const arg = ["bunx", "zenn", "new:article", "--slug", slug];

// title が指定されていれば引数に追加
if (title) {
  arg.push("--title", title);
}

const proc = Bun.spawn(arg);

const code = await proc.exited;
process.exit(code);
```

`package.json` に以下のように登録し、`bun run article <slug> [title]` で実行できます。

```json
"scripts": {
  "article": "bun scripts/new-article.ts",
  "book": "bun scripts/new-book.ts"
}
```

## Lint / Formatter 設定

記事の品質を保つために、以下の3つのツールを導入しています。

1. **textlint**: 日本語の文章校正
2. **markdownlint**: Markdownの構文チェック
3. **cspell**: スペルチェック

これらを `package.json` のscriptsに登録し、`bun run lint:all` で一括実行できるようにしています。

```json:package.json
{
  "scripts": {
    "tlint": "textlint -f pretty-error 'articles/**/*.md'",
    "tfix": "textlint --fix 'articles/**/*.md'",
    "spell": "cspell 'articles/**/*.md'",
    "mdlint": "markdownlint-cli2 'articles/**/*.md'",
    "mdfix": "markdownlint-cli2-fix 'articles/**/*.md'",
    "lint:all": "bun run lint && bun run spell && bun run mdlint"
  }
}
```

### textlint (日本語校正)

技術記事向けのプリセット `textlint-rule-preset-ja-technical-writing` と、スペース周りのルール `textlint-rule-preset-ja-spacing` を使用しています。

`.textlintrc.json` の設定は以下の通りです。
公式ドキュメントやこちらの記事を参考にして設定しました。

https://github.com/textlint-ja
https://zenn.dev/hayato94087/articles/98673792e90715

```json:.textlintrc.json
{
  "filters": {
    "comments": true
  },
  "rules": {
    "preset-ja-technical-writing": {
      "no-exclamation-question-mark": false, // 「！」や「？」の使用を許可
      "max-kanji-continuous-len": {
        "max": 8 // 漢字の連続は8文字まで
      },
      "sentence-length": {
        "max": 120 // 1文の長さは120文字まで
      },
      "ja-no-weak-phrase": false // 「〜かもしれない」などの表現を許可
    },
    "preset-ja-spacing": {
      "ja-space-around-code": {
        "before": true,
        "after": true
      },
      "ja-no-space-around-full-width": true,
      "ja-no-space-around-parentheses": true,
      "filters": {
        "comments": true
      }
    }
  }
}
```

### markdownlint (Markdown 構文チェック)

`markdownlint-cli2` を使用しています。Zenn独自の記法やtextlintとの競合を避けるために一部のルールを無効化しています。
設定ファイルは `.markdownlint-cli2.cjs` を使用します。

```javascript:.markdownlint-cli2.cjs
module.exports = {
  config: {
    default: true,
    MD013: false, // 文の長さはtextlintでチェックするため無効化
    MD026: false, // 本文の句読点ルールはtextlintに任せるため（見出しの末尾の「！」「？」なども許可）
    MD034: false, // 裸のURLを許可する
    MD041: false, // ZennのFront Matterがあるため無効化
  },
};
```

### cspell (スペルチェック)

技術用語や固有名詞の誤字を防ぐために導入しています。
`cspell.config.cjs` で辞書設定をしています。

```javascript:cspell.config.cjs
/** @type {import('cspell').CSpellUserSettings} */
module.exports = {
  version: "0.2",
  language: "en,ja",
  files: ["articles/**/*.md"],
  ignorePaths: ["node_modules", "dist"],
  words: ["Zenn", "textlint", "zenncli", "Ahoxa", "reacthooks", "hrbrain"],
};
```

## CI (GitHub Actions)

~~正直いらないけど~~ Pull Request作成時やmainブランチへのプッシュ時に、自動でLintを実行するようにしています。
私はBun信者なのでBunを使っていますが、皆さんお好みのランタイムで実行してください。

```yaml:.github/workflows/lint.yml
name: lint

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  lint:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Run textlint
        run: bun run lint

      - name: Run markdownlint
        run: bun run mdlint

      - name: Run cspell
        run: bun run spell
```

## まとめ

昨今はAIを使って記事の土台を書いたりすることも多くなったので、Web上で書くことよりもローカルで書くことが増えてきたと思います。
別にこんな設定しなくても全然いいんですが、自分だけの執筆環境をこだわって作るのも楽しいもんです。
ぜひみなさんも楽しんで執筆環境作ってみてください！

記事がんばって書くぞ〜！

## 余談 : Warp も一緒に使うと便利

[Warp](https://www.warp.dev/)でLintやFormatをするとこんな感じでエラーに対して自動で修正してくれるので超便利！
Warp最高！Warp最高！[^2]

![Warp screenshot](/images/zenn-cli-settings/warp.png)

[^2]: 未来最高！https://dic.pixiv.net/a/%E6%9C%AA%E6%9D%A5%E3%81%AE%E6%82%AA%E9%AD%94
