/**
 * 清理标题行里多写的井号：`## # 求法：` → `## 求法：`、
 * `# # 实现：` → `# 实现：`。博客园搬过来时留下的，渲染出来目录会顶着「# 求法」。
 * 代码块（``` 围起来的）里面的内容一律不动。
 *
 * 用法：node scripts/fix-headings.mjs          # 先看会改什么
 *       node scripts/fix-headings.mjs --write  # 真正写回去
 */
import fs from "node:fs";
import path from "node:path";

const write = process.argv.includes("--write");
const postsDir = path.join(process.cwd(), "src/content/posts");

const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
const report = [];

for (const file of files) {
	const full = path.join(postsDir, file);
	const lines = fs.readFileSync(full, "utf8").split("\n");

	// 找出 front matter 结束的位置
	let bodyStart = 0;
	let title = "";
	if (lines[0]?.trim() === "---") {
		const end = lines.findIndex((l, i) => i > 0 && l.trim() === "---");
		if (end > 0) bodyStart = end + 1;
		const titleLine = lines
			.slice(1, end)
			.find((l) => /^title:/.test(l.trim()));
		title = (titleLine ?? "")
			.replace(/^title:\s*/, "")
			.replace(/^["']|["']$/g, "")
			.trim();
	}

	// 标题行里多余的井号（跳过代码块）
	let inFence = false;
	let fixedHeadings = 0;
	for (let i = 0; i < lines.length; i++) {
		if (/^\s*```/.test(lines[i])) inFence = !inFence;
		if (inFence) continue;
		const m = lines[i].match(/^(#{1,6})\s+#+\s*(.*)$/);
		if (m) {
			lines[i] = `${m[1]} ${m[2]}`.trimEnd();
			fixedHeadings++;
		}
	}

	if (fixedHeadings > 0) {
		report.push({ file, fixedHeadings });
		if (write) fs.writeFileSync(full, lines.join("\n"), "utf8");
	}
}

console.log(`${write ? "已修改" : "会修改"} ${report.length} 个文件：`);
for (const r of report) {
	console.log(
		`  ${r.file} [修 ${r.fixedHeadings} 处井号]`,
	);
}
if (!write) console.log("\n加 --write 才会真正写回。");
