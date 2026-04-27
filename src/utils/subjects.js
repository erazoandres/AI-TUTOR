export const SUBJECTS = [
  {
    id: "matematicas",
    name: "Matemáticas",
    emoji: "📐",
    topics: ["Álgebra", "Geometría", "Trigonometría", "Cálculo básico", "Estadística"],
  },
  {
    id: "fisica",
    name: "Física",
    emoji: "⚡",
    topics: ["Cinemática", "Dinámica", "Termodinámica", "Electricidad", "Óptica"],
  },
  {
    id: "quimica",
    name: "Química",
    emoji: "🧪",
    topics: ["Tabla periódica", "Enlace químico", "Reacciones", "Estequiometría", "Orgánica"],
  },
  {
    id: "biologia",
    name: "Biología",
    emoji: "🧬",
    topics: ["Célula", "Genética", "Ecosistemas", "Cuerpo humano", "Evolución"],
  },
  {
    id: "historia",
    name: "Historia",
    emoji: "🏛️",
    topics: [
      "Historia de Colombia",
      "América precolombina",
      "Independencias",
      "Guerras mundiales",
      "Colombia siglo XX",
    ],
  },
  {
    id: "lengua",
    name: "Lengua Castellana",
    emoji: "📚",
    topics: ["Comprensión lectora", "Gramática", "Ortografía", "Literatura", "Redacción"],
  },
  {
    id: "programacion",
    name: "Programación",
    emoji: "💻",
    topics: ["Algoritmos", "Variables", "Condicionales", "Bucles", "Funciones", "HTML y CSS"],
  },
];

export const LEVELS = [
  { id: "basico", name: "Básico", description: "Acabo de ver el tema" },
  { id: "intermedio", name: "Intermedio", description: "Lo entiendo un poco" },
  { id: "avanzado", name: "Avanzado", description: "Quiero profundizar" },
];

const GRADE_BAND_BY_ID = {
  "5": "5-6",
  "6": "5-6",
  "7": "7-8",
  "8": "7-8",
  "9": "9-10",
  "10": "9-10",
  "11": "11",
};

const SUBJECT_TOPICS_BY_BAND = {
  matematicas: {
    "5-6": ["Operaciones", "Fracciones", "Geometría básica", "Perímetro y área", "Patrones"],
    "7-8": ["Álgebra", "Geometría", "Razones", "Ecuaciones", "Estadística básica"],
    "9-10": ["Álgebra", "Geometría", "Trigonometría", "Funciones", "Estadística"],
    "11": ["Trigonometría", "Funciones", "Cálculo básico", "Probabilidad", "Estadística"],
  },
  fisica: {
    "5-6": ["Materia y energía", "Movimiento", "Fuerza", "Máquinas simples", "Medición"],
    "7-8": ["Movimiento", "Fuerza", "Energía", "Calor", "Ondas"],
    "9-10": ["Cinemática", "Dinámica", "Termodinámica", "Electricidad", "Óptica"],
    "11": ["Cinemática", "Dinámica", "Electricidad", "Óptica", "Conservación de energía"],
  },
  quimica: {
    "5-6": ["Estados de la materia", "Mezclas", "Cambios físicos", "Cambios químicos", "Laboratorio"],
    "7-8": ["Átomos", "Tabla periódica", "Enlace químico", "Reacciones", "Mezclas y soluciones"],
    "9-10": ["Tabla periódica", "Enlace químico", "Reacciones", "Estequiometría", "Orgánica"],
    "11": ["Enlace químico", "Reacciones", "Estequiometría", "Orgánica", "Soluciones"],
  },
  biologia: {
    "5-6": ["Seres vivos", "Célula", "Ecosistemas", "Cuerpo humano", "Cadenas alimentarias"],
    "7-8": ["Célula", "Tejidos", "Genética básica", "Sistemas del cuerpo", "Ecología"],
    "9-10": ["Célula", "Genética", "Ecosistemas", "Cuerpo humano", "Evolución"],
    "11": ["Genética", "Evolución", "Ecología", "Cuerpo humano", "Biotecnología"],
  },
  historia: {
    "5-6": [
      "Pueblos originarios",
      "Historia de Colombia",
      "Independencia",
      "Regiones de Colombia",
      "Cambios en el tiempo",
    ],
    "7-8": [
      "América precolombina",
      "Conquista y colonia",
      "Independencias",
      "República",
      "Historia de Colombia",
    ],
    "9-10": [
      "Historia de Colombia",
      "Independencias",
      "Guerras mundiales",
      "Colombia siglo XX",
      "Conflictos contemporáneos",
    ],
    "11": [
      "Historia de Colombia",
      "Guerras mundiales",
      "Colombia siglo XX",
      "Conflicto colombiano",
      "Historia contemporánea",
    ],
  },
  lengua: {
    "5-6": ["Comprensión lectora", "Ortografía", "Gramática básica", "Tipos de texto", "Escritura"],
    "7-8": ["Comprensión lectora", "Gramática", "Ortografía", "Narración", "Literatura"],
    "9-10": ["Comprensión crítica", "Gramática", "Argumentación", "Literatura", "Redacción"],
    "11": ["Comprensión crítica", "Argumentación", "Redacción", "Literatura", "Análisis textual"],
  },
  programacion: {
    "5-6": ["Secuencias", "Patrones", "Algoritmos simples", "Bloques", "Internet seguro"],
    "7-8": ["Algoritmos", "Variables", "Condicionales", "Bucles", "HTML básico"],
    "9-10": ["Algoritmos", "Variables", "Condicionales", "Bucles", "Funciones"],
    "11": ["Algoritmos", "Funciones", "HTML y CSS", "Lógica web", "Resolución de problemas"],
  },
};

function resolveGradeBand(gradeId) {
  return GRADE_BAND_BY_ID[String(gradeId || "")] || null;
}

export function getTopicsForSubject(subjectId, gradeId) {
  const band = resolveGradeBand(gradeId);
  const subject = SUBJECTS.find((item) => item.id === subjectId);

  if (!subject) {
    return [];
  }

  if (!band) {
    return subject.topics;
  }

  return SUBJECT_TOPICS_BY_BAND[subjectId]?.[band] || subject.topics;
}

export function getSubjectByName(name, gradeId) {
  const subject = SUBJECTS.find((item) => item.name === name) || null;
  if (!subject) {
    return null;
  }

  return {
    ...subject,
    topics: getTopicsForSubject(subject.id, gradeId),
  };
}

export function findTopicMatch(subjectName, text, gradeId) {
  if (!text) {
    return "";
  }

  const subject = getSubjectByName(subjectName, gradeId);
  if (!subject) {
    return "";
  }

  const normalizedText = text.toLocaleLowerCase();
  return (
    subject.topics.find((topic) => normalizedText.includes(topic.toLocaleLowerCase())) || ""
  );
}
