/**
 * 分类配色：卡片、侧栏、归档页共用一套，一眼就能分辨。
 * 想换色只改这里，全站跟着变。
 */
export const categoryColors: Record<string, string> = {
	题解: "#6ea8fe", // 蓝
	算法笔记: "#a78bfa", // 紫
	数学: "#4ecdc4", // 青
	游记: "#f5a524", // 橙
	模板: "#f472b6", // 粉
	随笔: "#94a3b8", // 灰蓝
};

const fallback = "var(--primary)";

export function getCategoryColor(name?: string | null): string {
	const key = name?.trim();
	if (key && categoryColors[key]) return categoryColors[key];
	return fallback;
}

/** 分类标签的整套内联样式（底色 / 描边 / 文字色） */
export function getCategoryStyle(name?: string | null): string {
	const c = getCategoryColor(name);
	if (!c.startsWith("#")) return `color:${c}`;
	return `color:${c};background:${c}1f;border-color:${c}3d;`;
}

/** 小圆点、进度条这类只用前景色的地方 */
export function getCategoryDotStyle(name?: string | null): string {
	return `background:${getCategoryColor(name)}`;
}
