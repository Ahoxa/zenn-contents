const [, , slug, title] = Bun.argv;

if (!slug) {
  console.error("コマンドが正しくありません。記事のslugを指定してください。");
  process.exit(1);
}

const arg = ["bunx", "zenn", "new:article", "--slug", slug];
if (title) {
  arg.push("--title", title);
}

const proc = Bun.spawn(arg);

const code = await proc.exited;
process.exit(code);
