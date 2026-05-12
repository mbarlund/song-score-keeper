// Generates icon-192.png and icon-512.png using only Node built-ins.
// Disney blue background with a white musical note drawn from pixels.
import zlib from 'zlib'
import fs from 'fs'
import path from 'path'

const BG = [0x00, 0x6A, 0xC3]   // Disney blue
const FG = [0xFF, 0xFF, 0xFF]   // white

function drawIcon(size) {
  const pixels = []
  const cx = size / 2
  const cy = size / 2
  const s = size / 64  // scale factor (base design at 64px)

  // Helper: is point (x,y) inside a filled circle?
  function inCircle(x, y, ox, oy, r) {
    return (x - ox) ** 2 + (y - oy) ** 2 <= r ** 2
  }

  // Helper: is point inside a filled rectangle?
  function inRect(x, y, rx, ry, rw, rh) {
    return x >= rx && x < rx + rw && y >= ry && y < ry + rh
  }

  // Music note components (at 64px scale, centered):
  // - Stem: vertical rectangle right side
  // - Note head: filled ellipse bottom-left
  // - Flag/beam: small rectangle top-right of stem
  const stemX = cx + 6 * s
  const stemW = 3 * s
  const stemTop = cy - 18 * s
  const stemH = 28 * s

  const headCX = cx - 2 * s
  const headCY = cy + 10 * s
  const headRX = 9 * s
  const headRY = 7 * s

  const flagX = stemX + stemW
  const flagY = stemTop
  const flagW = 8 * s
  const flagH = 6 * s

  function isNote(x, y) {
    // Stem
    if (inRect(x, y, stemX, stemTop, stemW, stemH)) return true
    // Note head (ellipse approximation as scaled circle)
    if ((x - headCX) ** 2 / (headRX ** 2) + (y - headCY) ** 2 / (headRY ** 2) <= 1) return true
    // Flag
    if (inRect(x, y, flagX, flagY, flagW, flagH)) return true
    return false
  }

  // Background: rounded rectangle
  const cornerR = size * 0.22

  function inRoundedRect(x, y) {
    const margin = size * 0.08
    const x1 = margin, y1 = margin
    const x2 = size - margin, y2 = size - margin
    if (x < x1 || x > x2 || y < y1 || y > y2) return false
    // Corner circles
    if (x < x1 + cornerR && y < y1 + cornerR) return inCircle(x, y, x1 + cornerR, y1 + cornerR, cornerR)
    if (x > x2 - cornerR && y < y1 + cornerR) return inCircle(x, y, x2 - cornerR, y1 + cornerR, cornerR)
    if (x < x1 + cornerR && y > y2 - cornerR) return inCircle(x, y, x1 + cornerR, y2 - cornerR, cornerR)
    if (x > x2 - cornerR && y > y2 - cornerR) return inCircle(x, y, x2 - cornerR, y2 - cornerR, cornerR)
    return true
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!inRoundedRect(x, y)) {
        pixels.push(0xFF, 0xFF, 0xFF, 0x00) // transparent outside rounded rect
      } else if (isNote(x, y)) {
        pixels.push(...FG, 0xFF)
      } else {
        pixels.push(...BG, 0xFF)
      }
    }
  }
  return Buffer.from(pixels)
}

function uint32BE(n) {
  const b = Buffer.alloc(4)
  b.writeUInt32BE(n)
  return b
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii')
  const crcBuf = Buffer.concat([typeBytes, data])
  const crc = crc32(crcBuf)
  return Buffer.concat([uint32BE(data.length), typeBytes, data, uint32BE(crc)])
}

// CRC32 table
const crcTable = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()

function crc32(buf) {
  let c = 0xFFFFFFFF
  for (const b of buf) c = crcTable[(c ^ b) & 0xFF] ^ (c >>> 8)
  return (c ^ 0xFFFFFFFF) >>> 0
}

function makePNG(size) {
  const pixelData = drawIcon(size)

  // Build raw image rows: filter byte (0 = None) + RGBA pixels per row
  const rowSize = 1 + size * 4
  const raw = Buffer.alloc(size * rowSize)
  for (let y = 0; y < size; y++) {
    raw[y * rowSize] = 0 // filter type None
    pixelData.copy(raw, y * rowSize + 1, y * size * 4, (y + 1) * size * 4)
  }

  const compressed = zlib.deflateSync(raw)

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8  // bit depth
  ihdr[9] = 6  // color type: RGBA
  ihdr[10] = 0 // compression
  ihdr[11] = 0 // filter
  ihdr[12] = 0 // interlace

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const outDir = path.join(import.meta.dirname, 'public', 'icons')
fs.mkdirSync(outDir, { recursive: true })

for (const size of [192, 512]) {
  const png = makePNG(size)
  fs.writeFileSync(path.join(outDir, `icon-${size}.png`), png)
  console.log(`wrote icon-${size}.png (${png.length} bytes)`)
}
