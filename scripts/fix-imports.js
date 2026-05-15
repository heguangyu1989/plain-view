// Post-process compiled JS files: add .js extension to relative imports.
// Required because tsc with moduleResolution:bundler omits file extensions.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join } from 'path';

const DIST = new URL('../dist', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) { walk(full); continue; }
    if (!name.endsWith('.js')) continue;

    let src = readFileSync(full, 'utf8');
    // Add .js to relative imports/exports that lack an extension
    src = src.replace(
      /((?:import|export)\s[^'"]*from\s+['"])(\.\.?\/[^'"]+?)(['"])/g,
      (_, prefix, path, suffix) => {
        if (/\.\w+$/.test(path)) return prefix + path + suffix;
        return prefix + path + '.js' + suffix;
      },
    );
    // Also fix dynamic import()
    src = src.replace(
      /(import\(['"])(\.\.?\/[^'"]+?)(['"]\))/g,
      (_, prefix, path, suffix) => {
        if (/\.\w+$/.test(path)) return prefix + path + suffix;
        return prefix + path + '.js' + suffix;
      },
    );
    writeFileSync(full, src);
  }
}

walk(DIST);
console.log('✓ Import paths fixed in dist/');
