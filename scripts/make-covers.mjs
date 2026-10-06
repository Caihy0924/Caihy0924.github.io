/**
 * 给每篇文章生成封面图。
 *
 * 素材放在项目外面的 ../cover-sources/ 里（空洞骑士那几张），
 * 按首页顺序轮换 + 每次换裁切位置，底部压暗 + 分类色轻叠，
 * 输出 640x400 的 JPEG 到 public/covers/，
 * 并把路径写回每篇文章的 front matter。
 *
 * 用法：node scripts/make-covers.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const postsDir = path.join(root, "src/content/posts");
const outDir = path.join(root, "public/covers");
const srcDir = path.resolve(root, "..", "cover-sources");

const SOURCES = [
	"crystal.png",
	"knight-dark.png",
	"knight-4k.jpg",
	"minimal.jpg",
	"night.jpg",
];

// 同一张素材会被十几篇文章用到，换个裁切位置，重复感会淡很多
const POSITIONS = ["attention", "center", "left", "right", "top", "bottom"];

// 有些素材里的人物太靠中间、整体偏空，先放大一圈再裁，卡片上才看得清
const ZOOMS = {
	"knight-dark.png": 2,
	"minimal.jpg": 1.5,
};

// 分类 → 叠色：保持暗调，只做轻微区分
const TINTS = {
	题解: "#3f8fc7",
	算法笔记: "#7a6ee0",
	数学: "#3fa88f",
	游记: "#c79a4a",
	模板: "#c76a8a",
	随笔: "#6b7f95",
};

const W = 640;
const H = 400;

const safeName = (name) => name.replace(/[^\p{L}\p{N}_+-]/gu, "-");

if (!fs.existsSync(srcDir)) {
	console.error(`找不到素材目录：${srcDir}`);
	process.exit(1);
}

for (const s of SOURCES) {
	if (!fs.existsSync(path.join(srcDir, s))) {
		console.error(`缺少素材：${path.join(srcDir, s)}`);
		process.exit(1);
	}
}

fs.mkdirSync(outDir, { recursive: true });

// 排序必须跟线上首页完全一致：草稿不发布，置顶优先，其次发布日期从新到旧。
// 这样素材轮换下来，列表里相邻的两张卡片一定不是同一张图。
const entries = fs
	.readdirSync(postsDir)
	.filter((f) => f.endsWith(".md") && !f.startsWith("_"))
	.map((file) => {
		const text = fs.readFileSync(path.join(postsDir, file), "utf8");
		const dateMatch = text.match(/^published:\s*"?(.*?)"?\s*$/m);
		const pinMatch = text.match(/^pinned:\s*(true|false)/m);
		const draftMatch = text.match(/^draft:\s*(true|false)/m);
		return {
			file,
			date: dateMatch ? Date.parse(dateMatch[1].trim()) || 0 : 0,
			pinned: pinMatch ? pinMatch[1] === "true" : false,
			draft: draftMatch ? draftMatch[1] === "true" : false,
		};
	})
	.sort(
		(a, b) =>
			Number(b.pinned) - Number(a.pinned) ||
			b.date - a.date ||
			a.file.localeCompare(b.file),
	);

// 种子的下标只按“线上会显示的文章”数，草稿占位但不参与轮换
const seedIndex = new Map();
let seed = 0;
for (const entry of entries) {
	if (!entry.draft) seedIndex.set(entry.file, seed++);
}
let fallbackSeed = seed;
for (const entry of entries) {
	if (entry.draft) seedIndex.set(entry.file, fallbackSeed++);
}

const files = entries.map((entry) => entry.file);

const report = [];
let index = 0;

for (const file of files) {
	const full = path.join(postsDir, file);
	let text = fs.readFileSync(full, "utf8");

	const titleMatch = text.match(/^title:\s*"?(.*?)"?\s*$/m);
	const categoryMatch = text.match(/^category:\s*"?(.*?)"?\s*$/m);
	const title = titleMatch ? titleMatch[1].trim() : file.replace(/\.md$/, "");
	const category =
		categoryMatch && categoryMatch[1].trim() ? categoryMatch[1].trim() : "随笔";

	const outName = `${safeName(file.replace(/\.md$/, ""))}.jpg`;
	const outPath = path.join(outDir, outName);
	const i = seedIndex.get(file) ?? index;
	const sourceName = SOURCES[i % SOURCES.length];
	const source = path.join(srcDir, sourceName);
	const position =
		POSITIONS[Math.floor(i / SOURCES.length) % POSITIONS.length];
	const tint = TINTS[category] ?? TINTS.随笔;

	const zoom = ZOOMS[sourceName] ?? 1;
	let pipeline = sharp(source);
	if (zoom > 1) {
		const meta = await pipeline.metadata();
		const cw = Math.round(meta.width / zoom);
		const ch = Math.round(meta.height / zoom);
		pipeline = sharp(source).extract({
			left: Math.round((meta.width - cw) / 2),
			top: Math.round((meta.height - ch) / 2),
			width: cw,
			height: ch,
		});
	}

	const overlay = Buffer.from(
		`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stop-color="#000000" stop-opacity="0.06"/>
					<stop offset="100%" stop-color="#000000" stop-opacity="0.55"/>
				</linearGradient>
			</defs>
			<rect width="${W}" height="${H}" fill="${tint}" opacity="0.14"/>
			<rect width="${W}" height="${H}" fill="url(#shade)"/>
		</svg>`,
	);

	await pipeline
		.resize(W, H, { fit: "cover", position })
		.composite([{ input: overlay }])
		.jpeg({ quality: 80, mozjpeg: true })
		.toFile(outPath);

	const next = text.replace(/^image:.*$/m, `image: "/covers/${outName}"`);
	if (next !== text) fs.writeFileSync(full, next, "utf8");

	report.push({
		i,
		kb: Math.round(fs.statSync(outPath).size / 1024),
		category,
		title,
		素材: sourceName,
		裁切: position,
	});
	index++;
}

const total = report.reduce((sum, r) => sum + r.kb, 0);
console.log(`生成 ${report.length} 张封面 → public/covers/`);
console.log(
	`总体积 ${(total / 1024).toFixed(1)} MB，平均 ${Math.round(total / report.length)} KB`,
);
report
	.filter((r) => r.i < seed)
	.sort((a, b) => a.i - b.i)
	.slice(0, 12)
	.forEach((r) => {
	console.log(
		`  ${String(r.kb).padStart(3)}KB  [${r.category}] ${r.title}  ← ${r.素材} / ${r.裁切}`,
	);
});
