'use strict';

// ─────────────────────────────────────────────────────────
//  State
// ─────────────────────────────────────────────────────────
let selectedSize  = 1024;
let optimizedBuf  = null;
let origFileName  = '';
let originalBuf   = null;
let currentWorker = null;
let runId         = 0;       // Incremented on each new optimization run

// ─────────────────────────────────────────────────────────
//  DOM refs
// ─────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const dropzone   = $('dropzone');
const fileInput  = $('fileInput');
const statusCard = $('statusCard');
const resCard    = $('resCard');
const errMsg     = $('errMsg');

// ─────────────────────────────────────────────────────────
//  Settings listeners
// ─────────────────────────────────────────────────────────
$('jpegSlider').addEventListener('input', e => {
  $('jpegVal').textContent = e.target.value + '%';
});

document.querySelectorAll('.tex-opt').forEach(el => {
  el.addEventListener('click', () => {
    document.querySelectorAll('.tex-opt').forEach(e => e.classList.remove('sel'));
    el.classList.add('sel');
    selectedSize = +el.dataset.size;
    if (originalBuf) runOptimization();
  });
});

// ─────────────────────────────────────────────────────────
//  Drop zone
// ─────────────────────────────────────────────────────────
dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.classList.add('over'); });
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('over'));
dropzone.addEventListener('drop', e => {
  e.preventDefault();
  dropzone.classList.remove('over');
  const f = e.dataTransfer.files[0];
  if (f) processFile(f);
});
fileInput.addEventListener('change', e => {
  const f = e.target.files[0];
  if (f) processFile(f);
});

