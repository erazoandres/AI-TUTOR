export const GRADES = [
  {
    id: "5",
    label: "5to",
    longLabel: "5to grado",
    stage: "Base clara",
    summary: "Ideas concretas, ejemplos escolares y una sola dificultad a la vez.",
    prompt:
      "Usa vocabulario muy simple, pasos cortos y ejemplos faciles de imaginar dentro del colegio o la vida diaria.",
    practice:
      "Prioriza ejercicios de reconocimiento, aplicacion directa y correccion guiada de errores simples.",
    quiz:
      "Haz preguntas con contexto visible, opciones claras y una sola idea por item.",
  },
  {
    id: "6",
    label: "6to",
    longLabel: "6to grado",
    stage: "Base activa",
    summary: "Relacionar regla, ejemplo y procedimiento sin sobrecargar.",
    prompt:
      "Mantener lenguaje claro y ayudar a unir concepto con pasos de uso, mostrando por que funciona cada parte.",
    practice:
      "Combina definicion breve, ejemplo guiado y una aplicacion corta con apoyo.",
    quiz:
      "Usa preguntas de comprension directa con distractores sencillos y contexto cotidiano.",
  },
  {
    id: "7",
    label: "7mo",
    longLabel: "7mo grado",
    stage: "Transicion",
    summary: "Pasar de repetir a comprender con pequenas conexiones entre ideas.",
    prompt:
      "Explica con claridad, pero empieza a pedir que relacione concepto, ejemplo y resultado en respuestas cortas.",
    practice:
      "Incluye ejercicios que obliguen a elegir un metodo y explicar una razon breve.",
    quiz:
      "Evalua comprension real con opciones plausibles y preguntas de aplicacion simple.",
  },
  {
    id: "8",
    label: "8vo",
    longLabel: "8vo grado",
    stage: "Conectar ideas",
    summary: "Relacionar conceptos y justificar decisiones de forma simple.",
    prompt:
      "Mantener claridad, pero ya puedes pedir comparaciones cortas, causas y pequenas justificaciones.",
    practice:
      "Prioriza ejercicios de conexion entre conceptos, interpretacion y errores frecuentes.",
    quiz:
      "Haz preguntas que mezclen concepto, ejemplo y seleccion del procedimiento correcto.",
  },
  {
    id: "9",
    label: "9no",
    longLabel: "9no grado",
    stage: "Analisis inicial",
    summary: "Aplicar conceptos y revisar errores con mas criterio.",
    prompt:
      "Explica con orden y pide una justificacion corta cuando la idea lo permita, sin perder sencillez.",
    practice:
      "Crea ejercicios de aplicacion, comparacion de metodos y deteccion de errores comunes.",
    quiz:
      "Usa preguntas con distractores creibles y enfoque en comprension y uso del concepto.",
  },
  {
    id: "10",
    label: "10mo",
    longLabel: "10mo grado",
    stage: "Profundizar",
    summary: "Entrar en porques, relaciones y criterios de eleccion.",
    prompt:
      "Puedes profundizar mas, pedir justificacion y conectar teoria con practica, manteniendo respuesta compacta.",
    practice:
      "Plantea ejercicios que pidan aplicar, argumentar y revisar si el resultado tiene sentido.",
    quiz:
      "Evalua criterio, interpretacion y seleccion del mejor camino para resolver.",
  },
  {
    id: "11",
    label: "11",
    longLabel: "grado 11",
    stage: "Preparacion final",
    summary: "Resolver con criterio, claridad y nivel de salida escolar.",
    prompt:
      "Mantener lenguaje claro, pero exigir precision, conexiones entre temas y pequenas defensas del procedimiento.",
    practice:
      "Incluye ejercicios de aplicacion, analisis de errores y mini retos con mas autonomia.",
    quiz:
      "Usa preguntas de comprension profunda, relacion entre ideas y opciones bien pensadas.",
  },
];

export const MODES = [
  {
    id: "easy",
    name: "Facil",
    shortLabel: "Paso a paso",
    summary: "Mas guia, menos carga por turno y ejemplos muy cercanos.",
    prompt:
      "Divide la explicacion en pasos pequenos, evita saltos y confirma la idea con un ejemplo sencillo.",
    practice:
      "Haz los primeros ejercicios guiados y deja solo un reto corto al final.",
    quiz:
      "Mantener opciones claras y explicaciones muy transparentes.",
  },
  {
    id: "medium",
    name: "Medio",
    shortLabel: "Equilibrado",
    summary: "Mantiene claridad, pero ya conecta ideas y pide pensar un poco mas.",
    prompt:
      "Mantener claridad, sumar un porque breve y relacionar concepto, ejemplo y resultado sin sobrecargar.",
    practice:
      "Combina una parte guiada con aplicacion corta y una justificacion simple cuando haga falta.",
    quiz:
      "Usa distractores plausibles y exige comprension real sin volverlo pesado.",
  },
  {
    id: "detailed",
    name: "Detallado",
    shortLabel: "Mas contexto",
    summary: "Da mas profundidad, explica porques y deja cierres mas completos.",
    prompt:
      "Responde con mas contexto, explica por que funciona la idea y agrega una conexion o matiz util cuando aporte claridad.",
    practice:
      "Plantea ejercicios con aplicacion, criterio, revision de errores y una breve justificacion del procedimiento.",
    quiz:
      "Evalua comprension profunda con opciones creibles y explicaciones un poco mas completas.",
  },
];

export function getGradeById(id) {
  return GRADES.find((grade) => grade.id === id) || null;
}

export function getModeById(id) {
  const normalizedId = id === "hard" ? "detailed" : id;
  return MODES.find((mode) => mode.id === normalizedId) || null;
}

export function buildStudentProfile(gradeId, modeId) {
  const grade = getGradeById(gradeId) || GRADES[0];
  const mode = getModeById(modeId) || MODES[0];

  return {
    grade,
    mode,
    label: `${grade.longLabel} · ${mode.name}`,
    summary: `${grade.summary} ${mode.summary}`,
    responseGuidance: `${grade.prompt} ${mode.prompt}`,
    exerciseGuidance: `${grade.practice} ${mode.practice}`,
    quizGuidance: `${grade.quiz} ${mode.quiz}`,
    quickPrompt:
      mode.id === "easy"
        ? `Explica paso a paso y con ejemplos claros para ${grade.longLabel}.`
        : mode.id === "medium"
          ? `Explica con claridad y conecta idea, ejemplo y resultado para ${grade.longLabel}.`
          : `Explica con mas detalle, contexto y porques utiles para ${grade.longLabel}.`,
    practiceHint:
      mode.id === "easy"
        ? "Primero entender, luego practicar con apoyo."
        : mode.id === "medium"
          ? "Entender, aplicar y justificar lo justo."
          : "Entender, conectar ideas y justificar con mas criterio.",
  };
}
