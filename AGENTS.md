# Repository Guidelines

## Project Structure & Module Organization
The Astro blog lives in `src/`, with route files under `src/pages/` and content collections in `src/content/` (blogs and changelog schemas defined in `content.config.ts`). Shared view logic sits in `src/components/` and `src/layouts/`, while design tokens live in `src/styles/` and static assets in `src/assets/`. Publicly served files (favicons, robots) belong in `public/`. Feature documentation and design notes are stored in `docs/`. Generated builds land in `dist/`—useful for local inspection but never commit. Automation scripts for creating posts and changelog entries reside in `scripts/`.

## Build, Test, and Development Commands
- `npm install`: install or update dependencies.
- `npm run dev`: start Astro dev server at http://localhost:4321 with hot reloading.
- `npm run build`: compile the production bundle into `dist/`; run before deploying.
- `npm run preview`: serve the built output to smoke-test production assets.
- `npm run astro check`: run Astro’s type and content validator; fails on schema or MDX frontmatter issues.
- `npm run new:post "My Title"` / `npm run new:changelog "v1.2.3"`: scaffolds content files in the appropriate collection.

## Coding Style & Naming Conventions
Prettier with the Astro plugin is the source of truth; format using `npx prettier --write "src/**/*.{astro,ts,mdx}"`. Use two-space indentation, trailing commas, and single quotes in TypeScript to match existing files. Name Astro components and layouts with `PascalCase.astro`, utility modules in camelCase, and content slugs in lowercase kebab-case (e.g., `interstellar-updates`). Favor semantic HTML wrapped with Tailwind utility classes; group related classnames logically.

## Testing Guidelines
This project relies on Astro’s build-time guarantees. Run `npm run astro check` and `npm run build` before opening a PR to catch schema and bundling regressions. For major UI changes, add screenshots in `docs/` or link to contrast audits already tracked in `IMAGES_TODO.md`. Prefer manual verification in the dev server for interactive components.

## Commit & Pull Request Guidelines
Git history mixes terse messages (`fix`) with Conventional prefixes (`fix:`, `chore:`); standardize on Conventional Commits (`type: summary`) so release tooling stays predictable. Keep subject lines under 72 characters and describe intent, not mechanics. Avoid committing generated files (`dist/`, screenshots) unless they are part of the change log. PRs should include: concise summary, linked issue or task ID, testing notes (commands from above), and visuals for UI shifts. Request review from a code owner whenever content or layout changes impact production pages.
