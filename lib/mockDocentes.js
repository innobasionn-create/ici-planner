// lib/mockDocentes.js
//
// MOCK — datos de ejemplo para la vista "Docentes" (marketplace de clases
// online). Esta feature es la hipótesis H9 del Lean Canvas ("marketplace de
// docentes verificados"), todavía sin validar con entrevistas a profesores/
// tutores (ver Ficha 2). No hay estructura de datos real todavía: cuando se
// defina (¿pestaña nueva en la Sheet? ¿fuente aparte?), este archivo se
// reemplaza por un fetch real, con la misma forma de datos que se usa acá
// para no tener que tocar los componentes.

export const DOCENTES = [
  {
    id: 'camila-vidal',
    nombre: 'Camila Vidal',
    iniciales: 'CV',
    color: '#3FA372',
    verificado: true,
    credencial: 'Ex-ayudante ICI',
    ramos: ['Estadística Avanzada', 'Probabilidades y Estadística'],
    rating: 4.9,
    clases: 62,
    precioHora: 12000,
    responde: '< 3h',
    bio: 'Ingeniería Civil Industrial, 4° año. Fui ayudante de Estadística Avanzada y Probabilidades dos semestres. Hago clases enfocadas en series de tiempo, IVE/IBVE y preparación para solemnes.',
    resenia: {
      texto: 'Me ayudó a ordenar todo el contenido de series de tiempo antes de la solemne, mismo ramo, mismo profesor de cátedra — se nota.',
      autor: 'Estudiante ICI, 3er año · clase de Estadística Avanzada',
    },
    slots: [
      { id: 's1', label: 'Lun 18:00', disponible: false },
      { id: 's2', label: 'Mar 19:00', disponible: true },
      { id: 's3', label: 'Mié 17:30', disponible: true },
      { id: 's4', label: 'Jue 20:00', disponible: true },
      { id: 's5', label: 'Vie 16:00', disponible: false },
      { id: 's6', label: 'Vie 19:30', disponible: true },
    ],
  },
  {
    id: 'ignacio-torres',
    nombre: 'Ignacio Torres',
    iniciales: 'IT',
    color: '#4C8FE0',
    verificado: true,
    credencial: 'Docente USS',
    ramos: ['Optimización', 'Modelos Estocásticos'],
    rating: 4.7,
    clases: 38,
    precioHora: 15000,
    responde: '< 6h',
    bio: 'Profesor de la USS. Clases particulares de apoyo en optimización no lineal, métodos numéricos y modelos estocásticos, con guías propias por tema.',
    resenia: {
      texto: 'Explica los métodos numéricos con ejemplos paso a paso, mucho más claro que la cátedra.',
      autor: 'Estudiante ICI, 2do año · clase de Optimización',
    },
    slots: [
      { id: 's1', label: 'Lun 20:00', disponible: true },
      { id: 's2', label: 'Mar 20:00', disponible: false },
      { id: 's3', label: 'Jue 18:00', disponible: true },
      { id: 's4', label: 'Vie 18:00', disponible: true },
    ],
  },
  {
    id: 'florencia-mena',
    nombre: 'Florencia Mena',
    iniciales: 'FM',
    color: '#B5451B',
    verificado: true,
    credencial: 'Ex-ayudante ICI',
    ramos: ['Fenómenos de Transporte', 'Física'],
    rating: 5.0,
    clases: 21,
    precioHora: 10000,
    responde: '< 2h',
    bio: 'Ingeniería Civil Industrial, 5° año. Ayudante de Física y Fenómenos de Transporte. Clases cortas enfocadas en resolver certámenes anteriores.',
    resenia: {
      texto: 'Repasamos certámenes anteriores completos, llegué mucho más tranquila a la solemne.',
      autor: 'Estudiante ICI, 2do año · clase de Fenómenos de Transporte',
    },
    slots: [
      { id: 's1', label: 'Mié 19:00', disponible: true },
      { id: 's2', label: 'Jue 19:00', disponible: true },
      { id: 's3', label: 'Dom 15:00', disponible: true },
    ],
  },
]
