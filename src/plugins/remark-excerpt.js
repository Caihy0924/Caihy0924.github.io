// biome-ignore lint/suspicious/noShadowRestrictedNames: <toString from mdast-util-to-string>
import { toString } from "mdast-util-to-string";

/* Use the post's first paragraph as the excerpt */
export function remarkExcerpt() {
	return (tree, { data }) => {
		let excerpt = "";
		for (const node of tree.children) {
			if (node.type !== "paragraph") {
				continue;
			}
			excerpt = toString(node);
			break;
		}
		// 摘要是纯文本，公式直接原样端出来会变成一串 \frac{...}，简单收拾成人能读的样子
		excerpt = excerpt
			.replace(/\$\$([^$]*)\$\$/g, " $1 ")
			.replace(/\$([^$]*)\$/g, " $1 ")
			.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, "$1/$2")
			.replace(/\\[a-zA-Z]+\s?/g, " ")
			.replace(/[{}]/g, "")
			.replace(/\s{2,}/g, " ")
			.trim();
		data.astro.frontmatter.excerpt = excerpt;
	};
}
