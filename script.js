// ─────────────────────────────────────────────────────────
//  UI wiring
// ─────────────────────────────────────────────────────────
let selectedSize = 1024;
let optimizedBuf = null;
let origFileName = '';

const $ = id => document.getElementById(id);
const dropzone   = $('dropzone');
const fileInput  = $('fileInput');
const statusCard = $('statusCard');
const resCard    = $('resCard');
const errMsg     = $('errMsg');

$('webpSlider').addEventListener('input', e => {
  $('webpVal').textContent = e.target.value + '%';
});

document.querySelectorAll('.tex-opt').forEach(el => {
  el.addEventListener('click', () => {
    document.querySelectorAll('.tex-opt').forEach(e => e.classList.remove('sel'));
    el.classList.add('sel');
    selectedSize = +el.dataset.size;
  });
});

dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.classList.add('over'); });
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('over'));
dropzone.addEventListener('drop', e => {
  e.preventDefault(); dropzone.classList.remove('over');
  const f = e.dataTransfer.files[0]; if (f) processFile(f);
});
fileInput.addEventListener('change', e => { const f = e.target.files[0]; if (f) processFile(f); });

$('dlBtn').addEventListener('click', () => {
  if (!optimizedBuf) return;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([optimizedBuf], { type: 'model/gltf-binary' }));
  a.download = origFileName.replace(/\.glb$/i, '') + '_optimized.glb';
  a.click();
});

$('rstBtn').addEventListener('click', () => {
  optimizedBuf = null; fileInput.value = '';
  resCard.classList.remove('vis');
  statusCard.classList.remove('vis');
  errMsg.classList.remove('vis');
  dropzone.style.display = '';
});

function setProgress(pct, step, txt) {
  $('pbar').style.width = pct + '%';
  $('sstep').textContent = step;
  $('stxt').textContent = txt;
}
function showErr(msg) { errMsg.textContent = msg; errMsg.classList.add('vis'); }
function fmtBytes(b) {
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
  return (b / 1048576).toFixed(2) + ' MB';
}

async function processFile(file) {
  if (!/\.glb$/i.test(file.name)) { showErr('Por favor selecciona un archivo .GLB válido.'); return; }
  origFileName = file.name;
  dropzone.style.display = 'none';
  resCard.classList.remove('vis');
  errMsg.classList.remove('vis');
  statusCard.classList.add('vis');
  setProgress(5, 'Leyendo archivo...', fmtBytes(file.size) + ' detectados');
  try {
    const buf = await file.arrayBuffer();
    setProgress(10, 'Analizando estructura GLB...', 'Parseando JSON y buffer binario');
    const out = await optimizeGLB(buf, {
      textureSize: selectedSize,
      webpQuality: +$('webpSlider').value / 100,
      geoOpt: $('geoOpt').checked
    });
    optimizedBuf = out;
    statusCard.classList.remove('vis');
    resCard.classList.add('vis');
    $('origSz').textContent = fmtBytes(buf.byteLength);
    $('optSz').textContent  = fmtBytes(out.byteLength);
    const red = (buf.byteLength - out.byteLength) / buf.byteLength * 100;
    $('redPct').textContent = (red > 0 ? red.toFixed(1) : '0') + '%';
  } catch (err) {
    console.error(err);
    statusCard.classList.remove('vis');
    showErr('Error al optimizar: ' + (err.message || String(err)));
    dropzone.style.display = '';
  }
}

