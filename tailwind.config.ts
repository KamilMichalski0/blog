import type { Config } from 'tailwindcss';

export default {
  darkMode: 'selector', // v4 uses 'selector' instead of 'class'
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
} satisfies Config;
