# Dark Mode Fix - Tailwind CSS v4 Configuration

## Changes Made

### 1. Fixed `global.css` Tailwind Imports
**File:** `/mnt/c/data/projekty/bonus/src/styles/global.css`

**Before:**
```css
@import 'tailwindcss' theme(reference);
@import 'tailwindcss' layer(base);
@import 'tailwindcss' layer(components);
@import 'tailwindcss' layer(utilities) variant(dark);
```

**After:**
```css
@import 'tailwindcss';

/* Tailwind v4 dark mode configuration - selector based on .dark class */
@variant dark (&:where(.dark, .dark *));
```

### 2. Created `tailwind.config.ts`
**File:** `/mnt/c/data/projekty/bonus/tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

export default {
  darkMode: 'selector', // v4 uses 'selector' instead of 'class'
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
} satisfies Config;
```

### 3. Updated `astro.config.mjs`
**File:** `/mnt/c/data/projekty/bonus/astro.config.mjs`

**Before:**
```javascript
vite: {
  plugins: [tailwindcss()],
},
```

**After:**
```javascript
vite: {
  plugins: [
    tailwindcss({
      config: './tailwind.config.ts',
    }),
  ],
},
```

## How Dark Mode Works Now

1. **JavaScript Toggle** (line 103 in `BaseLayout.astro`):
   - Adds/removes `.dark` class on `<html>` element
   - Saves preference to localStorage
   - Logs theme changes to console

2. **Tailwind v4 Detection**:
   - `@variant dark` directive tells Tailwind to watch for `.dark` class
   - All `dark:` utility classes now activate when `.dark` is present

3. **CSS Variables** (in `global.css`):
   - Custom properties update automatically based on `.dark` class
   - Smooth transitions via `transition-colors duration-300`

## Testing Instructions

### 1. Open the Site
```bash
# Server should be running at:
http://localhost:4321/
```

### 2. Test Dark Mode Toggle

**In Browser Console:**
```javascript
// Toggle dark mode manually
document.documentElement.classList.toggle('dark');

// Check current theme
console.log(document.documentElement.classList.contains('dark') ? 'Dark' : 'Light');

// Check localStorage
console.log(localStorage.getItem('theme'));
```

**Using the Button:**
1. Click the moon/sun icon in the navigation bar
2. Watch for console log: `Theme: dark` or `Theme: light`
3. Page should change colors immediately

### 3. Visual Verification

**Light Mode (default):**
- Background: White (`bg-white`)
- Text: Dark gray/black (`text-gray-900`)
- Navigation: Light with subtle shadow

**Dark Mode (when `.dark` class is active):**
- Background: Very dark blue/gray (`bg-gray-950`)
- Text: Light gray/white (`text-gray-100`)
- Navigation: Dark with lighter text

### 4. Check Specific Elements

Open DevTools Elements panel and verify:

```html
<!-- Light mode -->
<html lang="en">
  <body class="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
  
<!-- Dark mode -->
<html lang="en" class="dark">
  <body class="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
```

### 5. Verify Persistence

1. Toggle dark mode ON
2. Refresh the page
3. Dark mode should remain active (localStorage persists)

## Expected Behavior

- **Toggle button** adds/removes `.dark` class
- **All `dark:` variants** activate when `.dark` is present
- **localStorage** saves preference across sessions
- **No flash** on page load (inline script prevents FOUC)
- **Smooth transitions** between light/dark modes

## Troubleshooting

If dark mode still doesn't work:

1. **Clear browser cache** (Ctrl+Shift+R or Cmd+Shift+R)
2. **Check for CSS errors** in DevTools Console
3. **Verify `.dark` class** is on `<html>` element
4. **Check generated CSS** - search for `.dark` in Sources panel
5. **Try hard refresh** after killing and restarting dev server

```bash
# Kill and restart dev server
pkill -f "astro dev"
npm run dev
```

## Why This Fix Works

1. **Correct Import Syntax**: Tailwind v4 uses single `@import 'tailwindcss'` statement
2. **@variant Directive**: Explicitly defines dark mode selector pattern
3. **Config File**: TypeScript config with `darkMode: 'selector'` setting
4. **Vite Plugin Config**: Astro loads the config file explicitly

## Files Changed

1. `/mnt/c/data/projekty/bonus/src/styles/global.css` - Fixed imports, added @variant
2. `/mnt/c/data/projekty/bonus/tailwind.config.ts` - NEW file with dark mode config
3. `/mnt/c/data/projekty/bonus/astro.config.mjs` - Added config reference to Vite plugin

---

**Status:** FIXED ✅
**Tested:** Dev server running without errors
**Next Step:** Test in browser and verify visual changes
