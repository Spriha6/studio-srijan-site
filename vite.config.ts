import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'

const SITE_URL = 'https://www.studiosrijan.com'
const PAGES = ['/', '/projects', '/about', '/team', '/principal-architect', '/location', '/contact']

/** Writes sitemap.xml at build time, with a page for every project slug in src/content.ts. */
function sitemap(): Plugin {
  return {
    name: 'sitemap',
    apply: 'build',
    generateBundle() {
      const content = readFileSync(new URL('./src/content.ts', import.meta.url), 'utf8')
      const slugs = [...content.matchAll(/^\s*slug: '([^']+)'/gm)].map((match) => `/projects/${match[1]}`)
      const urls = [...PAGES, ...slugs].map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`).join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves the site from /<repo-name>/; the deploy workflow sets BASE_PATH.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), sitemap()],
})
