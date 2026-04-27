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

export function getSubjectByName(name) {
  return SUBJECTS.find((subject) => subject.name === name) || null;
}

export function findTopicMatch(subjectName, text) {
  if (!text) {
    return "";
  }

  const subject = getSubjectByName(subjectName);
  if (!subject) {
    return "";
  }

  const normalizedText = text.toLocaleLowerCase();
  return (
    subject.topics.find((topic) => normalizedText.includes(topic.toLocaleLowerCase())) || ""
  );
}
