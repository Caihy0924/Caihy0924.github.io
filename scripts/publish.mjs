/**
 * 一键发布：把当前改动提交并推到 GitHub，剩下的交给 Actions。
 * 用法：pnpm push
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

function git(args, options = {}) {
	return execFileSync("git", args, { encoding: "utf8", ...options });
}

// 直接问 git 要文件名单，不要去解析状态行的格式（空格数量不固定，容易切错）
const tracked = git(["diff", "--name-only", "HEAD"]);
const untracked = git(["ls-files", "--others", "--exclude-standard"]);
const changed = [...tracked.split("\n"), ...untracked.split("\n")]
	.map((line) => line.trim())
	.filter(Boolean);

if (changed.length === 0) {
	console.log("没有改动，不用提交。");
	process.exit(0);
}

// 提交信息：优先用最近改动的那篇文章的标题，否则用改动最多的目录
const post = changed.find(
	(f) => f.startsWith("src/content/posts/") && f.endsWith(".md"),
);
const message = post
	? `post: ${path.basename(post).replace(/\.md$/, "")}`
	: `chore: 更新博客（${changed.length} 个文件）`;

console.log(`共 ${changed.length} 个文件有改动`);
changed.slice(0, 10).forEach((f) => console.log(`  ${f}`));
if (changed.length > 10) console.log(`  …还有 ${changed.length - 10} 个`);

git(["add", "-A"], { stdio: "inherit" });

// 用文件传提交信息，避免中文在命令行里变成乱码
const msgFile = path.join(os.tmpdir(), `blog-commit-${Date.now()}.txt`);
fs.writeFileSync(msgFile, message, "utf8");
try {
	git(["commit", "-F", msgFile], { stdio: "inherit" });
} finally {
	fs.rmSync(msgFile, { force: true });
}

git(["push"], { stdio: "inherit" });

console.log("");
console.log("已推送 ✅  一分半后上线：https://caihy0924.github.io/");
console.log("构建进度：https://github.com/Caihy0924/Caihy0924.github.io/actions");
