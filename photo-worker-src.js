// Source file — bundled by build.js into photo-worker.bundle.js
// Do NOT load this file directly in the browser.

import { WebIO }          from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { simplify, weld, prune } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';

const progress = (pct, step, txt) =>
  self.postMessage({ type: 'progress', pct, step, txt });

// Count triangles across all mesh primitives.
// Uses index accessor when present; falls back to vertex count estimate.
function countTriangles(doc) {
  let total = 0;
  for (const mesh of doc.getRoot().listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      const indices = prim.getIndices();
      if (indices) {
        total += indices.getCount() / 3;
      } else {
        const pos = prim.getAttribute('POSITION');
        if (pos) total += pos.getCount() / 3;
      }
    }
  }
  return Math.round(total);
}

// Returns the fraction of vertices to keep, or null if no reduction is needed.
function targetRatio(triangles) {
  if (triangles > 1_000_000) return 250_000 / triangles;
  if (triangles >   500_000) return 200_000 / triangles;
  if (triangles >   300_000) return 150_000 / triangles;
  return null;
}

self.onmessage = async (e) => {
  const { type, buffer } = e.data;
  if (type !== 'reduce') return;

  try {
    progress(5, 'Iniciando simplificación...', 'Cargando módulo WASM de meshoptimizer');
    await MeshoptSimplifier.ready;

    const io = new WebIO().registerExtensions(ALL_EXTENSIONS);

    progress(15, 'Analizando modelo...', 'Parseando estructura del GLB');
    const doc = await io.readBinary(new Uint8Array(buffer));

    const triangles = countTriangles(doc);
    const ratio = targetRatio(triangles);

    if (ratio === null) {
      // Model already within AR budget — pass through unchanged.
      progress(88, 'Sin reducción necesaria',
        `${(triangles / 1000).toFixed(0)}k triángulos — geometría ya optimizada`);
      const result = await io.writeBinary(doc);
      progress(100, 'Completado ✓', 'El modelo no requiere reducción de polígonos');
      self.postMessage({ type: 'done', buffer: result.buffer }, [result.buffer]);
      return;
    }

    const targetK = Math.round(triangles * ratio / 1000);

    progress(30, 'Soldando vértices...',
      `${(triangles / 1000).toFixed(0)}k triángulos detectados · preparando malla`);
    await doc.transform(weld({ tolerance: 1e-4 }));

    progress(52, 'Reduciendo polígonos...',
      `Simplificando a ~${targetK}k triángulos`);
    await doc.transform(
      simplify({ simplifier: MeshoptSimplifier, ratio, error: 0.002 })
    );

    progress(75, 'Limpiando geometría...', 'Eliminando datos no utilizados');
    await doc.transform(prune());

    progress(88, 'Serializando GLB...', 'Empaquetando modelo reducido');
    const result = await io.writeBinary(doc);

    const finalTriangles = countTriangles(doc);
    progress(100, 'Completado ✓',
      `${(finalTriangles / 1000).toFixed(0)}k triángulos (desde ${(triangles / 1000).toFixed(0)}k)`);

    self.postMessage({ type: 'done', buffer: result.buffer }, [result.buffer]);

  } catch (err) {
    self.postMessage({
      type:    'error',
      message: err instanceof Error ? err.message : String(err),
    });
  }
};
