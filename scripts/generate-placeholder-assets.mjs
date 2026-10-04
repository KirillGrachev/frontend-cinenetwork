/**
 * Generates local DEMO placeholder art for every /assets/** path referenced
 * by the mock fixtures, so the app looks complete in a fresh clone where the
 * real (copyrighted) artwork is not present.
 *
 *   node scripts/generate-placeholder-assets.mjs
 *
 * Output: public/assets/... — gitignored ON PURPOSE. Production deployments
 * ship real artwork; these gradients exist only for local development and
 * must never be committed (see .gitignore and README "Demo assets").
 *
 * Pure Node (zlib PNG encoder), deterministic: each title gets a stable hue
 * derived from its slug.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'assets');

/* ---------------- minimal PNG encoder ---------------- */

const CRC_TABLE = (() => {
    const table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        table[n] = c;
    }
    return table;
})();

function crc32(buf) {
    let c = -1;
    for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return (c ^ -1) >>> 0;
}

function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body));
    return Buffer.concat([len, body, crc]);
}

/** rgba: Uint8Array(width*height*4) */
function encodePng(width, height, rgba) {
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8; // bit depth
    ihdr[9] = 6; // color type RGBA
    const raw = Buffer.alloc(height * (width * 4 + 1));
    for (let y = 0; y < height; y++) {
        raw[y * (width * 4 + 1)] = 0; // filter: none
        rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
    }
    return Buffer.concat([
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        chunk('IHDR', ihdr),
        chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
        chunk('IEND', Buffer.alloc(0)),
    ]);
}

/* ---------------- colour helpers ---------------- */

function hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h;
}

function hslToRgb(h, s, l) {
    const a = s * Math.min(l, 1 - l);
    const f = (n) => {
        const k = (n + h / 30) % 12;
        return l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
    };
    return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

/** Vertical/diagonal gradient + soft radial glow + vignette. */
function paintGradient(width, height, hue, { diagonal = false, glow = true } = {}) {
    const rgba = Buffer.alloc(width * height * 4);
    const top = hslToRgb(hue, 0.55, 0.32);
    const bottom = hslToRgb((hue + 40) % 360, 0.65, 0.1);
    const glowColor = hslToRgb((hue + 20) % 360, 0.8, 0.55);
    const cx = width * 0.68;
    const cy = height * 0.3;
    const maxDist = Math.hypot(width, height);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const t = diagonal ? (x / width + y / height) / 2 : y / height;
            let r = top[0] + (bottom[0] - top[0]) * t;
            let g = top[1] + (bottom[1] - top[1]) * t;
            let b = top[2] + (bottom[2] - top[2]) * t;
            if (glow) {
                const d = Math.hypot(x - cx, y - cy) / maxDist;
                const w = Math.max(0, 1 - d * 2.2) ** 2 * 0.55;
                r += (glowColor[0] - r) * w;
                g += (glowColor[1] - g) * w;
                b += (glowColor[2] - b) * w;
            }
            // vignette towards the edges
            const vx = (x / width - 0.5) * 2;
            const vy = (y / height - 0.5) * 2;
            const v = 1 - Math.min(1, (vx * vx + vy * vy) * 0.35);
            const i = (y * width + x) * 4;
            rgba[i] = r * v;
            rgba[i + 1] = g * v;
            rgba[i + 2] = b * v;
            rgba[i + 3] = 255;
        }
    }
    return rgba;
}

/** White play-badge + abstract wordmark bars on transparent background. */
function paintLogo(width, height) {
    const rgba = Buffer.alloc(width * height * 4); // transparent
    const set = (x, y, a = 255) => {
        if (x < 0 || y < 0 || x >= width || y >= height) return;
        const i = (y * width + x) * 4;
        rgba[i] = 255;
        rgba[i + 1] = 255;
        rgba[i + 2] = 255;
        rgba[i + 3] = a;
    };
    const box = height; // square badge
    const r = box * 0.28;
    for (let y = 0; y < box; y++) {
        for (let x = 0; x < box; x++) {
            // rounded square
            const dx = Math.max(Math.abs(x - box / 2) - (box / 2 - r), 0);
            const dy = Math.max(Math.abs(y - box / 2) - (box / 2 - r), 0);
            if (Math.hypot(dx, dy) <= r) set(x, y);
        }
    }
    // punch a play triangle out of the badge
    const t0 = box * 0.3;
    const t1 = box * 0.78;
    for (let y = 0; y < box; y++) {
        for (let x = 0; x < box; x++) {
            const py = (y - box / 2) / (box / 2);
            const px = (x - box / 2) / (box / 2);
            const inside =
                px > t0 - 0.62 && px < t1 - 0.62 + 0.0 && Math.abs(py) < (0.62 - px) * 0.9;
            if (inside) {
                const i = (y * width + x) * 4;
                rgba[i + 3] = 0;
            }
        }
    }
    // abstract wordmark: three rounded bars
    const bars = [
        { x0: box + height * 0.25, w: height * 1.5, y0: height * 0.22, h: height * 0.2 },
        { x0: box + height * 2.0, w: height * 0.9, y0: height * 0.22, h: height * 0.2 },
        { x0: box + height * 0.25, w: height * 2.1, y0: height * 0.58, h: height * 0.2 },
    ];
    for (const bar of bars) {
        for (let y = Math.floor(bar.y0); y < bar.y0 + bar.h; y++) {
            for (let x = Math.floor(bar.x0); x < bar.x0 + bar.w; x++) set(x, y);
        }
    }
    return rgba;
}

/* ---------------- generation ---------------- */

const TITLES = [
    'attack-on-titan',
    'blue-lock',
    'bocchi-the-rock',
    'chainsaw-man',
    'cyberpunk-edgerunners',
    'demon-slayer',
    'frieren',
    'gachiakuta',
    'hells-paradise',
    'jujutsu-kaisen',
    'lycoris-recoil',
    'mushoku-tensei',
    'oshi-no-ko',
    'solo-leveling',
    'spy-x-family',
    'summertime-rendering',
    'undead-unluck',
    'vinland-saga',
];

function write(relPath, buffer) {
    const full = path.join(OUT, relPath);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, buffer);
}

let count = 0;
for (const slug of TITLES) {
    const hue = hash(slug) % 360;
    write(`${slug}/poster.jpeg`, encodePng(400, 600, paintGradient(400, 600, hue)));
    count++;
    write(
        `${slug}/cover.jpeg`,
        encodePng(800, 450, paintGradient(800, 450, hue, { diagonal: true })),
    );
    count++;
}
write('banners/1.jpeg', encodePng(1600, 900, paintGradient(1600, 900, 265, { diagonal: true })));
count++;
write('logo/white-cinenetwork.png', encodePng(480, 120, paintLogo(480, 120)));
count++;

console.log(`Generated ${count} placeholder assets under public/assets/ (gitignored).`);
