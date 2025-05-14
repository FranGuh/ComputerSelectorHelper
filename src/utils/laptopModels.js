const buildGoogleLink = (name) =>
  `https://www.google.com/search?q=${encodeURIComponent(name + ' laptop')}`

const laptopModels = [
  {
    id: "hp-stream-14",
    name: "HP Stream 14",
    use: "Estudiantes básicos, movilidad",
    specs: "Intel Celeron N4120, 4 GB RAM, 64 GB SSD, 14” HD",
    gpu: "Intel integrada",
    price: "$4,199 MXN",
    portability: "Alta",
    image:
      "https://http2.mlstatic.com/D_NQ_NP_998635-MLU72707430546_112023-O.webp",
    link: buildGoogleLink("HP Stream 14"),
  },
  {
    id: "acer-aspire-go",
    name: "Acer Aspire Go AG15",
    use: "Uso general, estudiantes",
    specs: "Intel Core i3, 8 GB RAM, 256 GB SSD, 15.6” FHD",
    gpu: "Intel integrada",
    price: "$5,999 MXN",
    portability: "Media",
    image:
      "https://http2.mlstatic.com/D_NQ_NP_892980-MLU72709381313_112023-O.webp",
    link: buildGoogleLink("acer-aspire-go"),
  },
  {
    id: "hp-victus-rtx3050",
    name: "HP Victus RTX 3050",
    use: "Gaming medio, tareas pesadas",
    specs: "Intel i5 12450H, 32 GB RAM, 512 GB SSD, RTX 3050",
    gpu: "RTX 3050",
    price: "$14,999 MXN",
    portability: "Media",
    image:
      "https://http2.mlstatic.com/D_NQ_NP_848177-MLU72623477670_112023-O.webp",
    link: buildGoogleLink("hp-victus-rtx3050"),
  },
  {
    id: "macbook-air-m1",
    name: "Apple MacBook Air M1",
    use: "Creativos, portabilidad, estudiantes",
    specs: "Apple M1, 8 GB RAM, 256 GB SSD, 13.3” Retina",
    gpu: "M1",
    price: "$13,999 MXN",
    portability: "Alta",
    image:
      "https://http2.mlstatic.com/D_NQ_NP_927379-MLU72708791150_112023-O.webp",
    link: buildGoogleLink("macbook-air-m1"),
  },
  {
    id: "asus-tuf-a15",
    name: "ASUS TUF Gaming A15",
    use: "Gaming alto, edición multimedia",
    specs: "Ryzen 7, 8 GB RAM, 512 GB SSD, RTX 3050",
    gpu: "RTX 3050",
    price: "$16,339 MXN",
    portability: "Media",
    image:
      "https://http2.mlstatic.com/D_NQ_NP_846917-MLU72696975214_112023-O.webp",
    link: buildGoogleLink("asus-tuf-a15"),
  },
  {
    id: "lenovo-chromebook-3",
    name: "Lenovo Chromebook 3",
    use: "Tareas básicas, navegación, Google Docs",
    specs: "Intel Celeron N4020, 4 GB RAM, 64 GB eMMC, 14” HD",
    gpu: "Intel integrada",
    price: "$3,499 MXN",
    portability: "Alta",
    image:
      "https://http2.mlstatic.com/D_NQ_NP_758541-MLA46348158591_062021-O.webp",
    link: buildGoogleLink("lenovo-chromebook-3"),
  },
  {
    id: "macbook-air-m2",
    name: "Apple MacBook Air M2",
    use: "Profesionales móviles, diseño, universidad",
    specs: "Apple M2, 8 GB RAM, 256 GB SSD, 13.6” Retina",
    gpu: "M2",
    price: "$23,999 MXN",
    portability: "Alta",
    image:
      "https://http2.mlstatic.com/D_NQ_NP_690601-MLA54392916913_032023-O.webp",
    link: buildGoogleLink("macbook-air-m2"),
  },
  {
    id: "acer-nitro-rtx4060",
    name: "Acer Nitro RTX 4060",
    use: "Gaming exigente, edición profesional",
    specs: "Intel i7 13th Gen, 16 GB RAM, 1TB SSD, RTX 4060",
    gpu: "RTX 4060",
    price: "$24,999 MXN",
    portability: "Media",
    image:
      "https://http2.mlstatic.com/D_NQ_NP_760264-MLU72577474002_112023-O.webp",
    link: buildGoogleLink("acer-nitro-rtx4060"),
  },
  {
    id: "lenovo-gamer-rtx4070",
    name: "Lenovo Legion RTX 4070",
    use: "Gaming extremo, arquitectura, animación",
    specs: "Intel i9, 32 GB RAM, 1TB SSD, RTX 4070",
    gpu: "RTX 4070",
    price: "$38,999 MXN",
    portability: "Baja",
    image:
      "https://http2.mlstatic.com/D_NQ_NP_697680-MLA71353724425_082023-O.webp",
    link: buildGoogleLink("lenovo-gamer-rtx4070"),
  },
  {
    id: "msi-gamer-rtx2060",
    name: "MSI GF63 RTX 2060",
    use: "Gaming clásico, edición semiprofesional",
    specs: "Intel i5 10th Gen, 16 GB RAM, 512 GB SSD, RTX 2060",
    gpu: "RTX 2060",
    price: "$17,499 MXN",
    portability: "Media",
    image:
      "https://http2.mlstatic.com/D_NQ_NP_878174-MLA48687548976_122021-O.webp",
    link: buildGoogleLink("msi-gamer-rtx2060"),
  },
];

export default laptopModels;
