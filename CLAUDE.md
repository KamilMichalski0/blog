# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **ClaudeCodeLab**, an Astro-based blog platform with a focus on programming tutorials and learning content. The site is statically generated and deployed at `https://claudecodelab.com`.

## Development Commands

```bash
# Development server (runs on localhost:4321)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npx astro check

# Create new blog post (interactive CLI with auto-SEO)
npm run new:post

# Create new changelog entry (interactive CLI)
npm run new:changelog

# SEO Automation
npm run seo:audit              # Full SEO audit of all posts
npm run seo:reading-time       # Recalculate reading times
npm run seo:alt-text           # Generate alt text for images
npm run seo:download-images    # Download external images locally
```

## Tech Stack & Architecture

### Core Technologies
- **Astro 5** - Static site generator with file-based routing
- **Tailwind CSS v4** - Using `@tailwindcss/vite` plugin (note: v4 has different API than v3)
- **TypeScript** - Type-safe content collections and components
- **MDX** - Markdown with JSX for rich content

### Content Collections System

The project uses Astro's Content Collections API for type-safe content management. Schema definitions are in `src/content/config.ts`:

**Blog Collection** (`src/content/blog/`)
- Schema: `title`, `description`, `pubDate`, `updatedDate`, `heroImage`, `heroImageAlt`, `tags`, `draft`, `author`, `readingTime`, `category`, `seoTitle`, `keywords`
- Files are `.md` or `.mdx` with frontmatter
- Retrieved via `getCollection('blog')`
- **SEO Fields** (required for optimal SEO):
  - `heroImageAlt`: Alt text for hero image (accessibility + SEO)
  - `readingTime`: Estimated reading time in minutes (auto-calculated)
  - `category`: Post category (tutorial|guide|deep-dive|integration|reference)
  - `keywords`: Array of SEO keywords
  - `seoTitle`: Optional shorter title for search results (<60 chars)

**Changelog Collection** (`src/content/changelog/`)
- Schema: `title`, `date`, `type` (feat|fix|docs|perf|other), `highlights[]`, `version`
- Files follow naming pattern: `YYYY-MM-DD-slug.md`
- Automatically sorted by date (newest first) in `src/pages/changelog.astro:6-7`
- Types determine badge styling via `typeConfig` in `src/components/ChangelogItem.astro`

### Layout Architecture

**BaseLayout** (`src/layouts/BaseLayout.astro`)
- Root layout with navigation, footer, SEO meta tags, and dark mode
- Handles OpenGraph/Twitter card metadata
- Dark mode is selector-based (`.dark` class), defaulting to light mode
- Sticky navigation with mobile menu support
- Contains global scripts for theme persistence

**BlogPost Layout** (`src/layouts/BlogPost.astro`)
- Wraps BaseLayout for blog content
- Adds article-specific metadata and structured formatting

### Styling System

**Tailwind v4 Configuration**
- Uses `selector` dark mode (not `class` or `media`)
- Config in `tailwind.config.ts` - minimal config, relies on v4 defaults
- Vite plugin configured in `astro.config.mjs`

**Global Styles** (`src/styles/global.css`)
- CSS custom properties for design tokens (colors, shadows, gradients)
- Typography scale with Space Grotesk (headings) + Inter (body)
- Component utilities: `.btn-primary`, `.btn-secondary`, `.card`, `.badge-*`
- Special `.prose-content` class for blog post text with high-specificity dark mode rules
- Accessibility features: reduced motion support, high contrast mode, focus states

**Design Tokens**
```css
--color-accent: 99 102 241      /* Indigo primary */
--gradient-primary: 135deg, #667eea → #764ba2
--gradient-hero: #667eea → #764ba2 → #f093fb
```

### Pages & Routing

- `index.astro` - Homepage
- `blog/` - Auto-generated from `src/content/blog/` via `src/pages/blog/[...slug].astro`
- `changelog.astro` - Pulls from changelog collection, displays timeline
- `about.astro` - About page
- `design-system.astro` - Component showcase/documentation

### Important Implementation Details

