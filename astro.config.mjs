// @ts-check

import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Blog stoi na tej subdomenie. Wczesniej bylo tu claudecodelab.com, ktora nie
  // odpowiada (adres parkingowy), przez co canonical, og:url, og:image i cala
  // sitemapa wskazywaly na martwa domene.
  site: 'https://blog.claudecodelab.pl',
  integrations: [
    mdx(),
    sitemap(),
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
});