const LEVEL_GUIDES = {
  basico: "Primero que es, luego como reconocerlo y al final una aplicacion sencilla.",
  intermedio: "Conectemos la idea con un procedimiento claro para usarla sin memorizarla.",
  avanzado: "Vamos a mirar la logica del tema, un error frecuente y una aplicacion retadora.",
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

function cleanMojibake(value) {
  return value
    .replace(/Ã¡/g, "a")
    .replace(/Ã©/g, "e")
    .replace(/Ã­/g, "i")
    .replace(/Ã³/g, "o")
    .replace(/Ãº/g, "u")
    .replace(/Ã±/g, "n")
    .replace(/Ã/g, "");
}

function normalizeKey(value) {
  const base = cleanMojibake(value || "");
  return base
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
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

export function buildLocalTutorReply({ subject, level, topic, messages }) {
  const lastQuestion = getLastUserMessage(messages);
  const focus = getFocusLabel(topic, lastQuestion || subject);
  const levelKey = normalizeKey(level);
  const subjectKey = normalizeKey(subject);
  const guide = LEVEL_GUIDES[levelKey] || LEVEL_GUIDES.intermedio;
  const example =
    SUBJECT_EXAMPLES[subjectKey] ||
    "Primero identifica la idea central, luego piensa en un ejemplo cercano y por ultimo explicala con tus palabras.";

  return [
    `Idea clave: Antes de practicar ${focus}, entiende que idea quiere explicar dentro de ${subject}.`,
    `Recuerda: ${guide}`,
    `Ejemplo: ${example}`,
    `Tu turno: Explicame ${focus} con tus palabras o pideme un ejemplo mas corto.`,
  ].join("\n\n");
}

export function buildLocalExercises({ subject, topic, level }) {
  const focus = getFocusLabel(topic, subject);

  return {
    ejercicios: [
      {
        enunciado: `Explica con tus palabras que significa ${focus} en ${subject} y menciona una situacion donde lo usarias.`,
        pistas: [
          "Empieza por una definicion breve.",
          "Despues conecta la idea con un caso cotidiano o escolar.",
        ],
        respuesta: `Una buena respuesta define ${focus} con claridad, indica que problema ayuda a resolver y anade un ejemplo sencillo acorde al nivel ${level}.`,
      },
      {
        enunciado: `Identifica un error frecuente al estudiar ${focus} y corrigelo paso a paso.`,
        pistas: [
          "Piensa en una confusion tipica entre concepto y procedimiento.",
          "La correccion debe mostrar por que el error parece razonable al inicio.",
        ],
        respuesta: `La correccion debe separar la idea correcta del error, justificar por que la version correcta funciona mejor y cerrar con una regla practica para recordarla.`,
      },
      {
        enunciado: `Resuelve una aplicacion corta de ${focus} y explica cada decision que tomas.`,
        pistas: [
          "Nombra el dato de partida antes de operar o interpretar.",
          "Justifica cada paso, no solo el resultado final.",
        ],
        respuesta: `La solucion ideal muestra el procedimiento completo, revisa si el resultado tiene sentido y resume que aprendiste sobre ${focus}.`,
      },
    ],
  };
}

export function buildLocalQuiz({ subject, topic }) {
  const focus = getFocusLabel(topic, subject);

  return {
    preguntas: [
      {
        pregunta: `Cual es el objetivo principal de estudiar ${focus} dentro de ${subject}?`,
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
      {
        pregunta: `Si tuvieras que repasar ${focus} manana, que plan seria mas efectivo?`,
        opciones: [
          "A) Hacer solo una lectura pasiva",
          "B) Resumir la idea, resolver un ejercicio corto y revisar errores",
          "C) Cambiar de tema antes de practicar",
          "D) Memorizar la respuesta final sin pasos",
        ],
        respuesta_correcta: "B",
        explicacion:
          "Repasar con una idea corta, una practica breve y correccion de errores suele funcionar mejor.",
      },
    ],
  };
}
