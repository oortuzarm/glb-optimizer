// Run with: node build.js
// Requires: npm install
// Output:   draco-worker.bundle.js + draco_encoder.wasm + draco_decoder.wasm
const fs     = require('fs');
const path   = require('path');
const esbuild = require('esbuild');

// ── 1. Copy WASM files from draco3dgltf ──────────────────
const dracoDir = path.join(__dirname, 'node_modules', 'draco3dgltf');
const wasmFiles = ['draco_encoder.wasm', 'draco_decoder.wasm'];

for (const file of wasmFiles) {
  const src = path.join(dracoDir, file);
  if (!fs.existsSync(src)) {
    console.error(`ERROR: ${src} not found. Run "npm install" first.`);
    process.exit(1);
  }
  fs.copyFileSync(src, path.join(__dirname, file));
  console.log('Copied:', file);
}

// ── 2. Bundle draco-worker-src.js → draco-worker.bundle.js ──
esbuild.build({
  entryPoints: ['draco-worker-src.js'],
  bundle:      true,
  format:      'iife',
  platform:    'browser',
  target:      ['chrome80', 'firefox114', 'safari15'],
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.versions':     'null',
  },
  mainFields:  ['browser', 'module', 'main'],
  conditions:  ['browser'],
  outfile:     'draco-worker.bundle.js',
  logLevel:    'info',
}).then(() => {
  console.log('\nBuild complete → draco-worker.bundle.js');
  console.log('Deploy these files alongside index.html:');
  console.log('  draco-worker.bundle.js');
  console.log('  draco_encoder.wasm');
  console.log('  draco_decoder.wasm');
}).catch(() => process.exit(1));
