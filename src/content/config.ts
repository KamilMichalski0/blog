import { defineCollection, z } from 'astro:content';

// Blog collection schema
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().default(''),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    author: z.string().default('ClaudeCodeLab'),
    readingTime: z.number().optional(),
    category: z.enum(['tutorial', 'guide', 'deep-dive', 'integration', 'reference']).optional(),
    seoTitle: z.string().optional(),
    keywords: z.array(z.string()).default([]),
  }),
});

// Changelog collection schema
const changelog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    type: z.enum(['feat', 'fix', 'docs', 'perf', 'other']),
    highlights: z.array(z.string()),
    version: z.string().optional(),
  }),
});

// Export collections for Astro to use
export const collections = { blog, changelog };