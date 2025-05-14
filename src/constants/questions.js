const questions = [
  {
    id: "mainUse",
    type: "checkbox",
    question: "¿Para qué vas a usar tu computadora?",
    info: 'Podés elegir hasta tres opciones o seleccionar "Uso exigente".',
    maxSelections: 3,
    options: [
      { value: "basics", label: "Solo lo básico (navegar, email)" },
      { value: "entertainment", label: "Ver películas, música, YouTube" },
      { value: "gaming", label: "Juegos exigentes o online" },
      { value: "work_school", label: "Trabajo o estudios (Word, Zoom, etc.)" },
      { value: "creating", label: "Diseño, fotos o video" },
      { value: "family", label: "Uso compartido en casa" },
    ],
    extraRadio: {
      label: "Uso exigente (Todo lo anterior)",
      value: "full_use",
    },
  },
  {
    id: "system",
    type: "radio",
    question: "¿Tenés alguna preferencia de sistema?",
    options: [
      { value: "windows", label: "Windows, el más común" },
      { value: "mac", label: "MacOS (Apple)" },
      { value: "chrome", label: "ChromeOS (Chromebook)" },
      { value: "any", label: "No tengo preferencia" },
    ],
  },
  {
    id: "workload",
    type: "radio",
    question: "¿Qué tan exigente será tu trabajo o estudio?",
    options: [
      { value: "light", label: "Documentos, mails, tareas simples" },
      { value: "heavy", label: "Multitarea, software pesado, muchos archivos" },
    ],
  },
  {
    id: "webBrowsing",
    type: "radio",
    question: "¿Cómo usás internet?",
    options: [
      { value: "light", label: "Navegación básica, pocas pestañas" },
      { value: "heavy", label: "Muchas pestañas abiertas a la vez" },
    ],
  },
  {
    id: "photoVideo",
    type: "radio",
    question: "¿Editás fotos o videos?",
    options: [
      { value: "none", label: "No edito o apenas toco filtros" },
      { value: "basic", label: "Edito a veces con apps comunes" },
      {
        value: "pro",
        label: "Uso programas avanzados (ej. Photoshop, Premiere)",
      },
    ],
  },
  {
    id: "gamesType",
    type: "radio",
    question: "¿Qué tipo de juegos jugás (si jugás)?",
    options: [
      { value: "none", label: "No juego" },
      { value: "simple", label: "Juegos simples como Candy Crush o Roblox" },
      { value: "complex", label: "Juegos avanzados como GTA, Forza, FIFA" },
    ],
  },
  {
    id: "location",
    type: "radio",
    question: "¿Dónde usás la compu principalmente?",
    options: [
      { value: "desk", label: "Siempre en un escritorio" },
      { value: "homeMobile", label: "La muevo dentro de casa" },
      { value: "mobile", label: "La llevo a todos lados (cafés, viajes)" },
    ],
  },
  {
    id: "battery",
    type: "radio",
    question: "¿Querés que tenga batería duradera?",
    options: [
      { value: "yes", label: "Sí, lo más duradera posible" },
      { value: "no", label: "No me importa mucho, la uso enchufada" },
    ],
  },
  {
    id: "importance",
    type: "radio",
    question: "¿Qué es lo más importante para vos?",
    options: [
      { value: "screen", label: "Pantalla grande y clara" },
      { value: "touch", label: "Pantalla táctil o lápiz" },
      { value: "portability", label: "Ligereza y portabilidad" },
      { value: "performance", label: "Velocidad y multitarea" },
      { value: "security", label: "Seguridad: huella, cara, etc" },
      { value: "unknown", label: "No sé qué es lo más importante" },
    ],
  },
  {
    id: "budget",
    type: "radio",
    question: "¿Cuánto estás dispuesto a invertir (aproximadamente)?",
    info: "Expresado en pesos mexicanos (MXN).",
    options: [
      { value: "low", label: "Menos de $5,000 MXN" },
      { value: "medium", label: "Entre $5,000 y $12,000 MXN" },
      { value: "high", label: "Más de $12,000 MXN" },
    ],
  },
];

export default questions;
