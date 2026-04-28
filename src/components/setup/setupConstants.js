export const SETUP_STEPS = [
  {
    id: "subject",
    label: "Materia",
    title: "Elige tu punto de partida",
    hint: "Selecciona una materia y revisa el avance que ya tienes.",
  },
  {
    id: "grade",
    label: "Grado",
    title: "Ajusta el nivel escolar",
    hint: "El tutor adapta ejemplos, profundidad y practica a tu grado.",
  },
  {
    id: "mode",
    label: "Dificultad",
    title: "Elige como quieres la explicacion",
    hint: "Facil resume y guia, Medio equilibra, Detallado profundiza mas.",
  },
];

export const MODE_ACCENTS = {
  easy: {
    badge: "bg-sky-500/12 text-sky-700 dark:text-sky-200",
    bubble: "bg-sky-500/14 text-sky-700 dark:text-sky-200",
  },
  medium: {
    badge: "bg-violet-500/14 text-violet-700 dark:text-violet-200",
    bubble: "bg-violet-500/16 text-violet-700 dark:text-violet-200",
  },
  detailed: {
    badge: "bg-amber-500/16 text-amber-700 dark:text-amber-200",
    bubble: "bg-amber-500/18 text-amber-700 dark:text-amber-200",
  },
};