// ─────────────────────────────────────────────────────────
//  Download — creates and immediately revokes the object URL
// ─────────────────────────────────────────────────────────
$('dlBtn').addEventListener('click', () => {
  if (!optimizedBuf) return;
  const blob = new Blob([optimizedBuf], { type: 'model/gltf-binary' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = origFileName.replace(/\.glb$/i, '') + '_optimized.glb';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

// ─────────────────────────────────────────────────────────
//  Reset
// ─────────────────────────────────────────────────────────
$('rstBtn').addEventListener('click', reset);

function reset() {
  terminateWorker();
  optimizedBuf = null;
  originalBuf  = null;
  fileInput.value = '';
  resCard.classList.remove('vis');
  statusCard.classList.remove('vis');
  errMsg.classList.remove('vis');
  dropzone.style.display = '';
}

// ─────────────────────────────────────────────────────────
//  UI helpers
// ─────────────────────────────────────────────────────────
function setProgress(pct, step, txt) {
  $('pbar').style.width  = pct + '%';
  $('sstep').textContent = step;
  $('stxt').textContent  = txt;
}

function showErr(msg) {
  errMsg.textContent = msg;
  errMsg.classList.add('vis');
}

function fmtBytes(b) {
  if (b < 1024)    return b + ' B';
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
  return (b / 1048576).toFixed(2) + ' MB';
}

// ─────────────────────────────────────────────────────────
//  File validation
// ─────────────────────────────────────────────────────────
function validateFile(file) {
  if (!/\.glb$/i.test(file.name))
    return 'El archivo debe tener extensión .glb';

  if (file.size === 0)
    return 'El archivo está vacío.';

  if (file.size > 100 * 1024 * 1024)
    return `El archivo es demasiado grande (${fmtBytes(file.size)}). El tamaño máximo recomendado es 100 MB.`;

  // MIME — lenient; browsers suelen reportar GLB como octet-stream o vacío
  const t = (file.type || '').toLowerCase();
  if (t && t.startsWith('text/'))
    return `Tipo de archivo no compatible (${file.type}). Selecciona un archivo .glb válido.`;

  return null;
}

// ─────────────────────────────────────────────────────────
//  GLB output validation
// ─────────────────────────────────────────────────────────
function validateGLBOutput(buffer, dracoWasActive) {
  const v = new DataView(buffer);
  if (v.byteLength < 12)
    throw new Error('El archivo generado es inválido (demasiado pequeño).');
  if (v.getUint32(0, true) !== 0x46546C67)
    throw new Error('El archivo generado no es un GLB válido (magic number incorrecto).');
  if (v.getUint32(4, true) !== 2)
    throw new Error('Versión GLB inesperada en la salida.');

  if (!dracoWasActive) return;

  // Verify KHR_draco_mesh_compression was actually applied
  const chunkLen  = v.getUint32(12, true);
  const chunkType = v.getUint32(16, true);
  if (chunkType === 0x4E4F534A && chunkLen > 0) {
    const json = JSON.parse(new TextDecoder().decode(new Uint8Array(buffer, 20, chunkLen)));
    if (!json.extensionsUsed?.includes('KHR_draco_mesh_compression')) {
      // Draco not applied — model has no compressible geometry (e.g., morph-target-only meshes)
      console.warn('[GLB Optimizer] Draco no se aplicó: el modelo no tiene geometría comprimible.');
    }
  }
}

// ─────────────────────────────────────────────────────────
//  Process file
// ─────────────────────────────────────────────────────────
async function processFile(file) {
  errMsg.classList.remove('vis');
  const err = validateFile(file);
  if (err) { showErr(err); return; }
  origFileName = file.name;
  originalBuf  = await file.arrayBuffer();
  runOptimization();
}

// ─────────────────────────────────────────────────────────
//  Worker management helpers
// ─────────────────────────────────────────────────────────
function terminateWorker() {
  if (currentWorker) {
    currentWorker.terminate();
    currentWorker = null;
  }
}

function onFatalError(msg) {
  statusCard.classList.remove('vis');
  showErr(msg);
  if (!optimizedBuf) dropzone.style.display = '';
}

function finalize(buffer, dracoWasActive) {
  try {
    validateGLBOutput(buffer, dracoWasActive);
  } catch (e) {
    onFatalError(e.message);
    return;
  }

  optimizedBuf = buffer;
  statusCard.classList.remove('vis');
  resCard.classList.add('vis');

  $('origSz').textContent = fmtBytes(originalBuf.byteLength);
  $('optSz').textContent  = fmtBytes(buffer.byteLength);
  const red = (originalBuf.byteLength - buffer.byteLength) / originalBuf.byteLength * 100;
  $('redPct').textContent = (red > 0 ? red.toFixed(1) : '0') + '%';
}

// ─────────────────────────────────────────────────────────
//  Phase 2 — Draco worker
// ─────────────────────────────────────────────────────────
function spawnDracoWorker(buffer, myRunId) {
  if (myRunId !== runId) return;

  setProgress(56, 'Preparando Draco...', 'Cargando módulo de compresión WASM');
  currentWorker = new Worker('draco-worker.bundle.js');

  currentWorker.onmessage = (e) => {
    if (myRunId !== runId) return;
    const msg = e.data;

    if (msg.type === 'progress') {
      // Scale Draco progress (0–100) into the 56–100% range
      setProgress(56 + Math.round((msg.pct / 100) * 44), msg.step, msg.txt);

    } else if (msg.type === 'done') {
      currentWorker = null;
      finalize(msg.buffer, true);

    } else if (msg.type === 'error') {
      currentWorker = null;
      onFatalError(
        'Error en compresión Draco: ' + msg.message +
        ' · Desactiva Draco e intenta de nuevo.'
      );
    }
  };

  currentWorker.onerror = (e) => {
    if (myRunId !== runId) return;
    currentWorker = null;
    console.error('Draco worker error:', e);
    // Likely cause: draco-worker.bundle.js not found (npm run build not executed yet)
    onFatalError(
      'No se pudo cargar el módulo Draco. ' +
      'Asegúrate de haber ejecutado "npm run build" y de que draco-worker.bundle.js esté disponible.'
    );
  };

  const bufCopy = buffer.slice(0);
  currentWorker.postMessage({ type: 'compress', buffer: bufCopy, options: {} }, [bufCopy]);
}

// ─────────────────────────────────────────────────────────
//  Phase 1 — Texture + geometry optimizer worker
// ─────────────────────────────────────────────────────────
function runOptimization() {
  terminateWorker();
  const myRunId    = ++runId;
  const dracoActive = $('dracoEnabled').checked;

  dropzone.style.display = 'none';
  resCard.classList.remove('vis');
  errMsg.classList.remove('vis');
  statusCard.classList.add('vis');
  setProgress(3, 'Preparando...', fmtBytes(originalBuf.byteLength) + ' detectados');

  currentWorker = new Worker('optimizer-worker.js');

  currentWorker.onmessage = (e) => {
    if (myRunId !== runId) return;
    const msg = e.data;

    if (msg.type === 'progress') {
      // With Draco: scale phase-1 progress (0–100) into 3–55% range.
      // Without Draco: pass through as-is.
      const pct = dracoActive
        ? Math.round(3 + (msg.pct / 100) * 52)
        : msg.pct;
      setProgress(pct, msg.step, msg.txt);

    } else if (msg.type === 'done') {
      currentWorker = null;
      if (dracoActive) {
        spawnDracoWorker(msg.buffer, myRunId);
      } else {
        finalize(msg.buffer, false);
      }

    } else if (msg.type === 'error') {
      currentWorker = null;
      onFatalError('Error al optimizar: ' + msg.message);
    }
  };

  currentWorker.onerror = (e) => {
    if (myRunId !== runId) return;
    currentWorker = null;
    onFatalError('Error interno en el optimizador. Revisa la consola para más detalles.');
    console.error('Optimizer worker error:', e);
  };

  // Clone so originalBuf stays intact for re-optimization
  const bufCopy = originalBuf.slice(0);
  currentWorker.postMessage(
    {
      type: 'optimize',
      buffer: bufCopy,
      options: {
        textureSize: selectedSize,
        jpegQuality: +$('jpegSlider').value / 100,
        geoOpt:      $('geoOpt').checked,
      },
    },
    [bufCopy]
  );
}
