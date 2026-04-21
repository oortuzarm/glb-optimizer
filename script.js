// ─────────────────────────────────────────────────────────
//  UI state
// ─────────────────────────────────────────────────────────
let selectedSize = 1024;
let optimizedBuf = null;
let origFileName = '';
let originalBuf  = null;

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
    if (originalBuf) reoptimize();
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
  optimizedBuf = null; originalBuf = null; fileInput.value = '';
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
  originalBuf  = await file.arrayBuffer();
  await runOptimization();
}

async function reoptimize() {
  await runOptimization();
}

async function runOptimization() {
  dropzone.style.display = 'none';
  resCard.classList.remove('vis');
  errMsg.classList.remove('vis');
  statusCard.classList.add('vis');
  setProgress(5, 'Leyendo archivo...', fmtBytes(originalBuf.byteLength) + ' detectados');
  try {
    setProgress(10, 'Analizando estructura GLB...', 'Parseando JSON y buffer binario');
    const out = await optimizeGLB(originalBuf, {
      textureSize: selectedSize,
      jpegQuality: +$('webpSlider').value / 100,
      geoOpt:  $('geoOpt').checked,
      draco:   $('dracoOpt').checked,
    });
    optimizedBuf = out;
    statusCard.classList.remove('vis');
    resCard.classList.add('vis');
    $('origSz').textContent = fmtBytes(originalBuf.byteLength);
    $('optSz').textContent  = fmtBytes(out.byteLength);
    const red = (originalBuf.byteLength - out.byteLength) / originalBuf.byteLength * 100;
    $('redPct').textContent = (red > 0 ? red.toFixed(1) : '0') + '%';
  } catch (err) {
    console.error(err);
    statusCard.classList.remove('vis');
    showErr('Error al optimizar: ' + (err instanceof Error ? err.message : 'Error desconocido. Revisa la consola.'));
    if (!optimizedBuf) dropzone.style.display = '';
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
  // Draco compressed data bufferViews
  (json.meshes || []).forEach(m => (m.primitives || []).forEach(p => {
    const draco = p.extensions && p.extensions.KHR_draco_mesh_compression;
    if (draco && draco.bufferView != null) bvs.add(draco.bufferView);
  }));
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
  // Remap Draco extension bufferViews
  (json.meshes || []).forEach(m => (m.primitives || []).forEach(p => {
    const draco = p.extensions && p.extensions.KHR_draco_mesh_compression;
    if (draco && draco.bufferView != null && remap.has(draco.bufferView))
      draco.bufferView = remapIdx(draco.bufferView);
  }));
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
//  Draco encoder
// ─────────────────────────────────────────────────────────
let _dracoModule = null;
const DRACO_CDN = 'https://cdn.jsdelivr.net/npm/draco3d@1.5.6';

async function loadDracoEncoder() {
  if (_dracoModule) return _dracoModule;
  await new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = `${DRACO_CDN}/draco_encoder.js`;
    s.onload = res;
    s.onerror = () => rej(new Error('No se pudo cargar el encoder Draco. Verifica tu conexión a internet.'));
    document.head.appendChild(s);
  });
  if (typeof DracoEncoderModule === 'undefined')
    throw new Error('El encoder Draco no se inicializó correctamente.');
  _dracoModule = await DracoEncoderModule({
    locateFile: f => `${DRACO_CDN}/${f}`
  });
  return _dracoModule;
}

const TYPE_COMP  = { SCALAR:1, VEC2:2, VEC3:3, VEC4:4, MAT2:4, MAT3:9, MAT4:16 };
const COMP_BYTES = { 5120:1, 5121:1, 5122:2, 5123:2, 5125:4, 5126:4 };

function readAccessorData(json, acc, binArray) {
  const bv = json.bufferViews[acc.bufferView];
  if (!bv) return new Float32Array(0);
  const numComp  = TYPE_COMP[acc.type]  || 1;
  const byteSize = COMP_BYTES[acc.componentType] || 4;
  const bvOff    = bv.byteOffset  || 0;
  const accOff   = acc.byteOffset || 0;
  const stride   = bv.byteStride  || (numComp * byteSize);
  const dv       = new DataView(binArray.buffer, binArray.byteOffset);
  const result   = new Float32Array(acc.count * numComp);
  for (let i = 0; i < acc.count; i++) {
    const base = bvOff + accOff + i * stride;
    for (let j = 0; j < numComp; j++) {
      const o = base + j * byteSize;
      let v;
      switch (acc.componentType) {
        case 5120: v = dv.getInt8(o);            break;
        case 5121: v = dv.getUint8(o);           break;
        case 5122: v = dv.getInt16(o, true);     break;
        case 5123: v = dv.getUint16(o, true);    break;
        case 5125: v = dv.getUint32(o, true);    break;
        default:   v = dv.getFloat32(o, true);   break;
      }
      result[i * numComp + j] = v;
    }
  }
  return result;
}

