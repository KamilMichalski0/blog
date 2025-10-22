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
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    author: z.string().default('ClaudeCodeLab'),
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