**Dark Mode**
- Implemented via inline script in `BaseLayout.astro:55-71` (runs before page paint)
- Defaults to light mode unless `localStorage.theme === 'dark'`
- Toggle button at `BaseLayout.astro:102-116`

**Content Creation Scripts**
- `scripts/new-blog-post.mjs` - Interactive CLI for creating blog posts
- `scripts/new-changelog.mjs` - Interactive CLI for changelog entries
- Both use slugification and auto-generate frontmatter templates

**Build Configuration**
- Static output mode (`output: 'static'`)
- Sitemap auto-generated for `https://claudecodelab.com`
- Markdown uses `github-dark` syntax theme
- Image optimization via Sharp

## Content Management

### Adding Blog Posts

**Recommended workflow:**

1. **Create post with auto-SEO:**
   ```bash
   npm run new:post
   ```
   This automatically generates:
   - `heroImageAlt` based on title + first tag
   - `readingTime: 1` (placeholder)
   - All required SEO fields

2. **Write your content** in the generated `.md` file

3. **After writing, run SEO automation:**
   ```bash
   # Recalculate actual reading time
   npm run seo:reading-time

   # If you used an external heroImage URL, download it locally
   npm run seo:download-images

   # Optional: Regenerate alt text if title changed
   npm run seo:alt-text
   ```

4. **Optional: Run full SEO audit**
   ```bash
   npm run seo:audit
   ```
   Reports saved to `seo-reports/seo-audit.md`

**Manual creation:**

1. Create `.md` file in `src/content/blog/`
2. Include required frontmatter:
   - `title` (string)
   - `pubDate` (YYYY-MM-DD)
   - `heroImage` (string, local path preferred)
   - `heroImageAlt` (string, for accessibility)
   - `tags` (array)
   - `readingTime` (number, in minutes)
3. Optional: `description`, `draft: true`, `author`, `category`, `seoTitle`, `keywords`

### Adding Changelog Entries

1. Use `npm run new:changelog` for interactive creation, OR
2. Create `YYYY-MM-DD-slug.md` in `src/content/changelog/`
3. Required frontmatter: `title`, `date`, `type`, `highlights[]`
4. Type must be one of: `feat`, `fix`, `docs`, `perf`, `other`
5. Entries auto-sort by date on `/changelog` page

## Common Patterns

### Fetching Content
```astro
import { getCollection } from 'astro:content';

// Get all blog posts
const posts = await getCollection('blog');

// Filter drafts in production
const published = posts.filter(p => !p.data.draft);

// Sort by date
const sorted = posts.sort((a, b) =>
  b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
```

### Using Design System Components
- Use `.btn-primary` for primary CTAs (has gradient background)
- Use `.btn-secondary` for secondary actions
- Use `.card` for content containers (includes hover lift effect)
- Use `.badge-success`, `.badge-danger`, etc. for status indicators
- Use `.container-content` for max-width content wrapper
- Use `.section` for consistent vertical spacing

### SEO Metadata
All pages should use `BaseLayout` with proper props:
```astro
<BaseLayout
  title="Page Title"
  description="Page description for meta tags"
  image="/custom-og-image.jpg"  // optional
  type="article"                 // or "website"
  publishDate={date}             // for articles
/>
```

## Gotchas & Important Notes

1. **Tailwind v4 differences**: Uses Vite plugin, not PostCSS. Config is minimal. Import via `@import 'tailwindcss'` in CSS.

2. **Dark mode selector**: Must use `.dark` class on `<html>`, not `dark:` variants won't work with `media` or `class` strategy.

3. **Prose content colors**: Blog post text requires `.prose-content` class for proper dark mode colors due to Tailwind typography plugin specificity issues.

4. **Content collections are type-checked**: Running `npx astro check` will validate frontmatter against schemas in `src/content/config.ts`.

5. **Static site generation**: All content is built at compile time. No server-side rendering or API routes.

6. **Image paths**: Images in `/public` are served from root (e.g., `/blog-placeholder-1.jpg`, not `/public/...`)

7. **Changelog updates are manual**: No automated changelog generation. Must create files in `src/content/changelog/` manually or via `npm run new:changelog`.
