import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getCategoryUrl } from "@utils/url-utils.ts";

// // Retrieve posts and sort them by publication date
async function getRawSortedPosts() {
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const sorted = allBlogPosts.sort((a, b) => {
		// 置顶的文章永远排在前面
		const pinA = a.data.pinned ? 1 : 0;
		const pinB = b.data.pinned ? 1 : 0;
		if (pinA !== pinB) return pinB - pinA;

		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
	return sorted;
}

export async function getSortedPosts() {
	const sorted = await getRawSortedPosts();

	for (let i = 1; i < sorted.length; i++) {
		sorted[i].data.nextSlug = sorted[i - 1].slug;
		sorted[i].data.nextTitle = sorted[i - 1].data.title;
	}
	for (let i = 0; i < sorted.length - 1; i++) {
		sorted[i].data.prevSlug = sorted[i + 1].slug;
		sorted[i].data.prevTitle = sorted[i + 1].data.title;
	}

	return sorted;
}
export type PostForList = {
	slug: string;
	data: CollectionEntry<"posts">["data"];
};
export async function getSortedPostsList(): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedPosts();

	// delete post.body
	const sortedPostsList = sortedFullPosts.map((post) => ({
		slug: post.slug,
		data: post.data,
	}));

	return sortedPostsList;
}
export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(): Promise<Tag[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const countMap: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { tags: string[] } }) => {
		post.data.tags.forEach((tag: string) => {
			if (!countMap[tag]) countMap[tag] = 0;
			countMap[tag]++;
		});
	});

	// sort tags
	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export async function getCategoryList(): Promise<Category[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	const count: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { category: string | null } }) => {
		if (!post.data.category) {
			const ucKey = i18n(I18nKey.uncategorized);
			count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
			return;
		}

		const categoryName =
			typeof post.data.category === "string"
				? post.data.category.trim()
				: String(post.data.category).trim();

		count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
	});

	const lst = Object.keys(count).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	const ret: Category[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			url: getCategoryUrl(c),
		});
	}
	return ret;
}

// ───────── 站点统计（给侧栏挂件用）─────────
export type SiteStats = {
	posts: number;
	categories: number;
	tags: number;
	words: number;
	since: Date;
	lastUpdate: Date;
};

// 每页都会渲染一次挂件，所以整体只算一次，缓存在模块作用域里
let siteStatsPromise: Promise<SiteStats> | null = null;

async function computeSiteStats(): Promise<SiteStats> {
	const entries = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	let words = 0;
	for (const entry of entries) {
		try {
			const { remarkPluginFrontmatter } = await entry.render();
			words += Number(remarkPluginFrontmatter?.words ?? 0);
		} catch {
			// 单篇渲染失败不影响整体统计
		}
	}

	const times = entries
		.map((e) => new Date(e.data.published).getTime())
		.filter((t) => !Number.isNaN(t));

	const since = times.length ? new Date(Math.min(...times)) : new Date();
	const lastUpdate = times.length ? new Date(Math.max(...times)) : new Date();

	const categories = new Set(
		entries.map((e) => (e.data.category ?? "").trim()).filter(Boolean),
	);
	const tags = new Set(entries.flatMap((e) => e.data.tags ?? []));

	return {
		posts: entries.length,
		categories: categories.size,
		tags: tags.size,
		words,
		since,
		lastUpdate,
	};
}

export function getSiteStats(): Promise<SiteStats> {
	if (!siteStatsPromise) {
		siteStatsPromise = computeSiteStats();
	}
	return siteStatsPromise;
}
