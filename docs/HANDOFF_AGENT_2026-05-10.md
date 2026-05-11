# Handoff — ComputerSelectorHelper: Estado actual y decisiones de diseño

**Para:** Agente entrante  
**Fecha:** 2026-05-10  
**Proyecto:** ComputerSelectorHelper — `e:\Job\ComputerSelectorHelper`  
**Stack:** React 19 + Vite 6 + React Router DOM 7 + Vercel Analytics

---

## 1. ¿Qué es este proyecto?

Una web app que ayuda a usuarios no técnicos a elegir una laptop. El usuario contesta un quiz de 10 preguntas (uso, presupuesto, OS, gaming, etc.) y recibe specs recomendadas + modelos concretos con precios en MXN.

**URL producción:** `https://computerselectorhelper.vercel.app`

---

## 2. Todo lo que se hizo en esta sesión

### 2.1 Auditoría y fixes iniciales (FIXES_2026-05-10.md)

Se auditó el proyecto completo y se solucionaron:

| ID | Problema | Solución |
|----|----------|----------|
| BUG-01 | `loadSavedState()` llamada 3 veces en init | Una sola llamada con `initialState` |
| BUG-02 | RAM warning nunca disparaba (lógica duplicada) | Eliminado el bloque muerto |
| BUG-03 | `system='any'` sin rama en switch OS | Agregado `case 'any':` explícito |
| BUG-04 | `.FallbackButton` CSS partido en 2 bloques | Fusionados en uno |
| BUG-05/06/07 | Imágenes duplicadas/inventadas en laptopModels | URLs corregidas |
| BUG-09 | `src/notas.jsx` archivo muerto | Movido a `docs/notas_dev.md` |
| DT-01 | Budget threshold sin documentar | Comentario explícito |
| DT-02 | `scoreGPU` duplicado en 2 funciones | Extraído a top-level |
| DT-03 | Wildcard route → Landing | Creado `NotFound` page |
| DT-05 | Sin `robots.txt` ni `sitemap.xml` | Creados en `public/` |
| UX-03 | LaptopCard texto igual para exactos y aproximados | Heading condicional por `isApproximate` |
| UX-05 | Sin scroll to top al ver resultados | `scrollTo({ top:0, behavior:'smooth' })` |

### 2.2 Feature: Sistema de compartir resultados

**Archivo clave:** `src/utils/shareUtils.js`

Permite compartir el resultado del quiz via URL sin backend:

```
/quiz?plan=<base64(JSON.stringify(answers))>
```

- `encodeAnswers(answers)` → base64 URL-safe
- `decodeAnswers(encoded)` → objeto de respuestas o `null`
- `buildWhatsAppText(result, url)` → texto formateado para `wa.me/?text=`

**¿Por qué base64 y no un ID de servidor?**  
Zero cost de infraestructura. La URL es auto-contenida, funciona offline, y el servidor no necesita saber nada. El trade-off es que la URL es larga (~200 chars), pero es aceptable para WhatsApp y la mayoría de apps de mensajería.

**En `Recommendation.jsx`:**
- `useEffect` en mount lee `?plan=` y llama `convertToSpecs(decoded)` directamente
- Banner `SharedViewBanner` avisa cuando es un link ajeno, con CTA "Hacer mi propio quiz"
- `handleReset` limpia el param con `history.replaceState`
- Botón verde "Compartir" (Web Share API en mobile / clipboard en desktop)
- Botón verde WhatsApp (`wa.me/?text=...`)

### 2.3 Feature: Módulo de comparación de laptops (`/compare`)

**Archivos clave:**
- `src/pages/Compare/Compare.jsx` — componente principal
- `src/pages/Compare/Compare.css` — estilos
- `src/utils/parseSpecs.js` — parser de spec strings

**¿Qué hace?**
- Grid de tarjetas filtrables/buscables del catálogo completo
- Selección de hasta 3 modelos
- Tabla comparativa lado a lado con highlight automático del mejor valor
- URL compartible: `/compare?models=id1,id2,id3`
- Persistencia en `localStorage` (key `csh_compare_ids`)
- Grid colapsable (toggle + auto-collapse al seleccionar 2+)

**¿Por qué `parseSpecs.js` y no datos estructurados en `laptopModels.js`?**  
Los modelos ya existen con `specs` como string libre (ej: `"Intel Core i5 13420H, 16 GB RAM, 512 GB SSD, 15.6" FHD"`). Agregar campos estructurados requeriría editar los ~35 modelos manualmente y mantener dos fuentes de verdad. El parser regex cubre los casos reales del catálogo actual. Si el catálogo crece mucho o se añaden APIs externas, migrarlo a campos estructurados sería el siguiente paso.

**GPU Tier system (`getGPUTier`):**  
Mapea el string del GPU a un número (1–10) para poder comparar GPUs heterogéneas (RTX vs Apple Silicon vs integradas). La escala es aproximada: no refleja TDP ni variantes Max-Q/Max-P. Es suficiente para dar contexto "cuál GPU es mejor" a un usuario no técnico.

**`getBestIndices(values, higherIsBetter)`:**  
Función pura que recibe un array de números y retorna un array de booleanos marcando cuáles son el "mejor" valor. Excluye ceros para no marcar como "ganador" un dato faltante. Permite empates (ambos marcados si tienen el mismo valor).

