'use strict';

// ─────────────────────────────────────────────────────────
//  GLB binary parse / pack
// ─────────────────────────────────────────────────────────
function parseGLB(buf) {
  const v = new DataView(buf);
  if (v.getUint32(0, true) !== 0x46546C67) throw new Error('No es un archivo GLB válido');
  if (v.getUint32(4, true) !== 2)          throw new Error('Solo se soporta GLB versión 2');
  let off = 12, json = null, bin = null;
  while (off < buf.byteLength) {
    if (off + 8 > buf.byteLength) break;
    const len  = v.getUint32(off,     true);
    const type = v.getUint32(off + 4, true);
    off += 8;
    if      (type === 0x4E4F534A) json = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, off, len)));
    else if (type === 0x004E4942) bin  = buf.slice(off, off + len);
    off += len;
  }
  if (!json) throw new Error('GLB no contiene chunk JSON');
  return { json, bin };
}

function packGLB(json, bin) {
  const jRaw = new TextEncoder().encode(JSON.stringify(json));
  const jPad = (4 - jRaw.length % 4) % 4;
  const jBuf = new Uint8Array(jRaw.length + jPad);
  jBuf.set(jRaw);
  for (let i = jRaw.length; i < jBuf.length; i++) jBuf[i] = 0x20;

  const bArr = bin ? new Uint8Array(bin) : new Uint8Array(0);
  const bPad = (4 - bArr.length % 4) % 4;
  const bBuf = new Uint8Array(bArr.length + bPad);
  bBuf.set(bArr);

  const hasBin = bBuf.length > 0;
  const total  = 12 + 8 + jBuf.length + (hasBin ? 8 + bBuf.length : 0);
  const out = new Uint8Array(total);
  const dv  = new DataView(out.buffer);
  dv.setUint32(0,  0x46546C67, true);
  dv.setUint32(4,  2,          true);
  dv.setUint32(8,  total,      true);
  dv.setUint32(12, jBuf.length, true);
  dv.setUint32(16, 0x4E4F534A,  true);
  out.set(jBuf, 20);
  if (hasBin) {
    const bo = 20 + jBuf.length;
    dv.setUint32(bo,     bBuf.length, true);
    dv.setUint32(bo + 4, 0x004E4942,  true);
    out.set(bBuf, bo + 8);
  }
  return out.buffer;
}

// ─────────────────────────────────────────────────────────
//  Orphan bufferView removal
// ─────────────────────────────────────────────────────────
function usedBVSet(json) {
  const accs = new Set();
  (json.meshes || []).forEach(m => (m.primitives || []).forEach(p => {
    if (p.indices != null) accs.add(p.indices);
    Object.values(p.attributes || {}).forEach(v => accs.add(v));
    if (p.targets) p.targets.forEach(t => Object.values(t).forEach(v => accs.add(v)));
  }));
  (json.skins || []).forEach(s => {
    if (s.inverseBindMatrices != null) accs.add(s.inverseBindMatrices);
  });
  (json.animations || []).forEach(a => (a.samplers || []).forEach(s => {
    if (s.input  != null) accs.add(s.input);
    if (s.output != null) accs.add(s.output);
  }));
  const bvs = new Set();
  accs.forEach(i => {
    const a = json.accessors && json.accessors[i];
    if (a && a.bufferView != null) bvs.add(a.bufferView);
  });
  (json.images || []).forEach(img => { if (img.bufferView != null) bvs.add(img.bufferView); });
  return bvs;
}

function compactBVs(json, used) {
  const bvs = json.bufferViews || [];
  const remap = new Map();
  let ni = 0;
  for (let i = 0; i < bvs.length; i++) if (used.has(i)) remap.set(i, ni++);
  const remapIdx = i => (remap.has(i) ? remap.get(i) : i);
  (json.accessors || []).forEach(a => {
    if (a.bufferView != null && remap.has(a.bufferView)) a.bufferView = remapIdx(a.bufferView);
  });
  (json.images || []).forEach(img => {
    if (img.bufferView != null && remap.has(img.bufferView)) img.bufferView = remapIdx(img.bufferView);
  });
  const before = bvs.length;
  json.bufferViews = bvs.filter((_, i) => used.has(i));
  return { removed: before - json.bufferViews.length, remap };
}

// ─────────────────────────────────────────────────────────
//  Buffer reconstruction
// ─────────────────────────────────────────────────────────
function rebuildBin(json, oldBin, patches) {
  const bvs = json.bufferViews || [];
  if (!bvs.length) return new ArrayBuffer(0);
  const old = oldBin ? new Uint8Array(oldBin) : new Uint8Array(0);
  const pieces = bvs.map((bv, i) => {
    if (patches.has(i)) return patches.get(i);
    const o = bv.byteOffset || 0, l = bv.byteLength || 0;
    return (o + l <= old.length) ? old.slice(o, o + l) : new Uint8Array(l);
  });
  let cur = 0;
  const offsets = pieces.map(p => { const a = Math.ceil(cur / 4) * 4; cur = a + p.length; return a; });
  const total = Math.ceil(cur / 4) * 4 || 4;
  const buf = new Uint8Array(total);
  pieces.forEach((p, i) => {
    buf.set(p, offsets[i]);
    bvs[i].byteOffset = offsets[i];
    bvs[i].byteLength = p.length;
  });
  if (json.buffers && json.buffers[0]) json.buffers[0].byteLength = total;
  return buf.buffer;
}

