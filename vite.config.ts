import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

function staticSitePlugin(): Plugin {
  const rootDir = process.cwd();
  return {
    name: 'static-site-css-and-copy',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || '').split('?')[0];
        if (url === '/style.css' && !req.url?.includes('import')) {
          const cssPath = path.join(rootDir, 'style.css');
          if (fs.existsSync(cssPath)) {
            res.setHeader('Content-Type', 'text/css; charset=utf-8');
            res.end(fs.readFileSync(cssPath, 'utf-8'));
            return;
          }
        }
        next();
      });
    },
    closeBundle() {
      const distDir = path.join(rootDir, 'dist');
      if (!fs.existsSync(distDir)) return;

      const copyRecursive = (src: string, dest: string) => {
        if (!fs.existsSync(src)) return;
        const stat = fs.statSync(src);
        if (stat.isDirectory()) {
          fs.mkdirSync(dest, { recursive: true });
          for (const entry of fs.readdirSync(src)) {
            copyRecursive(path.join(src, entry), path.join(dest, entry));
          }
        } else {
          fs.copyFileSync(src, dest);
        }
      };

      const entries = fs.readdirSync(rootDir);
      for (const entry of entries) {
        if (entry === 'index.html' || entry === 'dist' || entry === 'node_modules' || entry === 'src' || entry === 'supabase' || entry.startsWith('.')) {
          continue;
        }
        if (
          entry.endsWith('.html') ||
          entry.endsWith('.js') ||
          entry === 'style.css' ||
          entry === 'favicon.svg' ||
          entry === 'robots.txt' ||
          entry === 'sitemap.xml' ||
          entry === 'blog-data.json'
        ) {
          copyRecursive(path.join(rootDir, entry), path.join(distDir, entry));
        }
      }

      for (const dir of [
        'images',
        'pins',
        'product-category',
        'shop',
        'herringbone-chain-necklace-an-ultimate-guide',
        'how-to-clean-sterling-silver-at-home',
        'how-to-measure-ring-size-at-home',
        'how-to-untangle-a-necklace',
        'is-it-worth-buying-gold-plated-jewelry',
        'jewelry-to-wear-this-upcoming-fall',
        'what-earrings-are-trending-now',
        'why-does-gold-turn-skin-green',
      ]) {
        copyRecursive(path.join(rootDir, dir), path.join(distDir, dir));
      }

      const rawCss = path.join(rootDir, 'style.css');
      if (fs.existsSync(rawCss)) {
        fs.copyFileSync(rawCss, path.join(distDir, 'style.css'));
      }
    },
  };
}

export default defineConfig({
  plugins: [staticSitePlugin(), react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
});
