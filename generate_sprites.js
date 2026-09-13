const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// --- Helper PNG Encoder ---
function calcCRC32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
        let c = (crc ^ buf[i]) & 0xff;
        for (let k = 0; k < 8; k++) {
            c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
        }
        crc = (crc >>> 8) ^ c;
    }
    return (crc ^ -1) >>> 0;
}

function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const crcVal = calcCRC32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(crcVal, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePNG(width, height, rgbaBuffer) {
    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    
    // IHDR
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8;  // bit depth
    ihdr[9] = 6;  // RGBA
    ihdr[10] = 0; // compression
    ihdr[11] = 0; // filter
    ihdr[12] = 0; // interlace
    const ihdrChunk = makeChunk('IHDR', ihdr);

    // IDAT
    const rawScanlines = Buffer.alloc(height * (width * 4 + 1));
    for (let y = 0; y < height; y++) {
        rawScanlines[y * (width * 4 + 1)] = 0; // Filter none
        const srcOffset = y * width * 4;
        const dstOffset = y * (width * 4 + 1) + 1;
        rgbaBuffer.copy(rawScanlines, dstOffset, srcOffset, srcOffset + width * 4);
    }
    const compressedData = zlib.deflateSync(rawScanlines);
    const idatChunk = makeChunk('IDAT', compressedData);

    // IEND
    const iendChunk = makeChunk('IEND', Buffer.alloc(0));

    return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// --- Pixel Canvas Helper Class ---
class PixelCanvas {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.buffer = Buffer.alloc(width * height * 4); // RGBA (initialized 0)
    }

    hexToRgba(hex, alpha = 255) {
        hex = hex.replace('#', '');
        if (hex.length === 3) {
            hex = hex.split('').map(c => c + c).join('');
        }
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return [r, g, b, alpha];
    }

    setPixel(x, y, color, alpha = 255) {
        x = Math.round(x);
        y = Math.round(y);
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
        const idx = (y * this.width + x) * 4;
        let [r, g, b, a] = typeof color === 'string' ? this.hexToRgba(color, alpha) : color;
        
        // Simple alpha blending if pixel is partially transparent
        if (a < 255 && this.buffer[idx + 3] > 0) {
            const srcA = a / 255;
            const dstA = this.buffer[idx + 3] / 255;
            const outA = srcA + dstA * (1 - srcA);
            this.buffer[idx] = Math.round((r * srcA + this.buffer[idx] * dstA * (1 - srcA)) / outA);
            this.buffer[idx + 1] = Math.round((g * srcA + this.buffer[idx + 1] * dstA * (1 - srcA)) / outA);
            this.buffer[idx + 2] = Math.round((b * srcA + this.buffer[idx + 2] * dstA * (1 - srcA)) / outA);
            this.buffer[idx + 3] = Math.round(outA * 255);
        } else {
            this.buffer[idx] = r;
            this.buffer[idx + 1] = g;
            this.buffer[idx + 2] = b;
            this.buffer[idx + 3] = a;
        }
    }

    fillRect(x, y, w, h, color) {
        for (let py = Math.floor(y); py < Math.floor(y + h); py++) {
            for (let px = Math.floor(x); px < Math.floor(x + w); px++) {
                this.setPixel(px, py, color);
            }
        }
    }

    fillCircle(cx, cy, r, color) {
        cx = Math.floor(cx);
        cy = Math.floor(cy);
        for (let y = -r; y <= r; y++) {
            for (let x = -r; x <= r; x++) {
                if (x * x + y * y <= r * r) {
                    this.setPixel(cx + x, cy + y, color);
                }
            }
        }
    }

    fillEllipse(cx, cy, rx, ry, color) {
        for (let y = -ry; y <= ry; y++) {
            for (let x = -rx; x <= rx; x++) {
                if ((x * x) / (rx * rx) + (y * y) / (ry * ry) <= 1) {
                    this.setPixel(Math.floor(cx + x), Math.floor(cy + y), color);
                }
            }
        }
    }

    strokeRect(x, y, w, h, color) {
        for (let px = x; px < x + w; px++) {
            this.setPixel(px, y, color);
            this.setPixel(px, y + h - 1, color);
        }
        for (let py = y; py < y + h; py++) {
            this.setPixel(x, py, color);
            this.setPixel(x + w - 1, py, color);
        }
    }

    savePNG(filePath) {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const pngBuf = encodePNG(this.width, this.height, this.buffer);
        fs.writeFileSync(filePath, pngBuf);
        console.log(`Saved PNG: ${filePath} (${pngBuf.length} bytes)`);
    }
}

// --- Character Sprite Sheet Generator ---
// Sprite sheet size: 128x192 px (4 cols x 4 rows of 32x48 px cells)
function generateCharacterSheet(charConfig, outputPath) {
    const sheet = new PixelCanvas(128, 192);
    
    // Rows: 0=DOWN, 1=LEFT, 2=RIGHT, 3=UP
    // Cols: 0=Idle, 1=Step A, 2=Idle/Center, 3=Step B
    const directions = ['down', 'left', 'right', 'up'];
    
    for (let r = 0; r < 4; r++) {
        const dir = directions[r];
        for (let c = 0; c < 4; c++) {
            const offsetX = c * 32;
            const offsetY = r * 48;
            drawCharacterFrame(sheet, offsetX, offsetY, dir, c, charConfig);
        }
    }
    
    sheet.savePNG(outputPath);
}

function drawCharacterFrame(canvas, ox, oy, dir, frameIdx, cfg) {
    // Animation offsets
    let bobY = 0;
    let legOffsetL = 0;
    let legOffsetR = 0;
    let armSwingL = 0;
    let armSwingR = 0;

    if (frameIdx === 1) { // Step A
        bobY = -1;
        legOffsetL = -2;
        legOffsetR = 2;
        armSwingL = 2;
        armSwingR = -2;
    } else if (frameIdx === 3) { // Step B
        bobY = -1;
        legOffsetL = 2;
        legOffsetR = -2;
        armSwingL = -2;
        armSwingR = 2;
    } else if (frameIdx === 2) {
        bobY = 0;
    }

    const headY = oy + 6 + bobY;
    const bodyY = oy + 25 + bobY;
    const feetY = oy + 40;

    // Palette Colors
    const skin = cfg.skin || '#fde0c7';
    const skinShadow = cfg.skinShadow || '#f8b896';
    const hair = cfg.hair || '#451a03';
    const hairHighlight = cfg.hairHighlight || '#78350f';
    const outline = '#1e1b4b'; // Dark crisp outline
    const eyeColor = cfg.eyeColor || '#0f172a';
    
    const shirt = cfg.shirt || '#ffffff';
    const shirtShadow = cfg.shirtShadow || '#cbd5e1';
    const tie = cfg.tie || '#1e293b';
    const pants = cfg.pants || '#1e293b';
    const shoes = cfg.shoes || '#0f172a';
    const bag = cfg.bag || '#2563eb';
    const bagShadow = cfg.bagShadow || '#1d4ed8';
    const accessory = cfg.accessory || null;

    // ----------------------------------------------------
    // 1. FEET & SHOES
    // ----------------------------------------------------
    if (dir === 'down' || dir === 'up') {
        let lx = ox + 9 + legOffsetL;
        let rx = ox + 17 + legOffsetR;
        if (dir === 'down') {
            canvas.fillRect(lx, feetY, 6, 5, shoes);
            canvas.fillRect(rx, feetY, 6, 5, shoes);
            canvas.fillRect(lx + 1, feetY + 1, 4, 2, '#475569'); // shoe highlight
            canvas.fillRect(rx + 1, feetY + 1, 4, 2, '#475569');
        } else {
            canvas.fillRect(lx, feetY, 6, 5, shoes);
            canvas.fillRect(rx, feetY, 6, 5, shoes);
        }
    } else if (dir === 'left') {
        let lx = ox + 11 + legOffsetL;
        let rx = ox + 15 + legOffsetR;
        canvas.fillRect(lx, feetY, 6, 5, shoes);
        canvas.fillRect(rx, feetY, 6, 5, shoes);
    } else if (dir === 'right') {
        let lx = ox + 11 + legOffsetL;
        let rx = ox + 15 + legOffsetR;
        canvas.fillRect(lx, feetY, 6, 5, shoes);
        canvas.fillRect(rx, feetY, 6, 5, shoes);
    }

    // ----------------------------------------------------
    // 2. TROUSERS / LEGS
    // ----------------------------------------------------
    if (dir === 'down' || dir === 'up') {
        canvas.fillRect(ox + 10 + legOffsetL, feetY - 6, 5, 6, pants);
        canvas.fillRect(ox + 17 + legOffsetR, feetY - 6, 5, 6, pants);
    } else {
        canvas.fillRect(ox + 12 + legOffsetL, feetY - 6, 8, 6, pants);
    }

    // ----------------------------------------------------
    // 3. BACKPACK (Drawn under/over body depending on direction)
    // ----------------------------------------------------
    if (bag && dir === 'up') {
        // Full backpack view from behind
        canvas.fillEllipse(ox + 16, bodyY + 6, 8, 9, bag);
        canvas.strokeRect(ox + 9, bodyY - 1, 14, 15, outline);
        canvas.fillRect(ox + 11, bodyY + 8, 10, 3, bagShadow);
        canvas.fillRect(ox + 13, bodyY + 3, 6, 2, '#f59e0b'); // zipper
    } else if (bag && (dir === 'left' || dir === 'right')) {
        let bx = (dir === 'left') ? ox + 18 : ox + 6;
        canvas.fillEllipse(bx + 4, bodyY + 5, 5, 7, bag);
        canvas.fillRect(bx + 2, bodyY + 7, 5, 2, bagShadow);
    }

    // ----------------------------------------------------
    // 4. BODY & TORSO (Kemeja Putih / Uniform)
    // ----------------------------------------------------
    let torsoW = (dir === 'down' || dir === 'up') ? 14 : 12;
    let torsoX = ox + 16 - torsoW / 2;

    // Body Outline
    canvas.fillRect(torsoX - 1, bodyY - 1, torsoW + 2, 14, outline);
    // Shirt Fill
    canvas.fillRect(torsoX, bodyY, torsoW, 12, shirt);
    // Shadow at bottom of shirt
    canvas.fillRect(torsoX, bodyY + 9, torsoW, 3, shirtShadow);

    // Front Details (Tie, Collar, Lanyard)
    if (dir === 'down') {
        // Collar V-neck
        canvas.fillRect(ox + 14, bodyY, 4, 3, skin);
        canvas.fillRect(ox + 13, bodyY, 2, 2, shirt);
        canvas.fillRect(ox + 17, bodyY, 2, 2, shirt);
        // Tie
        if (tie) {
            canvas.fillRect(ox + 15, bodyY + 2, 2, 8, tie);
            canvas.setPixel(ox + 15, bodyY + 9, tie);
        }
        // Lanyard ID Badge if Pak Andi
        if (cfg.lanyard) {
            canvas.fillRect(ox + 13, bodyY + 1, 6, 6, '#38bdf8');
            canvas.fillRect(ox + 14, bodyY + 4, 4, 4, '#ffffff');
        }
        // Clipboard if Bu Sari
        if (cfg.clipboard) {
            canvas.fillRect(ox + 20, bodyY + 2, 6, 8, '#f59e0b');
            canvas.fillRect(ox + 21, bodyY + 3, 4, 6, '#ffffff');
        }
    } else if (dir === 'left' || dir === 'right') {
        let sideCollarX = (dir === 'left') ? ox + 11 : ox + 19;
        canvas.setPixel(sideCollarX, bodyY + 1, skin);
        if (tie) {
            canvas.fillRect(sideCollarX, bodyY + 2, 2, 6, tie);
        }
        if (cfg.book) { // Rika holding book
            let bx = (dir === 'left') ? ox + 8 : ox + 18;
            canvas.fillRect(bx, bodyY + 4, 6, 7, '#ef4444');
            canvas.fillRect(bx + 1, bodyY + 5, 4, 5, '#ffffff');
        }
    }

    // Backpack Straps (Front View)
    if (bag && dir === 'down') {
        canvas.fillRect(ox + 10, bodyY + 1, 2, 10, bag);
        canvas.fillRect(ox + 20, bodyY + 1, 2, 10, bag);
    }

    // ARMS
    if (dir === 'down' || dir === 'up') {
        canvas.fillRect(ox + 7, bodyY + 1 + armSwingL, 3, 8, shirt);
        canvas.fillRect(ox + 7, bodyY + 7 + armSwingL, 3, 2, skin);
        canvas.fillRect(ox + 22, bodyY + 1 + armSwingR, 3, 8, shirt);
        canvas.fillRect(ox + 22, bodyY + 7 + armSwingR, 3, 2, skin);
    } else if (dir === 'left') {
        canvas.fillRect(ox + 14 + armSwingL, bodyY + 1, 3, 8, shirt);
        canvas.fillRect(ox + 14 + armSwingL, bodyY + 7, 3, 2, skin);
    } else if (dir === 'right') {
        canvas.fillRect(ox + 15 + armSwingR, bodyY + 1, 3, 8, shirt);
        canvas.fillRect(ox + 15 + armSwingR, bodyY + 7, 3, 2, skin);
    }

    // ----------------------------------------------------
    // 5. CHIBI HEAD & FACE
    // ----------------------------------------------------
    const headW = 20;
    const headH = 18;
    const headX = ox + 16 - headW / 2;

    // Head Outline
    canvas.fillEllipse(ox + 16, headY + 8, 11, 10, outline);
    // Base Skin Face
    canvas.fillEllipse(ox + 16, headY + 8, 10, 9, skin);
    // Cheek Blush
    if (dir === 'down' || dir === 'left' || dir === 'right') {
        if (dir === 'down') {
            canvas.fillRect(ox + 9, headY + 11, 3, 2, '#fda4af');
            canvas.fillRect(ox + 20, headY + 11, 3, 2, '#fda4af');
        } else if (dir === 'left') {
            canvas.fillRect(ox + 9, headY + 11, 3, 2, '#fda4af');
        } else if (dir === 'right') {
            canvas.fillRect(ox + 20, headY + 11, 3, 2, '#fda4af');
        }
    }

    // EYES (Cute Chibi Pixel Eyes)
    if (dir === 'down') {
        // Left Eye
        canvas.fillRect(ox + 10, headY + 8, 3, 4, eyeColor);
        canvas.setPixel(ox + 10, headY + 8, '#ffffff'); // Highlight dot
        // Right Eye
        canvas.fillRect(ox + 19, headY + 8, 3, 4, eyeColor);
        canvas.setPixel(ox + 19, headY + 8, '#ffffff');
        // Cute Smile
        canvas.setPixel(ox + 15, headY + 13, '#e11d48');
        canvas.setPixel(ox + 16, headY + 13, '#e11d48');
    } else if (dir === 'left') {
        canvas.fillRect(ox + 9, headY + 8, 3, 4, eyeColor);
        canvas.setPixel(ox + 9, headY + 8, '#ffffff');
        canvas.setPixel(ox + 12, headY + 13, '#e11d48');
    } else if (dir === 'right') {
        canvas.fillRect(ox + 20, headY + 8, 3, 4, eyeColor);
        canvas.setPixel(ox + 20, headY + 8, '#ffffff');
        canvas.setPixel(ox + 19, headY + 13, '#e11d48');
    }

    // GLASSES if Pak Andi
    if (cfg.glasses && (dir === 'down' || dir === 'left' || dir === 'right')) {
        if (dir === 'down') {
            canvas.strokeRect(ox + 9, headY + 7, 5, 5, '#475569');
            canvas.strokeRect(ox + 18, headY + 7, 5, 5, '#475569');
            canvas.fillRect(ox + 14, headY + 8, 4, 1, '#475569');
        } else if (dir === 'left') {
            canvas.strokeRect(ox + 8, headY + 7, 5, 5, '#475569');
        } else if (dir === 'right') {
            canvas.strokeRect(ox + 19, headY + 7, 5, 5, '#475569');
        }
    }

    // HIJAB / HAIR STYLE
    if (cfg.hijab) {
        // Bu Sari Hijab
        const hijabColor = cfg.hijabColor || '#be185d';
        const hijabShadow = cfg.hijabShadow || '#9d174d';
        canvas.fillEllipse(ox + 16, headY + 6, 11, 10, hijabColor);
        canvas.fillRect(ox + 5, headY + 6, 22, 16, hijabColor);
        canvas.strokeRect(ox + 5, headY - 1, 22, 23, outline);
        if (dir === 'down') {
            // Face opening oval
            canvas.fillEllipse(ox + 16, headY + 10, 7, 7, skin);
            // Re-draw eyes & blush inside hijab face opening
            canvas.fillRect(ox + 11, headY + 9, 3, 4, eyeColor);
            canvas.setPixel(ox + 11, headY + 9, '#ffffff');
            canvas.fillRect(ox + 18, headY + 9, 3, 4, eyeColor);
            canvas.setPixel(ox + 18, headY + 9, '#ffffff');
            canvas.fillRect(ox + 10, headY + 12, 2, 2, '#fda4af');
            canvas.fillRect(ox + 20, headY + 12, 2, 2, '#fda4af');
            canvas.setPixel(ox + 15, headY + 13, '#e11d48');
            canvas.setPixel(ox + 16, headY + 13, '#e11d48');
            // Hijab fold lines
            canvas.fillRect(ox + 7, headY + 17, 18, 5, hijabShadow);
        } else if (dir === 'left') {
            canvas.fillEllipse(ox + 12, headY + 10, 6, 7, skin);
            canvas.fillRect(ox + 9, headY + 9, 3, 4, eyeColor);
            canvas.setPixel(ox + 9, headY + 9, '#ffffff');
        } else if (dir === 'right') {
            canvas.fillEllipse(ox + 20, headY + 10, 6, 7, skin);
            canvas.fillRect(ox + 20, headY + 9, 3, 4, eyeColor);
            canvas.setPixel(ox + 20, headY + 9, '#ffffff');
        }
    } else {
        // HAIR DRAWING
        if (dir === 'down') {
            // Front Bangs & Top Hair
            canvas.fillEllipse(ox + 16, headY + 3, 11, 6, hair);
            // Side locks
            canvas.fillRect(ox + 5, headY + 2, 4, 8, hair);
            canvas.fillRect(ox + 23, headY + 2, 4, 8, hair);
            // Spiky/Modern Bangs
            canvas.fillRect(ox + 8, headY + 3, 6, 4, hair);
            canvas.fillRect(ox + 18, headY + 3, 6, 4, hair);
            // Hair Highlight
            canvas.fillRect(ox + 11, headY + 1, 6, 2, hairHighlight);
            if (cfg.twintails) {
                canvas.fillCircle(ox + 4, headY + 8, 4, hair);
                canvas.fillCircle(ox + 28, headY + 8, 4, hair);
            }
        } else if (dir === 'left') {
            canvas.fillEllipse(ox + 16, headY + 3, 11, 7, hair);
            canvas.fillRect(ox + 12, headY + 1, 12, 10, hair);
            canvas.fillRect(ox + 8, headY + 3, 6, 4, hair);
            canvas.fillRect(ox + 14, headY + 1, 6, 2, hairHighlight);
            if (cfg.twintails) {
                canvas.fillCircle(ox + 26, headY + 8, 4, hair);
            }
        } else if (dir === 'right') {
            canvas.fillEllipse(ox + 16, headY + 3, 11, 7, hair);
            canvas.fillRect(ox + 8, headY + 1, 12, 10, hair);
            canvas.fillRect(ox + 18, headY + 3, 6, 4, hair);
            canvas.fillRect(ox + 12, headY + 1, 6, 2, hairHighlight);
            if (cfg.twintails) {
                canvas.fillCircle(ox + 6, headY + 8, 4, hair);
            }
        } else if (dir === 'up') {
            // Full Back Hair
            canvas.fillEllipse(ox + 16, headY + 6, 11, 9, hair);
            canvas.fillRect(ox + 6, headY + 2, 20, 12, hair);
            canvas.fillRect(ox + 11, headY + 2, 10, 3, hairHighlight);
            if (cfg.twintails) {
                canvas.fillCircle(ox + 4, headY + 8, 4, hair);
                canvas.fillCircle(ox + 28, headY + 8, 4, hair);
            }
        }
    }
}

// --- CONFIGURATIONS FOR ALL CHARACTERS ---

const baseDir = 'C:/laragon/www/eduquest/game/assets/images/characters';

// 1. PLAYER — Siswa SMK RPL
const playerConfig = {
    skin: '#fde0c7',
    hair: '#3b2314', // Chestnut dark brown hair
    hairHighlight: '#60381f',
    shirt: '#ffffff', // Kemeja putih
    shirtShadow: '#cbd5e1',
    tie: '#1e293b',   // Black/navy tie
    pants: '#1e293b', // Dark trousers
    shoes: '#0f172a', // School shoes
    bag: '#2563eb',   // Blue RPL backpack
    bagShadow: '#1d4ed8',
    eyeColor: '#1e293b'
};

// 2. BU SARI — Guru Perempuan
const buSariConfig = {
    skin: '#fde0c7',
    hijab: true,
    hijabColor: '#be185d', // Elegant pinkish teacher hijab
    hijabShadow: '#9d174d',
    shirt: '#fbcfe8',
    shirtShadow: '#f472b6',
    tie: null,
    pants: '#831843', // Elegant long skirt/pants
    shoes: '#500724',
    clipboard: true,
    eyeColor: '#831843'
};

// 3. PAK ANDI — Guru Lab Komputer
const pakAndiConfig = {
    skin: '#fde0c7',
    hair: '#1e1b4b', // Neat dark navy hair
    hairHighlight: '#312e81',
    shirt: '#2563eb', // Tech blue kemeja guru
    shirtShadow: '#1d4ed8',
    tie: '#0f172a',
    pants: '#1e293b',
    shoes: '#0f172a',
    glasses: true,
    lanyard: true,
    eyeColor: '#0f172a'
};

// 4. RIKA — Siswi Perpustakaan
const rikaConfig = {
    skin: '#fde0c7',
    hair: '#9a3412', // Warm amber brown hair
    hairHighlight: '#c2410c',
    twintails: true,
    shirt: '#ffffff', // Female student uniform
    shirtShadow: '#cbd5e1',
    tie: '#f59e0b',   // Amber ribbon tie
    pants: '#1e293b', // Dark skirt
    shoes: '#0f172a',
    book: true,
    eyeColor: '#7c2d12'
};

// 5. STUDENT NPC 1 — Siswa Laki-laki (Green Bag, Short Hair)
const student1Config = {
    skin: '#fde0c7',
    hair: '#18181b', // Jet black hair
    hairHighlight: '#3f3f46',
    shirt: '#ffffff',
    shirtShadow: '#cbd5e1',
    tie: '#1e293b',
    pants: '#1e293b',
    shoes: '#0f172a',
    bag: '#16a34a', // Green backpack
    eyeColor: '#18181b'
};

// 6. STUDENT NPC 2 — Siswi Perempuan (Purple Bag, Hairpin)
const student2Config = {
    skin: '#fde0c7',
    hair: '#451a03',
    hairHighlight: '#78350f',
    shirt: '#ffffff',
    shirtShadow: '#cbd5e1',
    tie: '#ec4899', // Pink tie ribbon
    pants: '#1e293b',
    shoes: '#0f172a',
    bag: '#9333ea', // Purple backpack
    eyeColor: '#451a03'
};

// 7. STUDENT NPC 3 — Siswa Laki-laki (Orange Bag, Blonde/Light Hair)
const student3Config = {
    skin: '#fde0c7',
    hair: '#b45309', // Light brown / golden hair
    hairHighlight: '#d97706',
    shirt: '#ffffff',
    shirtShadow: '#cbd5e1',
    tie: '#1e293b',
    pants: '#1e293b',
    shoes: '#0f172a',
    bag: '#ea580c', // Orange backpack
    eyeColor: '#78350f'
};

console.log('Generating EDUQUEST pixel-art character sprite sheets...');
generateCharacterSheet(playerConfig, `${baseDir}/player/sprite.png`);
generateCharacterSheet(buSariConfig, `${baseDir}/npc/bu_sari/sprite.png`);
generateCharacterSheet(pakAndiConfig, `${baseDir}/npc/pak_andi/sprite.png`);
generateCharacterSheet(rikaConfig, `${baseDir}/npc/rika/sprite.png`);
generateCharacterSheet(student1Config, `${baseDir}/students/student-01.png`);
generateCharacterSheet(student2Config, `${baseDir}/students/student-02.png`);
generateCharacterSheet(student3Config, `${baseDir}/students/student-03.png`);
console.log('All character sprite sheets successfully generated!');