function readIndicesData(json, acc, binArray) {
  const bv     = json.bufferViews[acc.bufferView];
  const bvOff  = bv.byteOffset  || 0;
  const accOff = acc.byteOffset || 0;
  const byteSize = COMP_BYTES[acc.componentType] || 2;
  const dv     = new DataView(binArray.buffer, binArray.byteOffset);
  const result = new Uint32Array(acc.count);
  for (let i = 0; i < acc.count; i++) {
    const o = bvOff + accOff + i * byteSize;
    switch (acc.componentType) {
      case 5121: result[i] = dv.getUint8(o);          break;
      case 5123: result[i] = dv.getUint16(o, true);   break;
      default:   result[i] = dv.getUint32(o, true);   break;
    }
  }
  return result;
}

function encodePrimitiveDraco(mod, json, prim, binArray) {
  const meshBuilder = new mod.MeshBuilder();
  const mesh        = new mod.Mesh();

  // Faces
  const indAcc  = json.accessors[prim.indices];
  const indices = readIndicesData(json, indAcc, binArray);
  const faceCount = Math.floor(indAcc.count / 3);
  const facesArr  = new mod.DracoInt32Array();
  facesArr.Resize(indAcc.count);
  for (let i = 0; i < indAcc.count; i++) facesArr.SetValue(i, indices[i]);
  meshBuilder.AddFacesToMesh(mesh, faceCount, facesArr);
  mod.destroy(facesArr);

  // Attributes
  const attrIds = {};
  for (const [name, accIdx] of Object.entries(prim.attributes)) {
    const acc  = json.accessors[accIdx];
    if (acc.bufferView == null) continue;
    const data = readAccessorData(json, acc, binArray);
    const nc   = TYPE_COMP[acc.type] || 3;
    const arr  = new mod.DracoFloat32Array();
    arr.Resize(data.length);
    for (let i = 0; i < data.length; i++) arr.SetValue(i, data[i]);
    let dracoType;
    if      (name === 'POSITION')          dracoType = mod.POSITION;
    else if (name === 'NORMAL')            dracoType = mod.NORMAL;
    else if (name.startsWith('TEXCOORD_')) dracoType = mod.TEX_COORD;
    else if (name.startsWith('COLOR_'))    dracoType = mod.COLOR;
    else                                   dracoType = mod.GENERIC;
    attrIds[name] = meshBuilder.AddFloatAttributeToMesh(mesh, dracoType, acc.count, nc, arr);
    mod.destroy(arr);
  }

  // Encode
  const encoder = new mod.Encoder();
  encoder.SetSpeedOptions(5, 5);
  encoder.SetAttributeQuantization(mod.POSITION,  14);
  encoder.SetAttributeQuantization(mod.NORMAL,    10);
  encoder.SetAttributeQuantization(mod.TEX_COORD, 12);
  encoder.SetAttributeQuantization(mod.COLOR,      8);
  encoder.SetAttributeQuantization(mod.GENERIC,    8);
  encoder.SetEncodingMethod(mod.MESH_EDGEBREAKER_ENCODING);

  const encodedData = new mod.DracoInt8Array();
  const encodedLen  = encoder.EncodeMeshToDracoBuffer(mesh, encodedData);
  mod.destroy(mesh);
  mod.destroy(encoder);

  if (encodedLen === 0) { mod.destroy(encodedData); throw new Error('Draco encoding produjo 0 bytes'); }

  const bytes = new Uint8Array(encodedLen);
  for (let i = 0; i < encodedLen; i++) bytes[i] = encodedData.GetValue(i);
  mod.destroy(encodedData);

  return { bytes, attrIds };
}

