# Astro View Transitions Documentation

**Source:** Context7 - /withastro/docs
**Last Updated:** 2025-01-24

## ClientRouter Component (Current/Recommended)

The `<ClientRouter />` component is the current way to enable view transitions in Astro.

### Basic Usage

```astro
---
import { ClientRouter } from 'astro:transitions';
---
<html lang="en">
  <head>
    <title>My Homepage</title>
    <ClientRouter />
  </head>
  <body>
    <h1>Welcome to my website!</h1>
  </body>
</html>
```

### Enable Site-Wide View Transitions

Include `ClientRouter` in a shared layout file:

```astro
---
// src/layouts/CommonHead.astro
import { ClientRouter } from "astro:transitions";
---
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<meta name="generator" content={Astro.generator} />

<!-- Primary Meta Tags -->
<title>{title}</title>
<meta name="title" content={title} />
<meta name="description" content={description} />

<ClientRouter />
```

### Fallback Configuration

Configure fallback behavior for browsers that don't support View Transitions API:

```astro
---
import { ClientRouter } from "astro:transitions";
---
<title>My site</title>

<ClientRouter fallback="swap" />
```

Setting `fallback="swap"` replaces old content immediately without animations.

## Transition Directives

### Built-in Animations

```astro
---
import CommonHead from "../components/CommonHead.astro";
---

<html transition:name="root" transition:animate="none">
  <head>
    <CommonHead />
  </head>
  <body>
    <header>
      ...
    </header>
    <main transition:animate="slide">
      ...
    </main>
  </body>
</html>
```

### Custom Animations with CSS

Define custom animations in your layout:

```astro
---
import { ClientRouter } from "astro:transitions";
---
<html lang="en">
  <head>
    <ClientRouter />
  </head>
  <body>
    <slot />
  </body>
</html>

<style is:global>
  @keyframes bump {
    0% {
      opacity: 0;
      transform: scale(1) translateX(200px);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.1);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateX(0);
    }
  }
</style>
```

## Key Points

- ✅ **Use `<ClientRouter />`** - This is the current API
- ✅ Import from `'astro:transitions'`
- ✅ Add to `<head>` section of pages or layouts
- ✅ Supports fallback for browsers without View Transitions API
- ✅ Compatible with transition directives and custom animations

## Migration from ViewTransitions

If you're using the old `<ViewTransitions />` component, update to:

```diff
---
- import { ViewTransitions } from 'astro:transitions';
+ import { ClientRouter } from 'astro:transitions';
---
<head>
- <ViewTransitions />
+ <ClientRouter />
</head>
```
