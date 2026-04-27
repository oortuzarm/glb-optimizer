// Source file — bundled by build.js into draco-worker.bundle.js
// Do NOT load this file directly in the browser.

import { WebIO }          from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { draco }          from '@gltf-transform/functions';
import draco3d            from 'draco3dgltf';

// Cache the IO instance so WASM init (~1-2s) only happens once per worker lifetime.
let cachedIO = null;

async function getIO() {
  if (cachedIO) return cachedIO;

  // Resolve WASM files relative to this worker script's directory.
  //
  // Emscripten calls locateFile(originalFilename) where originalFilename is
  // whatever name was compiled into the JS wrapper (e.g. "draco_decoder.wasm"
  // or "draco_decoder_gltf.wasm" depending on the draco3dgltf version).
  //
  // build.js copies the WASM files preserving their original names, so
  // returning base + filename always resolves to the correct served file —
  // no name mapping needed regardless of the draco3dgltf version.
  const base = new URL('./', self.location.href).href;
  const locateFile = (filename) => base + filename;

  const [encoderModule, decoderModule] = await Promise.all([
    draco3d.createEncoderModule({ locateFile }),
    draco3d.createDecoderModule({ locateFile }),
  ]);

  const io = new WebIO().registerExtensions(ALL_EXTENSIONS);
  io.registerDependencies({
    'draco3d.encoder': encoderModule,
    'draco3d.decoder': decoderModule,
  });

  cachedIO = io;
  return io;
}

self.onmessage = async (e) => {
  const { type, buffer, options = {} } = e.data;
  if (type !== 'compress') return;

  const progress = (pct, step, txt) =>
    self.postMessage({ type: 'progress', pct, step, txt });

  try {
    progress(5,  'Cargando Draco...',        'Inicializando compresor WASM');
    const io = await getIO();

    progress(25, 'Parseando geometría...',   'Leyendo mallas del modelo');
    const document = await io.readBinary(new Uint8Array(buffer));

    progress(50, 'Aplicando Draco...',       'Comprimiendo vértices y atributos');
    await document.transform(
      draco({
        method:           'edgebreaker',
        encodeSpeed:      options.encodeSpeed      ?? 5,
        decodeSpeed:      options.decodeSpeed      ?? 5,
        quantizePosition: options.quantizePosition ?? 14,
        quantizeNormal:   options.quantizeNormal   ?? 10,
        quantizeTexcoord: options.quantizeTexcoord ?? 12,
        quantizeColor:    options.quantizeColor    ?? 8,
        quantizeGeneric:  options.quantizeGeneric  ?? 12,
      })
    );

    progress(82, 'Serializando GLB...',      'Empaquetando con extensión Draco');
    const result = await io.writeBinary(document);

    progress(100, 'Completado ✓',            'Compresión Draco finalizada');

    // result is Uint8Array; transfer its underlying buffer (zero-copy).
    self.postMessage({ type: 'done', buffer: result.buffer }, [result.buffer]);

  } catch (err) {
    self.postMessage({
      type:    'error',
      message: err instanceof Error ? err.message : String(err),
    });
  }
};
