import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			tags: z.array(z.string()).optional(),
			draft: z.boolean().optional(),
			author: z.string().optional(),
		}),
});

const changelog = defineCollection({
	loader: glob({ base: './src/content/changelog', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		type: z.enum(['feat', 'fix', 'docs', 'perf', 'other']),
		highlights: z.array(z.string()),
		version: z.string().optional(),
	}),
});

export const collections = { blog, changelog };
