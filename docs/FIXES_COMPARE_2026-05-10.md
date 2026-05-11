# Fix Log — Compare Module — 2026-05-10 (sesión 2)

Referencia: `FIXES_2026-05-10.md` (sesión anterior), `FEATURE_COMPARE.md`.

---

## Bugs reportados y resueltos

### BUG-C01 — Estado de selección no persiste al navegar

**Síntoma:** Al ir a otra ruta (ej. `/quiz`) y volver a `/compare`, los modelos seleccionados se perdían.

**Causa:** `selectedIds` vivía solo en el estado local de React. Al desmontar el componente (navegar), el estado se destruía.

**Fix:**
```js
const LS_KEY = 'csh_compare_ids'

// Guardar en cada cambio
useEffect(() => {
  localStorage.setItem(LS_KEY, JSON.stringify(selectedIds))
}, [selectedIds])

// Restaurar al montar — URL param tiene prioridad
useEffect(() => {
  const raw = params.get('models')
  if (raw) { /* cargar desde URL */ return }
  const saved = localStorage.getItem(LS_KEY)
  // validar y setSelectedIds(valid)
}, [])
```

**Prioridad de restauración:**
1. `?models=id1,id2` en URL (compartir link)
2. `localStorage` (sesión previa)
3. Vacío

---

### BUG-C02 — Layout se "mueve" / crece al seleccionar modelos

**Síntoma:** Al agregar modelos y aparecer la tabla de comparación, la página saltaba/se desplazaba bruscamente. El contenido no quedaba en posición estable.

**Causa:** `#root` en `App.css` usa `display: flex; flex-direction: column; justify-content: center`. Cuando el contenido es corto, lo centra verticalmente. Al crecer (tabla aparece), el centro geométrico cambia y el contenido salta visualmente.

**Fix CSS:**
```css
.ComparePage {
  align-self: flex-start; /* ancla la página al top del flex container */
}
```

**Fix animación:** la tabla aparece con `fadeIn + translateY` de 300ms para que la expansión se sienta intencional:
```css
.CompareTableSection {
  animation: tableAppear 0.3s ease-out;
}
@keyframes tableAppear {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

**Fix scroll:** cuando la tabla aparece por primera vez (1→2 modelos), se hace `scrollIntoView({ behavior: 'smooth' })` con un `ref` para que el usuario la vea sin tener que scrollear manualmente:
```js
const tableRef = useRef(null)
// en useEffect([selectedIds]):
if (tableVisible && !prevTableVisible.current && tableRef.current) {
  setTimeout(() => tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
}
```

---

### BUG-C03 — Grid queda colapsado al eliminar el único modelo seleccionado

**Síntoma:** Usuario tiene 1 modelo seleccionado → colapsa el grid → elimina ese modelo desde los chips → el grid queda colapsado y ya no hay botón para expandirlo (el botón solo aparece cuando `selectedIds.length > 0`).

**Causa:** `gridCollapsed` no tenía un mecanismo para resetearse automáticamente.

**Fix:**
```js
useEffect(() => {
  if (selectedIds.length === 0) setGridCollapsed(false)
}, [selectedIds])
```

Cuando la selección cae a 0, el grid se auto-expande independientemente del estado del toggle.

---

## Archivos modificados en esta sesión

| Archivo | Cambio |
|---------|--------|
| `src/pages/Compare/Compare.jsx` | BUG-C01 (localStorage), BUG-C02 (ref + scroll), BUG-C03 (auto-expand), `useRef` importado |
| `src/pages/Compare/Compare.css` | BUG-C02 (`align-self: flex-start`, `tableAppear` animation) |
