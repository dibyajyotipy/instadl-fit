import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import fs from 'fs';

// Copy generated SEO Open Graph image on build/dev start
const ogSource = "C:/Users/Administrator/.gemini/antigravity-cli/brain/0efb2f43-3b99-45c2-a0d4-55ff5393743d/og_image_1781153477678.png";
const ogDestination = "./public/og-image.png";
try {
  if (fs.existsSync(ogSource)) {
    fs.copyFileSync(ogSource, ogDestination);
  }
} catch (e) {
  console.error("SEO Asset copy warning:", e);
}

// https://astro.build/config
export default defineConfig({
  site: 'https://instadl.online',

  output: 'static',

  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});