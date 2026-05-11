# Fix Log — UX/UI Audit Part 2 — 2026-05-10 (sesión 4)

---

## Mejoras aplicadas (Basadas en feedback)

### UX-09 — Deuda Técnica: Detección de OS centralizada
**Síntoma:** `parseSpecs.js` y `convertToSpecs.jsx` duplicaban lógica *hardcoded* para detectar macOS ("macbook", "m1") y ChromeOS ("chromebook").
**Fix:** Se extrajo esta lógica a `src/utils/osDetector.js` con las funciones `isMac`, `isChromeOS` e `isWindows`, centralizando el comportamiento y haciéndolo más escalable a futuro (ej. chips M5).

### UX-10 — Inferencia a Comparación (Flujo Roto)
**Síntoma:** El usuario recibía recomendaciones pero no tenía forma rápida de enviarlas a la tabla de comparación sin buscarlas manualmente.
**Fix:** Se agregó el botón `.CompareModelsBtn` ("Comparar estos modelos en detalle") en `Recommendation.jsx`. Éste lee el ID de las laptops recomendadas (ignorando las genéricas) y envía al usuario directamente a `/compare?models=id1,id2,id3`.

### UX-11 — Persistencia de la UI (Grid Collapsed)
**Síntoma:** Al ocultar el catálogo en la vista de comparación y cambiar a otra pestaña de la app, el estado volvía a abrir el catálogo molesto.
**Fix:** En `Compare.jsx`, el estado `gridCollapsed` ahora está sincronizado bidireccionalmente con el `localStorage` bajo la clave `csh_compare_grid_collapsed`.

### UX-12 — Header de Compare y Botón Volver
**Síntoma:** El botón de "Volver" rompía la alineación central del título y en móviles ocupaba mucho espacio vertical innecesario.
**Fix:** Se aplicó `position: absolute` al botón en el header. En móviles (max-width: 768px), el texto "Volver" se oculta, dejando sólo el ícono de flecha, ganando espacio valioso.

### UX-13 — Rediseño de Acciones Finales (Share vs Restart)
**Síntoma:** Los botones de "Compartir por link", "WhatsApp" y "Reiniciar" flotaban en el centro con distintos paddings y sin agrupación semántica.
**Fix:** Se creó un `.FinalActionsGrid` con dos tarjetas (ActionCards) en `Recommendation.jsx`. Ambas tienen el mismo peso visual, y los botones comparten la clase `.ActionBtn` para mantener tamaño y paddings consistentes.

### UX-14 — Tabla de Comparación en Móviles (UX táctil revisada)
**Síntoma:** El comportamiento `sticky` generaba un solapamiento visual confuso donde las laptops se deslizaban "por debajo" de la columna de etiquetas en móviles.
**Fix:** Se eliminó el `position: sticky` y `scroll-snap`. Ahora la tabla usa un diseño fluido tradicional de scroll lateral simple (`overflow-x: auto`), definiendo un espacio seguro visual sin solapamientos.

### UX-15 — Padding del Quiz en Móviles
**Síntoma:** La tarjeta del resultado del Quiz (`.ResultContainer`) sobresalía del ancho de la pantalla en dispositivos móviles debido a un padding excesivo combinado con el `width: 100%`.
**Fix:** Se redujo el ancho a `95vw` y se aplicaron paddings optimizados para pantallas pequeñas en `Recommendation.css`.

### UX-16 — Grilla de Selección de Laptops (Móvil)
**Síntoma:** La grilla en la página de Compare renderizaba 3 columnas en algunos celulares, volviendo ilegible la información.
**Fix:** Se ajustó el `grid-template-columns` a `minmax(45%, 1fr)` para forzar un máximo de 2 columnas en dispositivos pequeños.

### UX-17 — Bug Persistencia "Ocultar Catálogo"
**Síntoma:** La app no recordaba que el usuario había ocultado el catálogo al cambiar de pestaña, porque el evento de montaje reseteaba el estado a falso al ver el array vacío inicial.
**Fix:** Se agregó una referencia `isInitialMount` (useRef) en el `useEffect` de `Compare.jsx` para ignorar el reseteo automático durante el montaje inicial, permitiendo que el estado de `localStorage` persista correctamente.

---
**Status:** Estable. Listo para deploy.
