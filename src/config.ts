import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "Caihy 的博客",
	subtitle: "臭打 OI 的中学生，写些博客",
	lang: "zh_CN", // 界面语言，中文用 zh_CN
	themeColor: {
		hue: 285, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
	},
	banner: {
		enable: true, // 顶部壁纸横幅
		src: "assets/images/void-banner.png", // 小骑士那张；想换图就改这里，或者把文件替换掉
		backdrop: "assets/images/void-wallpaper.jpg", // 整屏背景壁纸（模糊后垫在卡片下面）
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 3, // 目录显示到几级标题，1~3
	},
	favicon: [
		// Leave this array empty to use the default favicon
		// {
		//   src: '/favicon/icon.png',    // Path of the favicon, relative to the /public directory
		//   theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
		//   sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
		// }
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "动态",
			url: "/dynamic/",
		},
		{
			name: "友链",
			url: "/friends/",
		},
		{
			name: "GitHub",
			url: "https://github.com/Caihy0924", // Internal links should not include the base path, as it is automatically added
			external: true, // Show an external link icon and will open in a new tab
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.png", // 头像：放在 src/assets/images/ 下，或者写成以 / 开头的 public 路径
	name: "Caihy",
	bio: "臭打 OI 的中学生，写些博客。",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/Caihy0924",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};

// ───────── 公告条 ─────────
export const announcementConfig = {
	enable: true,
	content: "博客刚搬完家，样式还在慢慢调～",
	closable: true, // 访客能不能点叉关掉（关掉后本机不再显示）
};

// ───────── 评论（giscus，基于 GitHub Discussions，不需要后端）─────────
export const commentConfig = {
	enable: true,
	repo: "Caihy0924/Caihy0924.github.io",
	repoId: "R_kgDOU7WI2w",
	category: "Announcements",
	categoryId: "DIC_kwDOU7WI284DHE7P",
	mapping: "pathname",
	lang: "zh-CN",
	// 评论框配色：跟着站点主题走（暗色用 transparent_dark，能融进卡片背景）
	darkTheme: "transparent_dark",
	lightTheme: "light",
};

// ───────── 友链 ─────────
export const friendsConfig = {
	enable: true,
	friends: [
		{
			name: "Fuwari",
			avatar: "https://github.com/saicaca.png",
			url: "https://github.com/saicaca/fuwari",
			description: "本博客用的主题",
		},
		{
			name: "Firefly",
			avatar: "https://github.com/CuteLeaf.png",
			url: "https://github.com/CuteLeaf/Firefly",
			description: "另一款好看的 Astro 主题",
		},
	],
};

// ───────── 动态 / 说说 ─────────
export const dynamicConfig = {
	enable: true,
};

// ───────── 横幅上的文字（首页顶部大图那一层）─────────
export const bannerTextConfig = {
	enable: true,
	title: "Caihy 的博客",
	// 副标题，可以写多句；写多句的话会一句句轮流打字
	subtitles: ["臭打 OI 的中学生，写些博客"],
	typewriter: true, // 打字机效果；关掉就静态显示
	showSocial: true, // 标题下面那排圆形图标（取个人资料里的链接 + RSS）
};

// ───────── 访问统计 ─────────
export const analyticsConfig = {
	// 免注册的访问计数：第三方免费图床服务，读不到时这一行会自动隐藏
	visitorBadge: {
		enable: true,
		pageId: "caihy0924.github.io",
		label: "views",
	},
	// Umami（推荐，有免费额度、不收集隐私）：去 https://umami.is 注册建站后填这两项
	umami: {
		enable: false,
		src: "", // 例如 https://cloud.umami.is/script.js
		websiteId: "", // 形如 8f3b0a1c-xxxx-xxxx-xxxx-xxxxxxxxxxxx
	},
	// Google Analytics：填 G-XXXXXXXXXX（国内访问者可能加载不了）
	google: {
		enable: false,
		measurementId: "",
	},
};