// ─────────────────────────────────────────────────────────
//  Texture processing — uses OffscreenCanvas (worker-safe)
// ─────────────────────────────────────────────────────────
async function processTexture(bytes, mime, maxPx, jpegQuality) {
  const blob   = new Blob([bytes], { type: mime || 'image/png' });
  const bitmap = await createImageBitmap(blob);
  const origW  = bitmap.width;
  const origH  = bitmap.height;

  // Detect alpha transparency (skip check for JPEG which has no alpha)
  let hasAlpha = false;
  const mimeLC = (mime || '').toLowerCase();
  if (mimeLC !== 'image/jpeg' && mimeLC !== 'image/jpg') {
    const sW = Math.min(64, origW);
    const sH = Math.min(64, origH);
    const probe = new OffscreenCanvas(sW, sH);
    const pCtx  = probe.getContext('2d');
    pCtx.drawImage(bitmap, 0, 0, sW, sH);
    const data = pCtx.getImageData(0, 0, sW, sH).data;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 254) { hasAlpha = true; break; }
    }
  }

  // Scale to maxPx maintaining aspect ratio
  let w = origW, h = origH;
  if (w > maxPx || h > maxPx) {
    if (w >= h) { h = Math.round(h * maxPx / w); w = maxPx; }
    else        { w = Math.round(w * maxPx / h); h = maxPx; }
  }

  const canvas = new OffscreenCanvas(w, h);
  const ctx    = canvas.getContext('2d');

  let outMime, blobOpts;
  if (hasAlpha) {
    // Preserve transparency — keep as PNG
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(bitmap, 0, 0, w, h);
    outMime   = 'image/png';
    blobOpts  = { type: 'image/png' };
  } else {
    // No alpha — convert to JPEG with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(bitmap, 0, 0, w, h);
    outMime   = 'image/jpeg';
    blobOpts  = { type: 'image/jpeg', quality: jpegQuality };
  }

  bitmap.close();

  const outBlob = await canvas.convertToBlob(blobOpts);
  if (!outBlob) throw new Error('Error al convertir textura');

  return { data: new Uint8Array(await outBlob.arrayBuffer()), mimeType: outMime };
}

// ─────────────────────────────────────────────────────────
//  Progress helper
// ─────────────────────────────────────────────────────────
function progress(pct, step, txt) {
  self.postMessage({ type: 'progress', pct, step, txt });
}

// ─────────────────────────────────────────────────────────
//  Main optimizer
// ─────────────────────────────────────────────────────────
async function optimizeGLB(buffer, { textureSize, jpegQuality, geoOpt }) {
  progress(15, 'Parseando GLB...', 'Extrayendo JSON y buffer binario');
  const { json, bin } = parseGLB(buffer);
  const binArray = bin ? new Uint8Array(bin) : new Uint8Array(0);

  const imgs     = json.images  || [];
  const imgNew   = new Array(imgs.length).fill(null);
  const imgCount = imgs.filter(img => img.bufferView != null).length;

  // ── 1. Textures ────────────────────────────────────────
  for (let i = 0; i < imgs.length; i++) {
    const img = imgs[i];
    if (img.bufferView == null) continue;
    const nth = imgNew.filter(x => x !== null).length + 1;
    const srcMime = (img.mimeType || '').toLowerCase();
    progress(
      15 + Math.round(nth / Math.max(imgCount, 1) * 45),
      `Procesando textura ${nth} de ${imgCount}`,
      `Redimensionando a ${textureSize}px · ${srcMime === 'image/jpeg' ? 'Comprimiendo JPEG' : 'Detectando transparencia'}`
    );
    const bv  = json.bufferViews[img.bufferView];
    const off = bv.byteOffset || 0;
    try {
      const result = await processTexture(
        binArray.slice(off, off + bv.byteLength),
        img.mimeType,
        textureSize,
        jpegQuality
      );
      imgNew[i] = result.data;
      json.images[i] = { ...img, mimeType: result.mimeType };
    } catch (e) {
      console.warn('Textura omitida:', e.message);
    }
  }

  // ── 2. Geometry cleanup ────────────────────────────────
  if (geoOpt) {
    progress(82, 'Optimizando geometría...', 'Eliminando datos huérfanos');
    const used   = usedBVSet(json);
    const result = compactBVs(json, used);
    progress(87, 'Geometría lista', `${result.removed} bufferView(s) eliminados`);
  }

  // ── 3. Build patches using post-compact indices ────────
  const patches = new Map();
  for (let i = 0; i < imgs.length; i++) {
    if (imgNew[i] != null && json.images[i].bufferView != null)
      patches.set(json.images[i].bufferView, imgNew[i]);
  }

  // ── 4. Rebuild & pack ──────────────────────────────────
  progress(92, 'Reconstruyendo buffer...', 'Empaquetando datos optimizados');
  const newBin = rebuildBin(json, bin, patches);

  progress(97, 'Generando archivo final...', 'Empaquetando GLB optimizado');
  const result = packGLB(json, newBin);

  progress(100, 'Completado ✓', 'Optimización finalizada con éxito');
  return result;
}

// ─────────────────────────────────────────────────────────
//  Worker entry point
// ─────────────────────────────────────────────────────────
self.onmessage = async (e) => {
  const { type, buffer, options } = e.data;
  if (type !== 'optimize') return;
  try {
    const result = await optimizeGLB(buffer, options);
    // Transfer ownership back to main thread (zero-copy)
    self.postMessage({ type: 'done', buffer: result }, [result]);
  } catch (err) {
    self.postMessage({ type: 'error', message: err instanceof Error ? err.message : String(err) });
  }
};
