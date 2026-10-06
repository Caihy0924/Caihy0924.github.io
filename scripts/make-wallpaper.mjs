/**
 * 整屏背景壁纸：从 cover-sources 里挑一张亮一点的图，压成 1920x1080 的 JPEG。
 * 页面上再叠一层压暗 + 模糊，所以原图不用太干净，颜色好看就行。
 *
 * 用法：node scripts/make-wallpaper.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const srcFile = process.argv[2] ?? "crystal.png";
const src = path.resolve(root, "..", "cover-sources", srcFile);
const outDir = path.join(root, "src/assets/images");
const out = path.join(outDir, "void-wallpaper.jpg");

if (!fs.existsSync(src)) {
	console.error(`找不到素材：${src}`);
	process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

await sharp(src)
	.resize(1920, 1080, { fit: "cover", position: "attention" })
	.modulate({ saturation: 1.08, brightness: 1.03 })
	.jpeg({ quality: 78, mozjpeg: true })
	.toFile(out);

console.log(
	`壁纸写好：src/assets/images/void-wallpaper.jpg  ${Math.round(fs.statSync(out).size / 1024)}KB（素材：${srcFile}）`,
);
