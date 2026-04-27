'use strict';

// ─────────────────────────────────────────────────────────
//  State
// ─────────────────────────────────────────────────────────
let selectedSize  = 1024;
let optimizedBuf  = null;
let origFileName  = '';
let originalBuf   = null;
let currentWorker = null;

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

  // MIME validation — be lenient; browsers often report GLB as octet-stream or leave it blank
  const t = (file.type || '').toLowerCase();
  if (t && t.startsWith('text/'))
    return `Tipo de archivo no compatible (${file.type}). Selecciona un archivo .glb válido.`;

  return null;
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
//  Worker management
// ─────────────────────────────────────────────────────────
function terminateWorker() {
  if (currentWorker) {
    currentWorker.terminate();
    currentWorker = null;
  }
}

function runOptimization() {
  terminateWorker();

  dropzone.style.display = 'none';
  resCard.classList.remove('vis');
  errMsg.classList.remove('vis');
  statusCard.classList.add('vis');
  setProgress(5, 'Preparando...', fmtBytes(originalBuf.byteLength) + ' detectados');

  currentWorker = new Worker('optimizer-worker.js');

  currentWorker.onmessage = (e) => {
    const msg = e.data;

    if (msg.type === 'progress') {
      setProgress(msg.pct, msg.step, msg.txt);

    } else if (msg.type === 'done') {
      currentWorker = null;
      optimizedBuf  = msg.buffer;

      statusCard.classList.remove('vis');
      resCard.classList.add('vis');

      $('origSz').textContent = fmtBytes(originalBuf.byteLength);
      $('optSz').textContent  = fmtBytes(msg.buffer.byteLength);
      const red = (originalBuf.byteLength - msg.buffer.byteLength) / originalBuf.byteLength * 100;
      $('redPct').textContent = (red > 0 ? red.toFixed(1) : '0') + '%';

    } else if (msg.type === 'error') {
      currentWorker = null;
      statusCard.classList.remove('vis');
      showErr('Error al optimizar: ' + msg.message);
      if (!optimizedBuf) dropzone.style.display = '';
    }
  };

  currentWorker.onerror = (e) => {
    currentWorker = null;
    statusCard.classList.remove('vis');
    showErr('Error interno en el optimizador. Revisa la consola para más detalles.');
    if (!optimizedBuf) dropzone.style.display = '';
    console.error('Worker error:', e);
  };

  // Clone the buffer so originalBuf stays intact for re-optimization
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
