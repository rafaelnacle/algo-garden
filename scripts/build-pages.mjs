import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { verifyPagesBuild } from './verify-pages.mjs';

const { values } = parseArgs({ options: { 'base-path': { type: 'string' } } });
const basePath = (
  values['base-path'] ??
  process.env.PAGES_BASE_PATH ??
  ''
).replace(/\/$/, '');
if (basePath !== '' && !/^\/(?!\.{1,2}$)[A-Za-z0-9._-]+$/.test(basePath)) {
  throw new Error(
    'Use an empty base path for a root site, or /repository-name for a project site.',
  );
}

const build = spawnSync(
  process.execPath,
  ['node_modules/vite/bin/vite.js', 'build', '--config', 'vite.config.ts'],
  {
    stdio: 'inherit',
    env: { ...process.env, PAGES_BASE_PATH: basePath },
  },
);
if (build.error) throw build.error;
if (build.status !== 0) process.exit(build.status ?? 1);
writeFileSync('dist/pages/.nojekyll', '');
verifyPagesBuild(basePath);
console.log(`GitHub Pages files: dist/pages (base path: ${basePath || '/'})`);
