# Computer Selector Helper 🖥️

> Respondé unas preguntas y recibí una recomendación personalizada de laptop según tu presupuesto y necesidades reales.

**[🌐 Ver en vivo](https://computerselectorhelper.vercel.app/)**

## ¿Qué es?

Computer Selector Helper es un asistente web que ayuda a usuarios no técnicos a elegir la laptop ideal. A través de un cuestionario interactivo de 10 preguntas, el motor de inferencia analiza tus necesidades de uso, presupuesto y preferencias para recomendarte:

- ✅ Especificaciones técnicas personalizadas (CPU, GPU, RAM, almacenamiento)
- ✅ Modelos de laptops reales con precios aproximados en MXN
- ✅ Advertencias sobre combinaciones inviables
- ✅ Justificación técnica de cada recomendación

## Características

### 🧠 Motor de Inferencia
- Scoring multidimensional (performance, gráficos, multitarea, portabilidad, batería, almacenamiento)
- Validaciones cruzadas para detectar combinaciones inviables (ej: gaming + ChromeOS + presupuesto bajo)
- Matching inteligente con base de datos de 35+ modelos de laptops
- Fallback con modelos aproximados cuando no hay matches exactos
- Manejo de errores con ErrorBoundary

### 🎨 UI/UX
- Diseño moderno, limpio y espacioso
- Responsive (mobile-first, breakpoints en 320px, 768px, 1024px)
- Indicador de progreso en el quiz
- Navegación hacia atrás entre preguntas
- Divulgación progresiva en resultados
- Accesibilidad WCAG AA (focus-visible, aria labels, contraste)
- Persistencia de sesión con localStorage

### 🔍 SEO
- Meta tags dinámicos por ruta (react-helmet-async)
- Open Graph + Twitter Cards
- JSON-LD structured data (WebApplication)
- Sitemap.xml + robots.txt
- Semantic HTML (header, main, footer)

## Stack Tecnológico

- **React 19** con JSX
- **Vite 6** (bundler)
- **React Router DOM 7** (routing)
- **React Helmet Async** (SEO dinámico)
- **React Icons** (iconografía)
- **Vercel Analytics** (métricas)
- **ESLint 9** (linting)

## Cómo Usarlo

### Para Usuarios
1. Abrí la app en [computerselectorhelper.vercel.app](https://computerselectorhelper.vercel.app/)
2. Respondé las 10 preguntas del cuestionario
3. Revisá tu recomendación técnica
4. Explorá los modelos sugeridos o usá las specs como guía de compra

### Para Desarrolladores

```bash
# Clonar el repositorio
git clone https://github.com/FranGuh/ComputerSelectorHelper.git
cd ComputerSelectorHelper

# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build para producción
npm run build

# Linting
npm run lint

# Preview del build
npm run preview
```

## Estructura del Proyecto

```
src/
├── components/
│   ├── ErrorBoundary/     # Manejo de errores
│   ├── LaptopCard/        # Tarjeta de modelo de laptop
│   └── Recommendation/    # Quiz + resultados
├── constants/
│   └── questions.js       # Preguntas del cuestionario
├── pages/
│   ├── Landing/           # Página principal
│   └── Quiz/              # Ruta del quiz
├── routes/
│   └── AppRoutes.jsx      # Configuración de rutas
├── utils/
│   ├── convertToSpecs.jsx      # Motor de inferencia
│   ├── matchLaptopClass.jsx    # Matching de laptops
│   └── laptopModels.js         # Base de datos (35+ modelos)
├── App.jsx                # Componente raíz
├── App.css                # Estilos globales
├── index.css              # CSS variables + reset
└── main.jsx               # Entry point
```

## Motor de Inferencia

El sistema usa un enfoque de scoring ponderado:

1. **Scoring por uso**: gaming (+3.5 perf, +4.5 gfx), creación (+3 perf, +2.5 gfx), trabajo pesado (+2.5 perf, +2.5 multitask)
2. **Scoring por tipo de juego**: complejo (+3 gfx), simple (+1 gfx)
3. **Scoring por edición de fotos/video**: pro (+2.5 gfx, +2 storage), básico (+1 gfx, +1 storage)
4. **Especificaciones derivadas**: CPU, RAM, GPU, storage se calculan desde los scores
5. **Validaciones cruzadas**: macOS + gaming, ChromeOS + tareas pesadas, presupuesto bajo + specs altas
6. **Matching**: Filtrado estricto → scoring → top 3. Si no hay matches, fallback relajado (+30% presupuesto, GPU/OS menos estrictos)

## Base de Datos de Laptops

35+ modelos organizados por:
- **Budget** (<$5,000 MXN): 4 modelos
- **Entry-Mid** ($5,000–$8,000): 4 modelos
- **Mid** ($8,000–$12,000): 4 modelos
- **Mid-High** ($12,000–$16,000): 6 modelos
- **Upper Mid** ($16,000–$20,000): 5 modelos
- **High** ($20,000–$35,000): 8 modelos
- **Enthusiast** ($35,000+): 4 modelos

GPUs cubiertas: Intel UHD/Iris Xe, Intel Arc, AMD Radeon 610M/Vega 7/8, GTX 1650, RTX 4050/4060/4070, Apple M1/M2/M3/M4, Mali-G52

## Arquitectura de Agentes (Dream Team)

Este proyecto usa orquestación multi-agente:

| Rol | Modelo | Responsabilidad |
|-----|--------|-----------------|
| Principal (Auditor) | qwen3.6-plus | Delega, supervisa, gestiona branches |
| Arquitectura & Seguridad | deepseek-v4-pro | Decisiones técnicas, calidad de código |
| QA & Producto | GLM-5 | Testing, edge cases, UX |
| Performance & Resiliencia | minimax-m2.7 | Optimización, memoria, idempotencia |
| Research & Trazabilidad | gemini-2.5-pro | Investigación, precedentes |
| Build Worker | kimi-k2.6 | Builds, compilación |
| Build Fixer | MiMo 2.5V Pro | Fixes de builds, regresiones |
| UI/UX Advisor | openai/gpt-5.5 | React UI/UX, SEO, accesibilidad |

## Licencia

MIT

## Autor

Coded by [@Fran](https://github.com/FranGuh)
