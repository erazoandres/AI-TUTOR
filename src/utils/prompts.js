function getProfileLabel(studentProfile, fallbackGrade, fallbackMode) {
  const gradeLabel = studentProfile?.grade?.longLabel || fallbackGrade || "grado no indicado";
  const modeLabel = studentProfile?.mode?.name || fallbackMode || "Facil";

  return { gradeLabel, modeLabel };
}

export const getTutorPrompt = ({ subject, topic, grade, mode, studentProfile }) => {
  const { gradeLabel, modeLabel } = getProfileLabel(studentProfile, grade, mode);

  return `
Eres TutorIA, un tutor amable, claro y paciente.

Materia principal: ${subject}
Grado del estudiante: ${gradeLabel}
Modo activo: ${modeLabel}
${topic ? `Tema de foco actual: ${topic}` : "Tema de foco actual: libre"}
Perfil esperado: ${studentProfile?.summary || "Ajusta la respuesta al grado y al modo indicado."}
Guia de respuesta: ${studentProfile?.responseGuidance || ""}

Reglas:
- Responde siempre en espanol.
- Adapta vocabulario, profundidad y ejemplos al grado indicado.
- Si el modo es Facil, divide en pasos pequenos y evita saltos.
- Si el modo es Medio, manten claridad, conecta idea y ejemplo, y agrega un porque breve cuando ayude.
- Si el modo es Detallado, profundiza mas, explica porques y agrega contexto util sin perder orden.
- Usa frases cortas. Evita parrafos largos y tecnicismos innecesarios.
- Responde en maximo 120 palabras, salvo que el estudiante pida mas detalle.
- Da una sola idea principal por respuesta.
- Usa ejemplos cotidianos y faciles de imaginar para ese grado.
- Si el estudiante se equivoca, corrige con respeto y explica el porque en pocas palabras.
- Si el estudiante responde a tu "Tu turno", primero evalua si esta bien, si esta cerca o si tiene un error, y luego ayudalo sin cambiar de tema.
- Si hace falta, usa como maximo 3 pasos numerados.
- Usa este formato siempre que puedas:
Idea clave: ...
Ejemplo: ...
Tu turno: ...
- En "Tu turno" deja una pregunta corta, una mini comprobacion o un reto de una linea.
`;
};

export const getExercisePrompt = ({ subject, topic, grade, mode, studentProfile }) => {
  const { gradeLabel, modeLabel } = getProfileLabel(studentProfile, grade, mode);

  return `
Genera 3 ejercicios practicos sobre "${topic}" en ${subject} para ${gradeLabel} en modo ${modeLabel}.

Contexto de adaptacion: ${studentProfile?.exerciseGuidance || "Ajusta la dificultad al grado y modo."}

Devuelve solo JSON valido, sin markdown, sin comentarios y sin bloques de codigo.

Formato exacto:
{
  "ejercicios": [
    {
      "enunciado": "...",
      "pistas": ["pista1", "pista2"],
      "respuesta": "..."
    }
  ]
}

Los ejercicios deben ser progresivos para ese perfil: del mas accesible al mas retador, sin salirte del grado indicado.
`;
};

export const getQuizPrompt = ({ subject, topic, grade, mode, studentProfile }) => {
  const { gradeLabel, modeLabel } = getProfileLabel(studentProfile, grade, mode);

  return `
Genera un quiz de 5 preguntas de opcion multiple sobre "${topic}" en ${subject} para ${gradeLabel} en modo ${modeLabel}.

Contexto de adaptacion: ${studentProfile?.quizGuidance || "Ajusta la dificultad al grado y modo."}

Devuelve solo JSON valido, sin markdown, sin comentarios y sin bloques de codigo.

Formato exacto:
{
  "preguntas": [
    {
      "pregunta": "...",
      "opciones": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "respuesta_correcta": "A",
      "explicacion": "..."
    }
  ]
}

Las preguntas deben evaluar comprension real y ajustarse al grado indicado, no solo memorizacion.
`;
};
