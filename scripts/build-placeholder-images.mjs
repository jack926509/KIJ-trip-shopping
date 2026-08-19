import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

/* 有些品項（例如滑鼠品牌研究卡）目前沒有實拍商品照，
   但卡片仍需要一張圖片檔（index.html 的 <img> 一律讀 product.image，
   驗證腳本也會檢查 images/thumb/<id>.webp 是否存在）。
   這支腳本從 images/placeholder-manifest.json 讀「品牌／型號／主色」，
   產生純文字版的品牌卡圖片，取代真實商品照。 */

const ROOT = process.cwd();
const manifest = JSON.parse(readFileSync(path.join(ROOT, 'images/placeholder-manifest.json'), 'utf8'));

mkdirSync(path.join(ROOT, 'images/thumb'), { recursive: true });
mkdirSync(path.join(ROOT, 'images/full'), { recursive: true });

function escapeXml(str) {
  return String(str).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
  }[ch]));
}

function hexToRgba(hex, alpha) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function cardSvg(size, { brand, title, color }) {
  const soft = hexToRgba(color, 0.1);
  const iconCx = size * 0.5;
  const iconCy = size * 0.36;
  const iconW = size * 0.22;
  const iconH = size * 0.3;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect x="0" y="0" width="${size}" height="${size}" fill="${soft}"/>
  <rect x="${size * 0.04}" y="${size * 0.04}" width="${size * 0.92}" height="${size * 0.92}" rx="${size * 0.05}"
        fill="none" stroke="${color}" stroke-width="${Math.max(2, size * 0.008)}"/>
  <g transform="translate(${iconCx - iconW / 2} ${iconCy - iconH / 2})">
    <rect x="0" y="0" width="${iconW}" height="${iconH}" rx="${iconW * 0.45}" fill="none" stroke="${color}" stroke-width="${Math.max(2, size * 0.01)}"/>
    <line x1="${iconW / 2}" y1="0" x2="${iconW / 2}" y2="${iconH * 0.42}" stroke="${color}" stroke-width="${Math.max(2, size * 0.008)}"/>
    <circle cx="${iconW / 2}" cy="${iconH * 0.24}" r="${iconW * 0.08}" fill="${color}"/>
  </g>
  <text x="50%" y="${size * 0.66}" text-anchor="middle" font-family="Liberation Sans, DejaVu Sans, sans-serif"
        font-weight="700" font-size="${size * 0.082}" fill="${color}">${escapeXml(brand)}</text>
  <text x="50%" y="${size * 0.735}" text-anchor="middle" font-family="Liberation Sans, DejaVu Sans, sans-serif"
        font-weight="400" font-size="${size * 0.052}" fill="#5a5a5a">${escapeXml(title)}</text>
  <text x="50%" y="${size * 0.93}" text-anchor="middle" font-family="WenQuanYi Zen Hei, DejaVu Sans, sans-serif"
        font-weight="400" font-size="${size * 0.04}" fill="#8a8a8a">品牌卡片・尚無實拍照片</text>
</svg>`;
}

let ok = 0;
for (const [id, spec] of Object.entries(manifest)) {
  await sharp(Buffer.from(cardSvg(400, spec))).webp({ quality: 90 }).toFile(path.join(ROOT, `images/thumb/${id}.webp`));
  await sharp(Buffer.from(cardSvg(1200, spec))).webp({ quality: 90 }).toFile(path.join(ROOT, `images/full/${id}.webp`));
  ok++;
}

console.log(`✓ 產生 ${ok} 組品牌卡片圖片（thumb/full 各一張）`);
