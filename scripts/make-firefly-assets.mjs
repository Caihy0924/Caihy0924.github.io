/**
 * 给并存的 Firefly 仓库做一套「空洞骑士」素材：
 *   - 桌面 / 手机壁纸（各 6 张，随机轮换用的）
 *   - 头像、logo、favicon（都从那张小骑士头像裁出来）
 *   - 相册
 *   - 把 myblog 的 42 张文章封面搬过去
 *   - 顺手删掉 Firefly 自带的流萤/初音素材（米哈游、Crypton 版权图）
 *
 * 只写 ../firefly-blog，不动 myblog。用法：node scripts/make-firefly-assets.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const here = process.cwd(); // myblog
const desktop = path.resolve(here, "..");
const sources = path.join(desktop, "cover-sources");
const ff = path.join(desktop, "firefly-blog");

if (!fs.existsSync(ff)) {
	console.error(`找不到 firefly 仓库：${ff}`);
	process.exit(1);
}

const knightAvatar = path.join(here, "src/assets/images/avatar.png");
const moonSky = path.join(here, "src/assets/images/moon-banner.jpg");

// 六张桌面壁纸的来源：五张空洞骑士原图 + 我们自己画的那张夜空
const wallpapers = [
	path.join(sources, "crystal.png"),
	path.join(sources, "knight-4k.jpg"),
	path.join(sources, "night.jpg"),
	path.join(sources, "knight-dark.png"),
	path.join(sources, "minimal.jpg"),
	moonSky,
].filter((p) => fs.existsSync(p));

const ffImages = path.join(ff, "src/assets/images");
const desktopDir = path.join(ffImages, "DesktopWallpaper");
const mobileDir = path.join(ffImages, "MobileWallpaper");
const logoDir = path.join(ffImages, "logo");
const faviconDir = path.join(ff, "public/favicon");
for (const dir of [desktopDir, mobileDir, logoDir, faviconDir]) {
	fs.mkdirSync(dir, { recursive: true });
}

// ── 1. 壁纸（桌面 1920x1080 / 手机 1080x1920）──
let i = 0;
for (const src of wallpapers) {
	i++;
	await sharp(src)
		.resize(1920, 1080, { fit: "cover", position: "attention" })
		.avif({ quality: 62, effort: 4 })
		.toFile(path.join(desktopDir, `d${i}.avif`));
	await sharp(src)
		.resize(1080, 1920, { fit: "cover", position: "attention" })
		.avif({ quality: 60, effort: 4 })
		.toFile(path.join(mobileDir, `m${i}.avif`));
}
console.log(`壁纸：桌面 ${i} 张 / 手机 ${i} 张`);

// ── 2. 头像 ──
await sharp(knightAvatar)
	.resize(512, 512, { fit: "cover" })
	.avif({ quality: 70, effort: 4 })
	.toFile(path.join(ffImages, "avatar.avif"));

// ── 3. logo / favicon：把头像裁成圆的，做成小图标 ──
const iconSize = 512;
const circle = Buffer.from(
	`<svg width="${iconSize}" height="${iconSize}" xmlns="http://www.w3.org/2000/svg"><circle cx="${iconSize / 2}" cy="${iconSize / 2}" r="${iconSize / 2}" fill="#fff"/></svg>`,
);
const iconBuffer = await sharp(knightAvatar)
	.resize(iconSize, iconSize, { fit: "cover", position: "attention" })
	.composite([{ input: circle, blend: "dest-in" }])
	.png()
	.toBuffer();

for (const size of [32, 128, 180, 192]) {
	for (const name of [
		`firefly-${size}.png`,
		`favicon-dark-${size}.png`,
		`favicon-light-${size}.png`,
	]) {
		await sharp(iconBuffer)
			.resize(size, size)
			.png()
			.toFile(path.join(faviconDir, name));
	}
}
for (const name of ["firefly-dark.png", "firefly-light.png"]) {
	await sharp(iconBuffer).resize(256, 256).png().toFile(path.join(logoDir, name));
}
console.log("头像 / logo / favicon 换好");

// ── 4. 相册 ──
const albumDir = path.join(ff, "public/gallery/hollow-knight");
fs.mkdirSync(albumDir, { recursive: true });
let n = 0;
for (const src of wallpapers) {
	n++;
	const name = n === 1 ? "cover.avif" : `${n - 1}.avif`;
	await sharp(src)
		.resize(1600, 1200, { fit: "cover", position: "attention" })
		.avif({ quality: 60, effort: 4 })
		.toFile(path.join(albumDir, name));
}
fs.rmSync(path.join(ff, "public/gallery/firefly-2026"), { recursive: true, force: true });
console.log(`相册：hollow-knight（${n} 张）`);

// ── 5. 文章封面直接搬过去 ──
const coversSrc = path.join(here, "public/covers");
const coversDst = path.join(ff, "public/covers");
fs.mkdirSync(coversDst, { recursive: true });
let copied = 0;
for (const file of fs.readdirSync(coversSrc)) {
	fs.copyFileSync(path.join(coversSrc, file), path.join(coversDst, file));
	copied++;
}
console.log(`封面：搬了 ${copied} 张`);

// ── 6. 删掉自带的流萤 / 初音素材（版权图，反正看板娘默认也关着）──
const removeList = [
	"public/pio/models/spine/firefly",
	"public/pio/models/live2d/snow_miku",
	"public/assets/music",
];
for (const rel of removeList) {
	const target = path.join(ff, rel);
	if (fs.existsSync(target)) {
		fs.rmSync(target, { recursive: true, force: true });
		console.log(`删除 ${rel}`);
	}
}
