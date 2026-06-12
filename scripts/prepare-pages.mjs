import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = 'dist';
const replacements = [
  ['"/_expo/', '"./_expo/'],
  ["'/_expo/", "'./_expo/"],
  ['"/assets/', '"./assets/'],
  ["'/assets/", "'./assets/"],
  ['url(/assets/', 'url(./assets/'],
];

async function* files(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      yield* files(path);
      continue;
    }

    yield path;
  }
}

for await (const file of files(root)) {
  if (!/\.(html|js|css)$/.test(file)) {
    continue;
  }

  let content = await readFile(file, 'utf8');
  const original = content;

  for (const [from, to] of replacements) {
    content = content.split(from).join(to);
  }

  if (content !== original) {
    await writeFile(file, content);
  }
}

await writeFile(join(root, '.nojekyll'), '');
