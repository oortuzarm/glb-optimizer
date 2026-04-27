'use strict';
// ─────────────────────────────────────────────────────────
//  Build script — node build.js
//  Requires:  npm install
//  Produces:  draco-worker.bundle.js
//             draco_encoder[_gltf].wasm
//             draco_decoder[_gltf].wasm
// ─────────────────────────────────────────────────────────
const fs      = require('fs');
const path    = require('path');
const esbuild = require('esbuild');

const ROOT      = path.resolve(__dirname);
const DRACO_DIR = path.join(ROOT, 'node_modules', 'draco3dgltf');

// ── Helpers ───────────────────────────────────────────────
function die(msg) {
  console.error('\n✗  ERROR:', msg);
  process.exit(1);
}

function sizeKB(filepath) {
  return Math.round(fs.statSync(filepath).size / 1024);
}

/**
 * Tries each filename in `candidates` inside the draco3dgltf package directory.
 * Copies the first one found to ROOT, preserving its original name so that the
 * Emscripten locateFile() callback (which also uses the original name) resolves
 * to the right URL without any mapping.
 * Returns the actual filename that was found and copied.
 */
function findAndCopy(candidates, label) {
  for (const filename of candidates) {
    const src = path.join(DRACO_DIR, filename);
    if (fs.existsSync(src)) {
      const dst = path.join(ROOT, filename);
      fs.copyFileSync(src, dst);
      console.log(`  ✓  ${label}: copied  ${filename}  (${sizeKB(dst)} KB)`);
      return filename;
    }
  }

  const searched = candidates
    .map(f => `      node_modules/draco3dgltf/${f}`)
    .join('\n');

  die(
    `No se encontró el WASM del ${label} de Draco.\n` +
    `Archivos buscados:\n${searched}\n\n` +
    `Soluciones:\n` +
    `  1. Ejecuta "npm install" si no lo has hecho.\n` +
    `  2. Verifica qué archivos existen en node_modules/draco3dgltf/\n` +
    `  3. Actualiza la lista de candidatos en build.js si el paquete usa otro nombre.`
  );
}

// ── Step 0: Verify draco3dgltf is installed ───────────────
if (!fs.existsSync(DRACO_DIR)) {
  die(
    `node_modules/draco3dgltf no encontrado en:\n  ${DRACO_DIR}\n\n` +
    `Ejecuta "npm install" primero.`
  );
}

// Log installed version for debugging
try {
  const pkgJson = JSON.parse(
    fs.readFileSync(path.join(DRACO_DIR, 'package.json'), 'utf8')
  );
  console.log(`\ndraco3dgltf v${pkgJson.version || 'desconocida'} encontrado en:`);
  console.log(`  ${DRACO_DIR}\n`);
} catch (_) {
  console.log(`\ndraco3dgltf encontrado en: ${DRACO_DIR}\n`);
}

// ── Step 1: Copy WASM files ───────────────────────────────
console.log('─── Copiando archivos WASM ──────────────────────────');

const encoderWasm = findAndCopy(
  ['draco_encoder.wasm', 'draco_encoder_gltf.wasm'],
  'encoder'
);

const decoderWasm = findAndCopy(
  ['draco_decoder.wasm', 'draco_decoder_gltf.wasm'],
  'decoder'
);

// ── Step 2: Bundle the Draco worker ──────────────────────
console.log('\n─── Bundleando draco-worker-src.js ──────────────────');

esbuild.build({
  entryPoints:   [path.join(ROOT, 'draco-worker-src.js')],
  bundle:        true,
  format:        'iife',
  platform:      'browser',
  target:        ['chrome80', 'firefox114', 'safari15'],
  define: {
    // Emscripten checks `typeof process.versions.node === 'string'` to detect Node.js.
    // Using null would cause null.node → TypeError; {} makes .node === undefined → false (browser path).
    'process.env.NODE_ENV':      '"production"',
    'process.versions':          '{}',
    'process.versions.node':     'undefined',
    'process.platform':          '"browser"',
  },
  mainFields:    ['browser', 'module', 'main'],
  conditions:    ['browser'],
  absWorkingDir: ROOT,
  outfile:       path.join(ROOT, 'draco-worker.bundle.js'),
  logLevel:      'warning',
})
.then(() => {

  // ── Step 3: Post-build validation ──────────────────────
  console.log('\n─── Validando archivos de salida ────────────────────');

  const required = ['draco-worker.bundle.js', encoderWasm, decoderWasm];
  let allOk = true;

  for (const filename of required) {
    const fullPath = path.join(ROOT, filename);
    if (fs.existsSync(fullPath)) {
      console.log(`  ✓  ${filename}  (${sizeKB(fullPath)} KB)`);
    } else {
      console.error(`  ✗  FALTA: ${filename}`);
      allOk = false;
    }
  }

  if (!allOk) {
    die('Build incompleto — uno o más archivos de salida no fueron generados.');
  }

  console.log('\n✓  Build completado exitosamente.\n');
  console.log('Archivos que deben estar en el servidor junto a index.html:');
  required.forEach(f => console.log(`  ${f}`));
  console.log('');

})
.catch((err) => {
  console.error('\nError en esbuild:', err.message || err);
  process.exit(1);
});
