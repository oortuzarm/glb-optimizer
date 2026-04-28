'use strict';
// ─────────────────────────────────────────────────────────
//  Build script — node build.js
//  Requires:  npm install
//  Produces:  draco-worker.bundle.js
//             draco_encoder[_gltf].wasm
//             draco_decoder[_gltf].wasm
//
//  Why the node-browser-compat plugin exists:
//  draco3dgltf ships only Node.js Emscripten wrappers (_nodejs.js).
//  Those wrappers have the pattern:
//
//    var IS_NODE = typeof process==="object" && ... && typeof process.versions.node==="string";
//    if (IS_NODE) { var fs = require("fs"); var path = require("path"); }
//
//  At runtime inside a browser Worker, IS_NODE is always false (no `process`),
//  so fs/path are never actually called.  But esbuild resolves ALL require()
//  calls statically at build time, before dead-code elimination runs on the
//  `if (IS_NODE)` block — so it errors with "Could not resolve 'fs'".
//
//  The plugin intercepts those require() calls at build time and injects
//  no-op stub modules directly into the bundle.  They are imported but
//  never invoked in the browser.
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
 * Tries each filename in `candidates` inside DRACO_DIR.
 * Copies the first one found to ROOT preserving its original name —
 * that name must match what the Emscripten locateFile() callback asks for.
 * Returns the filename that was found and copied.
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
    `  2. Lista los archivos en node_modules/draco3dgltf/ y agrega el nombre correcto.\n` +
    `  3. Verifica la versión de draco3dgltf en package.json.`
  );
}

// ── esbuild plugin: Node.js built-in stubs ────────────────
//
// Provides minimal no-op implementations of `fs` and `path` so esbuild
// can resolve them at bundle time.  They are never called in the browser
// because Emscripten's ENVIRONMENT_IS_NODE check evaluates to false.
//
// Adding new stubs here if a future draco3dgltf version imports other
// Node.js built-ins (e.g. `crypto`, `os`).
const nodeCompatStubs = {
  fs: `
    module.exports = {
      readFileSync:  function() { return new Uint8Array(0); },
      readFile:      function(_, cb) { cb(new Error('fs not available')); },
      existsSync:    function() { return false; },
      writeFileSync: function() {},
    };
  `,
  path: `
    module.exports = {
      join:      function() { return Array.prototype.slice.call(arguments).filter(Boolean).join('/'); },
      dirname:   function(p) { return (p || '').split('/').slice(0, -1).join('/') || '.'; },
      normalize: function(p) { return p; },
      resolve:   function() { return Array.prototype.slice.call(arguments).pop() || ''; },
    };
  `,
};

const nodeCompatPlugin = {
  name: 'node-browser-compat',
  setup(build) {
    // Match bare specifiers: 'fs', 'path', and their 'node:' prefixed variants.
    build.onResolve({ filter: /^(node:)?(fs|path)$/ }, (args) => {
      const name = args.path.replace(/^node:/, '');
      if (nodeCompatStubs[name]) {
        return { path: name, namespace: 'node-browser-compat' };
      }
    });

    build.onLoad({ filter: /.*/, namespace: 'node-browser-compat' }, (args) => {
      const stub = nodeCompatStubs[args.path];
      return stub
        ? { contents: stub, loader: 'js' }
        : { contents: 'module.exports = {};', loader: 'js' };
    });
  },
};

// ── Step 0: Verify draco3dgltf is installed ───────────────
if (!fs.existsSync(DRACO_DIR)) {
  die(
    `node_modules/draco3dgltf no encontrado en:\n  ${DRACO_DIR}\n\n` +
    `Ejecuta "npm install" primero.`
  );
}

try {
  const pkgJson = JSON.parse(fs.readFileSync(path.join(DRACO_DIR, 'package.json'), 'utf8'));
  console.log(`\ndraco3dgltf v${pkgJson.version || 'desconocida'} en: ${DRACO_DIR}\n`);
} catch (_) {
  console.log(`\ndraco3dgltf encontrado en: ${DRACO_DIR}\n`);
}

// ── Step 1: Copy WASM files (with automatic name detection) ──
console.log('─── Copiando archivos WASM ──────────────────────────');

const encoderWasm = findAndCopy(
  ['draco_encoder.wasm', 'draco_encoder_gltf.wasm'],
  'encoder'
);

const decoderWasm = findAndCopy(
  ['draco_decoder.wasm', 'draco_decoder_gltf.wasm'],
  'decoder'
);

// ── Step 2: Bundle draco-worker-src.js ───────────────────
console.log('\n─── Bundleando draco-worker-src.js ──────────────────');

esbuild.build({
  entryPoints:   [path.join(ROOT, 'draco-worker-src.js')],
  bundle:        true,
  format:        'iife',
  platform:      'browser',
  target:        ['chrome80', 'firefox114', 'safari15'],
  plugins:       [nodeCompatPlugin],
  define: {
    // Help esbuild constant-fold Emscripten's ENVIRONMENT_IS_NODE variable
    // so that dead-code elimination has a better chance of pruning the if-block.
    // Even without full DCE, the stubs above ensure no runtime error occurs.
    'process.env.NODE_ENV':      '"production"',
    'process.versions.node':     'undefined',
    'process.versions':          '{}',
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

  // Sanity-check: bundle must NOT contain unresolved Node.js module references.
  const bundlePath = path.join(ROOT, 'draco-worker.bundle.js');
  const bundleContent = fs.readFileSync(bundlePath, 'utf8');
  const nodeModulePattern = /require\(["'](fs|path|crypto|os|util)["']\)/;
  if (nodeModulePattern.test(bundleContent)) {
    die(
      'El bundle generado contiene referencias a módulos Node.js sin resolver.\n' +
      'Revisa el plugin nodeCompatPlugin en build.js.'
    );
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
