import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const html = readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const outDir = path.join(ROOT, 'images/source');
mkdirSync(outDir, { recursive: true });

const articleRe = /<article\b([^>]*)>([\s\S]*?)<\/article>/g;
let match;
let extracted = 0;
const manifest = {};

while ((match = articleRe.exec(html))) {
  const [, attrs, body] = match;
  if (/class="[^"]*review-card/.test(attrs)) continue;
  if (/class="[^"]*\bshoe\b/.test(attrs)) continue;

  const idMatch = attrs.match(/\bid="([^"]+)"/);
  if (!idMatch) continue;
  const id = idMatch[1];

  const imgMatch = body.match(/<img[^>]+src="data:image\/([a-z]+);base64,([^"]+)"/);
  if (!imgMatch) continue; // 外部檔案圖片（7 張）不在此腳本處理範圍

  const [, ext, b64] = imgMatch;
  const fileExt = ext === 'jpeg' ? 'jpg' : ext;
  const outPath = path.join(outDir, `${id}.${fileExt}`);
  writeFileSync(outPath, Buffer.from(b64, 'base64'));
  manifest[id] = `images/source/${id}.${fileExt}`;
  extracted++;
}

console.log(`抽出 ${extracted} 張內嵌照片 → images/source/`);
console.log(JSON.stringify(manifest, null, 2));
