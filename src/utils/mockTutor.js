const MODE_GUIDES = {
  easy: "Vamos paso a paso, con una sola idea a la vez y un ejemplo muy claro.",
  hard: "Vamos a entender la idea y luego a justificar un poco mas la respuesta.",
};

const SUBJECT_EXAMPLES = {
  matematicas: "Si tienes 2x + 6 = 14, primero quitas el 6 y despues divides entre 2.",
  fisica:
    "Si una bicicleta avanza mas cada segundo, no solo cambia la distancia: tambien cambia la velocidad.",
  quimica: "Al balancear una reaccion no aparecen atomos nuevos: solo ajustas cantidades.",
  biologia:
    "Si una celula fuera una ciudad, la membrana seria la puerta y el nucleo el centro de control.",
  historia:
    "Para entender un proceso historico conviene mirar causas, actores y consecuencias, no solo fechas.",
  lenguacastellana:
    "En un texto bien escrito, cada idea cumple una funcion: presentar, explicar o cerrar.",
  programacion:
    "Si quieres que un personaje avance y luego salte, escribes instrucciones en orden.",
};

function normalizeKey(value) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function getLastUserMessage(messages) {
  return [...messages]
    .reverse()
    .find((message) => message.role === "user" && typeof message.content === "string")
    ?.content?.trim();
}

function getFocusLabel(topic, fallback) {
  return topic?.trim() || fallback;
}

function getProfileLabels(studentProfile, grade, mode) {
  return {
    gradeLabel: studentProfile?.grade?.longLabel || grade || "este grado",
    modeName: studentProfile?.mode?.name || mode || "Facil",
  };
}

export function buildLocalTutorReply({
  subject,
  grade,
  mode,
  topic,
  messages,
  studentProfile,
}) {
  const lastQuestion = getLastUserMessage(messages);
  const focus = getFocusLabel(topic, lastQuestion || subject);
  const subjectKey = normalizeKey(subject);
  const { gradeLabel, modeName } = getProfileLabels(studentProfile, grade, mode);
  const modeGuide = MODE_GUIDES[mode] || MODE_GUIDES.easy;
  const example =
    SUBJECT_EXAMPLES[subjectKey] ||
    "Primero identifica la idea central, luego piensa en un ejemplo cercano y por ultimo explicala con tus palabras.";

  return [
    `Idea clave: Para ${gradeLabel}, ${focus} en ${subject} se entiende mejor si tomas una idea por vez.`,
    `Ejemplo: ${example}`,
    `Recuerda: ${modeGuide}`,
    `Tu turno: ${
      modeName === "Dificil"
        ? `Explicame por que ${focus} funciona asi en una o dos frases.`
        : `Explicame ${focus} con tus palabras o pideme un ejemplo mas corto.`
    }`,
  ].join("\n\n");
}

export function buildLocalExercises({ subject, topic, grade, mode, studentProfile }) {
  const focus = getFocusLabel(topic, subject);
  const { gradeLabel } = getProfileLabels(studentProfile, grade, mode);
  const modeGuide =
    mode === "hard"
      ? "En el ultimo ejercicio pide justificar o detectar un error."
      : "Las pistas deben sentirse cercanas y muy guiadas.";

  return {
    ejercicios: [
      {
        enunciado: `Explica con tus palabras que significa ${focus} en ${subject} para ${gradeLabel}.`,
        pistas: [
          "Empieza por una idea breve y clara.",
          "Luego conectala con una situacion cercana al colegio o la vida diaria.",
        ],
        respuesta: `Una buena respuesta define ${focus} con claridad y lo conecta con un ejemplo sencillo para ${gradeLabel}.`,
      },
      {
        enunciado: `Muestra un error frecuente al estudiar ${focus} y corrigelo paso a paso.`,
        pistas: [
          "Piensa en una confusion comun entre concepto y procedimiento.",
          "La correccion debe decir por que la idea correcta funciona mejor.",
        ],
        respuesta: `La correccion debe separar el error de la idea correcta y dejar una regla practica para recordarla.`,
      },
      {
        enunciado: `Resuelve una aplicacion corta de ${focus} y explica cada decision que tomas.`,
        pistas: [
          "Nombra el dato de partida antes de resolver.",
          modeGuide,
        ],
        respuesta: `La solucion ideal muestra el procedimiento, revisa si el resultado tiene sentido y resume que aprendiste sobre ${focus}.`,
      },
    ],
  };
}

export function buildLocalQuiz({ subject, topic, grade, mode, studentProfile }) {
  const focus = getFocusLabel(topic, subject);
  const { gradeLabel } = getProfileLabels(studentProfile, grade, mode);
  const challengeLine =
    mode === "hard"
      ? "Elige la opcion que mejor justifica la idea."
      : "Elige la opcion que muestra la idea mas clara.";

  return {
    preguntas: [
      {
        pregunta: `Para ${gradeLabel}, cual es el objetivo principal de estudiar ${focus} dentro de ${subject}?`,
        opciones: [
          "A) Entender la idea y saber aplicarla en contexto",
          "B) Memorizar palabras sueltas sin relacionarlas",
          "C) Evitar justificar respuestas",
          "D) Reemplazar todos los demas temas",
        ],
        respuesta_correcta: "A",
        explicacion:
          "Aprender bien no es repetir: tambien es comprender y usar la idea cuando hace falta.",
      },
      {
        pregunta: `${challengeLine}`,
        opciones: [
          "A) Porque ayuda a entender el concepto y cuando usarlo",
          "B) Porque evita pensar en el problema",
          "C) Porque hace innecesario revisar errores",
          "D) Porque todos los temas se resuelven igual",
        ],
        respuesta_correcta: "A",
        explicacion:
          "La mejor opcion es la que conecta la idea con su uso real y no solo con memoria literal.",
      },
      {
        pregunta: `Si alguien comete un error con ${focus}, que conviene revisar primero?`,
        opciones: [
          "A) Si escribio muy rapido",
          "B) Si entendio el concepto base y cuando usarlo",
          "C) Si cambio el color del cuaderno",
          "D) Si estudio otro tema distinto",
        ],
        respuesta_correcta: "B",
        explicacion:
          "Muchos errores aparecen cuando la idea base no esta clara o se usa en el momento equivocado.",
      },
      {
        pregunta: `Que estrategia ayuda mas a dominar ${focus}?`,
        opciones: [
          "A) Ver una sola explicacion y no practicar",
          "B) Saltar directo al tema mas dificil",
          "C) Alternar explicacion, ejemplo guiado y practica breve",
          "D) Aprender respuestas de memoria sin revisar por que",
        ],
        respuesta_correcta: "C",
        explicacion:
          "La combinacion de idea, ejemplo y practica corta ayuda a entender mejor y recordar mas.",
      },
      {
        pregunta: `Que senal muestra mejor que ya entiendes ${focus}?`,
        opciones: [
          "A) Puedes explicar la idea y justificar un procedimiento",
          "B) Reconoces el titulo cuando lo lees",
          "C) Recuerdas una palabra clave aislada",
          "D) Lo viste una vez en clase",
        ],
        respuesta_correcta: "A",
        explicacion:
          "Entender de verdad significa poder explicarlo y decir por que una respuesta tiene sentido.",
      },
    ],
  };
}
