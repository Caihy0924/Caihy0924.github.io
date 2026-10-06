/**
 * 给每篇文章生成封面图。
 *
 * 素材放在项目外面的 ../cover-sources/ 里（night.jpg / minimal.jpg / crystal.png），
 * 按顺序轮换，底部压暗 + 分类色轻叠，输出 640x400 的 JPEG 到 public/covers/，
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

const SOURCES = ["night.jpg", "minimal.jpg", "crystal.png"];

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

const files = fs
	.readdirSync(postsDir)
	.filter((f) => f.endsWith(".md") && !f.startsWith("_"))
	.sort();

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
	const source = path.join(srcDir, SOURCES[index % SOURCES.length]);
	const tint = TINTS[category] ?? TINTS.随笔;

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

	await sharp(source)
		.resize(W, H, { fit: "cover", position: "attention" })
		.composite([{ input: overlay }])
		.jpeg({ quality: 80, mozjpeg: true })
		.toFile(outPath);

	const next = text.replace(/^image:.*$/m, `image: "/covers/${outName}"`);
	if (next !== text) fs.writeFileSync(full, next, "utf8");

	report.push({
		kb: Math.round(fs.statSync(outPath).size / 1024),
		category,
		title,
		素材: SOURCES[index % SOURCES.length],
	});
	index++;
}

const total = report.reduce((sum, r) => sum + r.kb, 0);
console.log(`生成 ${report.length} 张封面 → public/covers/`);
console.log(
	`总体积 ${(total / 1024).toFixed(1)} MB，平均 ${Math.round(total / report.length)} KB`,
);
report.slice(0, 6).forEach((r) => {
	console.log(`  ${String(r.kb).padStart(3)}KB  [${r.category}] ${r.title}  ← ${r.素材}`);
});