// ─────────────────────────────────────────────────────────
//  Main optimizer
// ─────────────────────────────────────────────────────────
async function optimizeGLB(buffer, { textureSize, jpegQuality, geoOpt, draco }) {
  setProgress(15, 'Parseando GLB...', 'Extrayendo JSON y buffer binario');
  const { json, bin } = parseGLB(buffer);
  const binArray = bin ? new Uint8Array(bin) : new Uint8Array(0);

  const imgs     = json.images || [];
  const imgNew   = new Array(imgs.length).fill(null);
  const imgCount = imgs.filter(i => i.bufferView != null).length;

  // ── 1. Textures ────────────────────────────────────────
  for (let i = 0; i < imgs.length; i++) {
    const img = imgs[i];
    if (img.bufferView == null) continue;
    const nth = imgNew.filter(x => x !== null).length + 1;
    setProgress(
      15 + Math.round(nth / Math.max(imgCount, 1) * 45),
      `Procesando textura ${nth} de ${imgCount}`,
      `Redimensionando a ${textureSize}px · Convirtiendo a JPEG`
    );
    const bv  = json.bufferViews[img.bufferView];
    const off = bv.byteOffset || 0;
    try {
      imgNew[i] = await toJPEG(binArray.slice(off, off + bv.byteLength), img.mimeType, textureSize, jpegQuality);
      json.images[i] = { ...img, mimeType: 'image/jpeg' };
    } catch (e) { console.warn('Textura omitida:', e.message); }
    await new Promise(r => setTimeout(r, 0));
  }

  // ── 2. Draco geometry compression ─────────────────────
  const dracoPatches = new Map(); // pre-compact BV idx → Uint8Array

  if (draco) {
    setProgress(62, 'Cargando compresor Draco...', 'Descargando encoder (~500 KB)');
    const mod = await loadDracoEncoder();

    const allPrims = (json.meshes || []).flatMap(m => m.primitives || []);
    const total    = allPrims.length;
    let   done     = 0;

    for (const mesh of (json.meshes || [])) {
      for (const prim of (mesh.primitives || [])) {
        done++;
        if (prim.indices == null) continue;
        if (json.accessors[prim.indices].bufferView == null) continue;
        if (prim.extensions && prim.extensions.KHR_draco_mesh_compression) continue;

        setProgress(
          62 + Math.round(done / Math.max(total, 1) * 18),
          `Draco: malla ${done} de ${total}`,
          'Codificando geometría con compresión Draco'
        );

        try {
          const { bytes, attrIds } = encodePrimitiveDraco(mod, json, prim, binArray);
          const newBVIdx = json.bufferViews.length;
          json.bufferViews.push({ buffer: 0, byteOffset: 0, byteLength: bytes.length });
          dracoPatches.set(newBVIdx, bytes);

          prim.extensions = prim.extensions || {};
          prim.extensions.KHR_draco_mesh_compression = { bufferView: newBVIdx, attributes: attrIds };

          // Remove bufferView refs — data now lives in the Draco buffer
          delete json.accessors[prim.indices].bufferView;
          delete json.accessors[prim.indices].byteOffset;
          for (const accIdx of Object.values(prim.attributes)) {
            delete json.accessors[accIdx].bufferView;
            delete json.accessors[accIdx].byteOffset;
          }
        } catch (e) { console.warn('Draco omitido para primitiva:', e.message); }

        await new Promise(r => setTimeout(r, 0));
      }
    }

    if (dracoPatches.size > 0) {
      json.extensionsUsed     = [...new Set([...(json.extensionsUsed     || []), 'KHR_draco_mesh_compression'])];
      json.extensionsRequired = [...new Set([...(json.extensionsRequired || []), 'KHR_draco_mesh_compression'])];
    }
  }

  // ── 3. Geometry cleanup ────────────────────────────────
  let remap = null;
  if (geoOpt) {
    setProgress(82, 'Optimizando geometría...', 'Eliminando datos huérfanos');
    const used = usedBVSet(json);
    const result = compactBVs(json, used);
    remap = result.remap;
    setProgress(87, 'Geometría lista', `${result.removed} bufferView(s) eliminados`);
  }

  // ── 4. Build patches (post-compact indices) ────────────
  const patches = new Map();

  for (let i = 0; i < imgs.length; i++) {
    if (imgNew[i] && json.images[i].bufferView != null)
      patches.set(json.images[i].bufferView, imgNew[i]);
  }

  for (const [oldIdx, data] of dracoPatches) {
    const newIdx = remap ? remap.get(oldIdx) : oldIdx;
    if (newIdx != null) patches.set(newIdx, data);
  }

  // ── 5. Rebuild & pack ──────────────────────────────────
  setProgress(92, 'Reconstruyendo buffer...', 'Empaquetando datos optimizados');
  const newBin = rebuildBin(json, bin, patches);

  setProgress(97, 'Generando archivo final...', 'Empaquetando GLB optimizado');
  const result = packGLB(json, newBin);

  setProgress(100, 'Completado ✓', 'Optimización finalizada con éxito');
  return result;
}