**Decisión de diseño — grid colapsable:**  
Cuando el usuario selecciona el 2do modelo, el grid se auto-colapsa y el scroll lleva directo a la tabla. Esto evita que el usuario tenga que scrollear manualmente para ver la comparación. El botón "Mostrar/Ocultar catálogo" permite volver al grid. La tira de chips (pill con imagen+nombre+×) permite quitar modelos sin expandir el catálogo.

---

## 3. Arquitectura de datos actual

```
src/utils/
├── laptopModels.js      ← catálogo (~35 modelos, datos planos)
├── convertToSpecs.jsx   ← motor de inferencia quiz → specs recomendadas
├── matchLaptopClass.jsx ← matcher specs → modelos del catálogo
├── shareUtils.js        ← encode/decode answers para URL sharing
└── parseSpecs.js        ← parser spec strings → campos numéricos (para /compare)
```

### Flujo del quiz
```
answers (objeto) 
  → convertToSpecs(answers) 
      → { processor, ram, gpu, storage, os, portability, battery,
          rationale[], warnings[], flags{}, budget,
          laptopClass[], approximateClass[] }
```

`matchLaptopClass(specs)` filtra el catálogo por OS, RAM, GPU, budget, luego puntúa por `scoreGPU` y retorna top 3.

`matchLaptopClassRelaxed(specs)` hace lo mismo pero con restricciones más laxas, como fallback cuando no hay matches exactos.

---

## 4. Estado de las rutas

| Ruta | Componente | Propósito |
|------|-----------|-----------|
| `/` | `Landing` | Landing page con CTA al quiz |
| `/quiz` | `Quiz` → `Recommendation` | Quiz completo + resultados |
| `/compare` | `Compare` | Comparador de modelos |
| `*` | `NotFound` | Página 404 |

---

## 5. Persistencia de estado

| Dato | Mecanismo | Key |
|------|-----------|-----|
| Progreso quiz (step, answers, result) | `localStorage` | `csh_quiz_state` |
| Selección del comparador | `localStorage` | `csh_compare_ids` |
| Resultado compartido | URL query param | `?plan=<base64>` |
| Comparación compartida | URL query param | `?models=id1,id2` |

---

## 6. SEO actual

- `react-helmet-async` en todas las páginas con title + meta description + OG tags
- `public/robots.txt` — bloquea `?plan=` (contenido dinámico no indexable)
- `public/sitemap.xml` — 2 rutas: `/` y `/quiz`
- La ruta `/compare` **no está en el sitemap** todavía (agregar si se decide indexar)

---

## 7. Pendientes conocidos (próximo agente)

| Prioridad | Item | Contexto |
|-----------|------|----------|
| 🔴 | Agregar `/compare` al sitemap | Ahora que es una ruta pública estable |
| 🟡 | INF-01: Pregunta de nivel técnico del usuario | Cambiaría cómo se muestra el resultado (técnico vs. simple) |
| 🟡 | INF-02: Budget bucket `premium` (>$25k MXN) | Hay laptops en catálogo a $34k–$39k sin bucket propio |
| 🟡 | F-02: Historial de últimas consultas (localStorage) | MVP: últimos 3 resultados en Landing |
| 🟢 | UX-04: Dark mode | Requiere refactor completo de variables CSS |
| 🟢 | BUG-08: Estructura de headings en Landing | 3× `<h2>` sin `<h1>` propio (el `h1` está en App.jsx) |
| 🟢 | DT-04: Renombrar `convertToSpecs.jsx` y `matchLaptopClass.jsx` a `.js` | Son módulos JS puros sin JSX |
| 🔵 | Compare: integrar con resultados del quiz | Botón "Comparar mis modelos sugeridos" en results |
| 🔵 | Compare: gráfico de barras | Recharts o Chart.js para visualización de specs |
| 🔵 | Compare: exportar como PDF/imagen | html2canvas o jsPDF |

---

## 8. Convenciones del proyecto

- **CSS:** Vanilla CSS con variables en `:root` (ver `src/index.css`). No se usa Tailwind.
- **Componentes:** cada componente en su propia carpeta con `.jsx` + `.css` al mismo nivel.
- **Utils:** funciones puras en `src/utils/`. Sin hooks en utils.
- **Sin TypeScript:** proyecto en JS puro con JSX.
- **Testing:** Vitest instalado (`pnpm test`), pero sin tests escritos todavía.
- **Deploy:** Vercel. El `vercel.json` existe en raíz. `pnpm run build` genera `dist/`.
- **Analytics:** `@vercel/analytics` inyectado en `App.jsx`. No requiere configuración extra.

---

## 9. Comandos útiles

```bash
pnpm run dev       # Servidor de desarrollo (Vite, HMR)
pnpm run build     # Build de producción → dist/
pnpm run lint      # ESLint 9
pnpm test          # Vitest (sin tests por ahora)
```

---

## 10. Archivos de documentación en /docs

| Archivo | Contenido |
|---------|-----------|
| `FIXES_2026-05-10.md` | Bugs corregidos en sesión 1 (audit general) |
| `FIXES_COMPARE_2026-05-10.md` | Bugs del módulo Compare (sesión 2) |
| `FEATURE_COMPARE.md` | Documentación técnica del módulo /compare |
| `SDD_SKILLS_USAGE.md` | Guía de uso de skills SDD del proyecto |
| `notas_dev.md` | Notas de desarrollo (movidas desde src/) |
