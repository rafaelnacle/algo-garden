import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

/** Fail the build when Pages would receive missing files or incorrectly rooted assets. */
export function verifyPagesBuild(basePath, directory = 'dist/pages') {
  const html = readFileSync(join(directory, 'index.html'), 'utf8');
  assert.ok(
    html.includes('id="root"'),
    'Static output must contain the React mount point.',
  );
  const prefix = `${basePath}/`;
  const references = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert.ok(
    references.some((url) => url.endsWith('.js')),
    'Missing JavaScript entry.',
  );
  assert.ok(
    references.some((url) => url.endsWith('.css')),
    'Missing stylesheet.',
  );
  for (const reference of references) {
    assert.ok(
      reference.startsWith(prefix),
      `Asset is outside the Pages base path: ${reference}`,
    );
    const path = resolve(directory, reference.slice(prefix.length));
    assert.ok(
      path.startsWith(`${resolve(directory)}/`),
      'Asset path escapes the static output.',
    );
    assert.ok(existsSync(path), `Missing static asset: ${reference}`);
  }
  const files = readdirSync(directory, { recursive: true });
  assert.ok(
    !files.some((file) =>
      /(?:^|\/)(?:server|node_modules|\.env)(?:\/|$)|\.map$/.test(String(file)),
    ),
    'Static artifact must not contain server files, dependencies, environment files, or source maps.',
  );
}
