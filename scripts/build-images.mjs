import sharp from 'sharp';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const manifest = JSON.parse(readFileSync(path.join(ROOT, 'images/build-manifest.json'), 'utf8'));

mkdirSync(path.join(ROOT, 'images/thumb'), { recursive: true });
mkdirSync(path.join(ROOT, 'images/full'), { recursive: true });

let ok = 0;
let failed = [];

for (const [id, relSrc] of Object.entries(manifest)) {
  const srcPath = path.join(ROOT, relSrc);
  if (!existsSync(srcPath)) {
    failed.push(`${id}: 來源檔不存在（${relSrc}）`);
    continue;
  }
  try {
    await sharp(srcPath).resize({ width: 200, height: 200, fit: 'inside' }).webp({ quality: 82 })
      .toFile(path.join(ROOT, `images/thumb/${id}.webp`));
    await sharp(srcPath).resize({ width: 1200, height: 1200, fit: 'inside' }).webp({ quality: 85 })
      .toFile(path.join(ROOT, `images/full/${id}.webp`));
    ok++;
  } catch (err) {
    failed.push(`${id}: 轉檔失敗（${err.message}）`);
  }
}

console.log(`✓ 完成 ${ok} 項，thumb/full 各一張`);
if (failed.length > 0) {
  console.error(`✗ ${failed.length} 項失敗：`);
  failed.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}
