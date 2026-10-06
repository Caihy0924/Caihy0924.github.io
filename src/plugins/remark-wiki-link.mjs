import fs from "node:fs";
import path from "node:path";
import { visit } from "unist-util-visit";

/**
 * Obsidian 风格的内部链接：
 *   [[洛谷P3197-越狱]]           → 链接到那篇文章，显示原文
 *   [[洛谷P3197-越狱|越狱那题]]   → 链接过去，但显示「越狱那题」
 *
 * 匹配方式：先按文章标题，再按文件名（都不区分大小写）。
 * 两个都匹配不上时，就把名字当作文件名直接拼成网址。
 */
let indexCache = null;

function buildIndex(root) {
	const index = new Map();
	const dir = path.join(root, "src", "content", "posts");
	let entries = [];
	try {
		entries = fs.readdirSync(dir, { withFileTypes: true });
	} catch {
		return index;
	}

	for (const entry of entries) {
		if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
		const base = entry.name.replace(/\.md$/, "");
		const slug = base.toLowerCase();

		// 按文件名
		index.set(base.toLowerCase(), slug);

		// 按标题
		try {
			const raw = fs.readFileSync(path.join(dir, entry.name), "utf8");
			const m = raw.match(/^title:\s*"?(.*?)"?\s*$/m);
			if (m && m[1].trim()) index.set(m[1].trim().toLowerCase(), slug);
		} catch {
			/* 读不到就跳过 */
		}
	}
	return index;
}

export default function remarkWikiLink() {
	return (tree) => {
		if (!indexCache) indexCache = buildIndex(process.cwd());

		visit(tree, "text", (node, position, parent) => {
			if (!parent || !Array.isArray(parent.children)) return;
			if (typeof node.value !== "string" || !node.value.includes("[[")) return;

			const pattern = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
			const nodes = [];
			let cursor = 0;
			let match;

			while ((match = pattern.exec(node.value)) !== null) {
				if (match.index > cursor) {
					nodes.push({ type: "text", value: node.value.slice(cursor, match.index) });
				}

				const target = match[1].trim();
				const label = (match[2] ?? target).trim();
				const slug = indexCache.get(target.toLowerCase()) ?? target.toLowerCase();

				nodes.push({
					type: "link",
					url: `/posts/${encodeURI(slug)}/`,
					title: null,
					children: [{ type: "text", value: label }],
				});

				cursor = pattern.lastIndex;
			}

			if (nodes.length === 0) return;
			if (cursor < node.value.length) {
				nodes.push({ type: "text", value: node.value.slice(cursor) });
			}
			parent.children.splice(position, 1, ...nodes);
		});
	};
}
