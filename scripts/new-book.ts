const [, , slug, title] = Bun.argv;

if (!slug) {
  console.error("コマンドが正しくありません。本のslugを指定してください。");
  process.exit(1);
}

const arg = ["bunx", "zenn", "new:book", "--slug", slug];
if (title) {
  arg.push("--title", title);
}

const proc = Bun.spawn(arg);

const code = await proc.exited;
process.exit(code);
