# Feature: Módulo de Comparación de Laptops

**Fecha:** 2026-05-10  
**Ruta:** `/compare`

---

## Descripción

Nuevo módulo que permite seleccionar hasta **3 laptops** del catálogo y compararlas lado a lado en una tabla de especificaciones, con resaltado automático del mejor valor en cada fila.

---

## Flujo de usuario

```
Landing / Resultados
   └── Click "Comparar" en la nav
         └── /compare
               ├── Buscar / filtrar modelos
               ├── Click en cards para seleccionar (max 3)
               └── Tabla comparativa aparece automáticamente
                     └── Botón "Compartir comparación"
```

---

## Características implementadas

### Selector de modelos
- Grid de tarjetas con imagen, nombre y precio
- Filtro por sistema operativo (Windows / macOS / ChromeOS)
- Búsqueda por nombre, specs o GPU en tiempo real
- Ordenamiento por: precio, RAM, GPU tier o nombre
- Hasta 3 modelos seleccionables (cards extra quedan deshabilitadas)
- Feedback visual: borde azul + fondo azul claro al seleccionar

### Tabla comparativa
- Se muestra automáticamente al seleccionar 2 o más modelos
- Scroll horizontal en mobile
- Fila "Quitar" con botón `×` por modelo
- Filas comparadas:
  | Fila | Lógica de highlight |
  |------|-------------------|
  | 💰 Precio | Verde = menor precio |
  | 🧠 RAM | Verde = más GB |
  | 💾 Almacenamiento | Verde = más GB/TB |
  | 🎮 GPU | Verde = mayor tier |
  | ⚙️ Procesador | Sin highlight (textual) |
  | 🖥️ Pantalla | Sin highlight (textual + tipo) |
  | 💻 Sistema | Sin highlight |
  | 🎒 Portabilidad | Sin highlight |
  | ✅ Ideal para | Sin highlight |
  | 🔗 Ver | Link a búsqueda en Google |

### Compartir comparación
- URL: `/compare?models=id1,id2,id3`
- Botón "Compartir comparación" copia la URL al clipboard
- Al abrir el link, los modelos se pre-seleccionan automáticamente
- La selección actualiza el URL en tiempo real via `history.replaceState`

### Navegación
- Nuevo ítem "Comparar" en la barra de nav global (`AppNav`)
- Botón "Volver" retorna a la página anterior (`navigate(-1)`)

---

## Archivos creados

| Archivo | Descripción |
|---------|-------------|
| `src/pages/Compare/Compare.jsx` | Componente principal de la página |
| `src/pages/Compare/Compare.css` | Estilos: grid, tabla, filtros, badges |
| `src/utils/parseSpecs.js` | Parser de spec strings → campos numéricos |

## Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `src/routes/AppRoutes.jsx` | Agregada ruta `/compare` |
| `src/App.jsx` | Agregada `<nav>` con NavLink a Inicio / Quiz / Comparar |
| `src/App.css` | Estilos `.AppNav`, `.AppNav__link`, `.AppNav__link.active` |

---

## Arquitectura técnica

### `parseSpecs.js`

```
parseModelSpecs(model) → {
  ram: number (GB),
  storageGB: number (GB, TB convertido a GB),
  storageLabel: string,
  price: number (MXN sin formato),
  gpuTier: number (1-10),
  screenLabel: string ("14" FHD", "13.6" Retina"),
  os: "Windows" | "macOS" | "ChromeOS",
  processor: string
}

getGPUTier(gpu: string) → number   // tabla de tiers definida en el módulo
getBestIndices(values[], higherIsBetter) → boolean[]  // marca ganadores
```

### GPU Tiers (referencia)

| GPU | Tier |
|-----|------|
| RTX 4090 / 4080 | 10 |
| RTX 4070 | 9 |
| RTX 4060 | 8 |
| RTX 4050 | 7 |
| RTX 3050 | 6 |
| GTX 1650 | 5 |
| Apple M4 | 5.5 |
| Apple M3 | 5 |
| Apple M2 | 4.5 |
| Apple M1 | 4 |
| Intel Arc | 4 |
| Intel Iris Xe | 3.5 |
| Radeon Vega 7/8 | 3 |
| Radeon 610M | 2.5 |
| UHD / Mali / integrada | 2 |

---

## URL de comparación compartida

```
https://computerselectorhelper.vercel.app/compare?models=macbook-air-m2,asus-tuf-a15-rtx4060,hp-victus-15-rtx4050
```

- Los IDs son los `id` de cada objeto en `laptopModels.js`
- IDs inválidos se filtran silenciosamente
- Máximo 3 IDs se toman aunque vengan más

---

## Limitaciones conocidas

| Limitación | Descripción |
|------------|-------------|
| Specs en texto libre | El parser usa regex sobre `model.specs`; un formato inesperado puede retornar `N/A` |
| GPU tier es aproximado | No refleja diferencias de TDP ni variantes (Max-Q vs Max-P) |
| Sin filtro de portabilidad | Se puede agregar como filtro adicional |
| Sin persistencia del estado | La selección no se guarda en localStorage (solo en URL) |

---

## Posibles mejoras futuras

- [ ] Gráfico de barras comparativo (Chart.js o Recharts)
- [ ] Filtro por rango de precio con slider
- [ ] Filtro por portabilidad (Alta / Media / Baja)
- [ ] Exportar comparación como PDF o imagen
- [ ] Integración con resultados del quiz: botón "Comparar modelos sugeridos"
- [ ] Score total calculado por pesos configurables
