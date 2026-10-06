/**
 * 生成一张「长夜 · 月」主题的夜空壁纸（纯代码画，不涉及任何版权素材）。
 * 深蓝近黑的夜空 + 一轮带光晕的月 + 稀疏星点 + 几缕薄云，
 * 横幅用清晰的这张，整屏背景用同一张压暗模糊。
 *
 * 用法：node scripts/make-moon-wallpaper.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const W = 2560;
const H = 1440;
const MOON_X = 1860;
const MOON_Y = 560;
const MOON_R = 190;

// 固定种子，保证每次生成都一样
function makeRandom(seed) {
	let t = seed;
	return () => {
		t += 0x6d2b79f5;
		let r = Math.imul(t ^ (t >>> 15), 1 | t);
		r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
		return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
	};
}
const rand = makeRandom(20261006);

const stars = Array.from({ length: 320 }, () => {
	const x = rand() * W;
	const y = rand() * H * 0.92;
	const r = (rand() * 1.7 + 0.4).toFixed(2);
	const o = (0.12 + rand() * 0.7).toFixed(2);
	return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="#eaf2ff" opacity="${o}"/>`;
}).join("");

const craters = [
	[MOON_X - 62, MOON_Y - 38, 30, 0.1],
	[MOON_X + 46, MOON_Y + 18, 44, 0.08],
	[MOON_X - 18, MOON_Y + 66, 22, 0.09],
	[MOON_X + 78, MOON_Y - 74, 16, 0.12],
]
	.map(
		([x, y, r, o]) =>
			`<circle cx="${x}" cy="${y}" r="${r}" fill="#9fb0cc" opacity="${o}"/>`,
	)
	.join("");

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0.25" y2="1">
      <stop offset="0%" stop-color="#04060e"/>
      <stop offset="45%" stop-color="#080e1c"/>
      <stop offset="100%" stop-color="#0d1526"/>
    </linearGradient>
    <radialGradient id="halo" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#d9e6ff" stop-opacity="0.34"/>
      <stop offset="38%" stop-color="#8fb0ff" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="moon" cx="36%" cy="32%" r="78%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="62%" stop-color="#e9eefb"/>
      <stop offset="100%" stop-color="#bac7dd"/>
    </radialGradient>
    <radialGradient id="moonShade" cx="72%" cy="74%" r="72%">
      <stop offset="55%" stop-color="#1b2438" stop-opacity="0"/>
      <stop offset="100%" stop-color="#141c2e" stop-opacity="0.5"/>
    </radialGradient>
    <radialGradient id="vignette" cx="50%" cy="45%" r="72%">
      <stop offset="55%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.62"/>
    </radialGradient>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="42"/>
    </filter>
    <filter id="softer" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="90"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  ${stars}

  <!-- 月光晕开的两层雾 -->
  <circle cx="${MOON_X}" cy="${MOON_Y}" r="620" fill="url(#halo)"/>
  <ellipse cx="${MOON_X}" cy="${MOON_Y + 40}" rx="900" ry="420" fill="#6f8dd6" opacity="0.07" filter="url(#softer)"/>

  <!-- 月亮本体 -->
  <circle cx="${MOON_X}" cy="${MOON_Y}" r="${MOON_R}" fill="url(#moon)"/>
  ${craters}
  <circle cx="${MOON_X}" cy="${MOON_Y}" r="${MOON_R}" fill="url(#moonShade)"/>

  <!-- 掠过月面的薄云 -->
  <g filter="url(#soft)" opacity="0.5">
    <ellipse cx="${MOON_X - 240}" cy="${MOON_Y + 92}" rx="520" ry="46" fill="#2b3a5c"/>
    <ellipse cx="${MOON_X + 160}" cy="${MOON_Y + 168}" rx="640" ry="52" fill="#2b3a5c"/>
    <ellipse cx="${MOON_X + 60}" cy="${MOON_Y - 128}" rx="430" ry="34" fill="#26344f"/>
  </g>
  <g filter="url(#softer)" opacity="0.45">
    <ellipse cx="520" cy="1180" rx="900" ry="150" fill="#141d33"/>
    <ellipse cx="2100" cy="1320" rx="820" ry="170" fill="#141d33"/>
  </g>

  <rect width="${W}" height="${H}" fill="url(#vignette)"/>
</svg>`;

const outDir = path.join(process.cwd(), "src/assets/images");
fs.mkdirSync(outDir, { recursive: true });

const bannerOut = path.join(outDir, "moon-banner.jpg");
const wallpaperOut = path.join(outDir, "moon-wallpaper.jpg");
const buffer = Buffer.from(svg);

await sharp(buffer)
	.resize(W, H)
	.jpeg({ quality: 88, mozjpeg: true })
	.toFile(bannerOut);

await sharp(buffer)
	.resize(1920, 1080)
	.jpeg({ quality: 78, mozjpeg: true })
	.toFile(wallpaperOut);

console.log(
	`moon-banner.jpg ${Math.round(fs.statSync(bannerOut).size / 1024)}KB / moon-wallpaper.jpg ${Math.round(
		fs.statSync(wallpaperOut).size / 1024,
	)}KB`,
);
