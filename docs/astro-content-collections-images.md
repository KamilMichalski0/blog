# Astro Content Collections - Image Handling

**Source:** Context7 - /withastro/docs
**Last Updated:** 2025-01-24

## Using image() Helper in Content Collections

The `image()` helper from `astro:content` provides proper validation and transformation for images in Content Collections.

### Basic Schema Definition

```typescript
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    heroImage: image().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

### With Alt Text

```typescript
import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  schema: ({ image }) => z.object({
    title: z.string(),
    cover: image(),
    coverAlt: z.string(),
  }),
});

export const collections = {
  blog: blogCollection,
};
```

### Reusable Image Schema

```typescript
import { defineCollection, z, type SchemaContext } from "astro:content";

export const imageSchema = ({ image }: SchemaContext) =>
  z.object({
    image: image(),
    description: z.string().optional(),
  });

const blog = defineCollection({
  loader: /* ... */,
  schema: ({ image }) => z.object({
    title: z.string(),
    permalink: z.string().optional(),
    image: imageSchema({ image })
  }),
});
```

## Using Images in Frontmatter

### Markdown Files

```markdown
---
title: "My first blog post"
cover: "./firstpostcover.jpeg" # Relative to current folder
coverAlt: "A photograph of a sunset behind a mountain range."
---

This is a blog post
```

The path resolves relative to the content file:
- `./firstpostcover.jpeg` → `src/content/blog/firstpostcover.jpeg`

### Displaying Images in Components

```astro
---
import { Image } from "astro:assets";
import { getCollection } from "astro:content";

const allBlogPosts = await getCollection("blog");
---

{
  allBlogPosts.map((post) => (
    <div>
      <Image src={post.data.cover} alt={post.data.coverAlt} />
      <h2>
        <a href={"/blog/" + post.slug}>{post.data.title}</a>
      </h2>
    </div>
  ))
}
```

## Benefits of image() Helper

✅ **Type Safety** - Proper TypeScript types for image metadata
✅ **Validation** - Ensures image paths exist and are valid
✅ **Transformation** - Converts paths to ImageMetadata objects
✅ **Integration** - Works seamlessly with `astro:assets` Image component
✅ **Optimization** - Enables automatic image optimization

## Migration from string to image()

### Before (using string)

```typescript
const blog = defineCollection({
  schema: z.object({
    heroImage: z.string().optional(),
  }),
});
```

### After (using image() helper)

```typescript
const blog = defineCollection({
  schema: ({ image }) => z.object({
    heroImage: image().optional(),
  }),
});
```

## Important Notes

- The `image()` helper must be accessed from the schema context parameter
- Use relative paths (`./image.png`) or paths relative to `src/` in frontmatter
- Images are validated at build time
- Works with local images only (not remote URLs in this context)