// ─────────────────────────────────────────────────────────
//  GLB binary parse / pack
// ─────────────────────────────────────────────────────────
function parseGLB(buf) {
  const v = new DataView(buf);
  if (v.getUint32(0, true) !== 0x46546C67) throw new Error('No es un archivo GLB válido');
  if (v.getUint32(4, true) !== 2) throw new Error('Solo se soporta GLB versión 2');
  let off = 12, json = null, bin = null;
  while (off < buf.byteLength) {
    if (off + 8 > buf.byteLength) break;
    const len  = v.getUint32(off,     true);
    const type = v.getUint32(off + 4, true);
    off += 8;
    if      (type === 0x4E4F534A) json = JSON.parse(new TextDecoder().decode(buf.slice(off, off + len)));
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

  const total = 12 + 8 + jBuf.length + (bBuf.length > 0 ? 8 + bBuf.length : 0);
  const out = new Uint8Array(total);
  const dv  = new DataView(out.buffer);
  dv.setUint32(0, 0x46546C67, true);
  dv.setUint32(4, 2,          true);
  dv.setUint32(8, total,      true);
  dv.setUint32(12, jBuf.length, true);
  dv.setUint32(16, 0x4E4F534A,  true);
  out.set(jBuf, 20);
  if (bBuf.length > 0) {
    const bo = 20 + jBuf.length;
    dv.setUint32(bo,     bBuf.length, true);
    dv.setUint32(bo + 4, 0x004E4942,  true);
    out.set(bBuf, bo + 8);
  }
  return out.buffer;
}

// ─────────────────────────────────────────────────────────
//  Texture processing
// ─────────────────────────────────────────────────────────
async function toJPEG(bytes, mime, maxPx, quality) {
  const url = URL.createObjectURL(new Blob([bytes], { type: mime || 'image/png' }));
  const img = await new Promise((res, rej) => {
    const i = new Image(); i.crossOrigin = 'anonymous';
    i.onload = () => res(i);
    i.onerror = () => rej(new Error('Error cargando imagen'));
    i.src = url;
  });
  URL.revokeObjectURL(url);
  let w = img.naturalWidth, h = img.naturalHeight;
  if (w > maxPx || h > maxPx) {
    if (w >= h) { h = Math.round(h * maxPx / w); w = maxPx; }
    else        { w = Math.round(w * maxPx / h); h = maxPx; }
  }
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
  const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', quality));
  if (!blob) throw new Error('Error al convertir textura a JPEG');
  return new Uint8Array(await blob.arrayBuffer());
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
  (json.skins || []).forEach(s => { if (s.inverseBindMatrices != null) accs.add(s.inverseBindMatrices); });
  (json.animations || []).forEach(a => (a.samplers || []).forEach(s => {
    if (s.input  != null) accs.add(s.input);
    if (s.output != null) accs.add(s.output);
  }));
  const bvs = new Set();
  accs.forEach(i => { const a = json.accessors && json.accessors[i]; if (a && a.bufferView != null) bvs.add(a.bufferView); });
  (json.images || []).forEach(img => { if (img.bufferView != null) bvs.add(img.bufferView); });
  return bvs;
}

function compactBVs(json, used) {
  const bvs = json.bufferViews || [];
  const remap = new Map();
  let ni = 0;
  for (let i = 0; i < bvs.length; i++) if (used.has(i)) remap.set(i, ni++);
  (json.accessors || []).forEach(a => { if (a.bufferView != null && remap.has(a.bufferView)) a.bufferView = remap.get(a.bufferView); });
  (json.images    || []).forEach(img => { if (img.bufferView != null && remap.has(img.bufferView)) img.bufferView = remap.get(img.bufferView); });
  const before = bvs.length;
  json.bufferViews = bvs.filter((_, i) => used.has(i));
  return before - json.bufferViews.length;
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
  const total = Math.ceil(cur / 4) * 4;
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
//  Main optimizer
// ─────────────────────────────────────────────────────────
async function optimizeGLB(buffer, { textureSize, webpQuality, geoOpt }) {
  setProgress(15, 'Parseando GLB...', 'Extrayendo JSON y buffer binario');
  const { json, bin } = parseGLB(buffer);
  const binArr = bin ? new Uint8Array(bin) : new Uint8Array(0);

  const imgs = json.images || [];
  const imgNew = new Array(imgs.length).fill(null);
  const imgCount = imgs.filter(i => i.bufferView != null).length;

  // ── textures ───────────────────────────────────────────
  for (let i = 0; i < imgs.length; i++) {
    const img = imgs[i];
    if (img.bufferView == null) continue;
    const nth = imgNew.filter(x => x !== null).length + 1;
    setProgress(
      15 + Math.round(nth / Math.max(imgCount, 1) * 62),
      `Procesando textura ${nth} de ${imgCount}`,
      `Redimensionando a ${textureSize}px · Convirtiendo a JPEG`
    );
    const bv = json.bufferViews[img.bufferView];
    const off = bv.byteOffset || 0;
    try {
      imgNew[i] = await toJPEG(binArr.slice(off, off + bv.byteLength), img.mimeType, textureSize, webpQuality);
      json.images[i] = { ...img, mimeType: 'image/jpeg' };
    } catch (e) { console.warn('Textura omitida:', e.message); }
    await new Promise(r => setTimeout(r, 0));
  }

  // ── geometry cleanup ───────────────────────────────────
  if (geoOpt) {
    setProgress(82, 'Optimizando geometría...', 'Detectando datos huérfanos');
    const used = usedBVSet(json);
    const removed = compactBVs(json, used);
    setProgress(87, 'Geometría lista', `${removed} bufferView(s) huérfanos eliminados`);
  }

  // ── build patches map (post-compact indices) ───────────
  const patches = new Map();
  for (let i = 0; i < imgs.length; i++) {
    if (imgNew[i] && json.images[i].bufferView != null)
      patches.set(json.images[i].bufferView, imgNew[i]);
  }

  setProgress(92, 'Reconstruyendo buffer...', 'Empaquetando datos optimizados');
  const newBin = rebuildBin(json, bin, patches);

  setProgress(97, 'Generando archivo final...', 'Empaquetando GLB optimizado');
  const result = packGLB(json, newBin);

  setProgress(100, 'Completado ✓', 'Optimización finalizada con éxito');
  return result;
}
