import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_TITLE } from '../../consts';

export async function GET(context) {
	const changelogEntries = await getCollection('changelog');

	return rss({
		title: `${SITE_TITLE} - Changelog`,
		description: 'Track all updates, features, and improvements to ClaudeCodeLab',
		site: context.site,
		items: changelogEntries
			.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
			.map((entry) => ({
				title: entry.data.title,
				pubDate: entry.data.date,
				description: entry.data.highlights.join(' • '),
				link: `/changelog/#${entry.data.version || entry.id}`,
				categories: [entry.data.type],
			})),
	});
}
