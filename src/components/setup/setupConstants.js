export const SETUP_STEPS = [
  { id: "subject", label: "Tema", title: "Que quieres estudiar?", hint: "Elige una materia" },
  { id: "grade", label: "Grado", title: "En que grado estas?", hint: "Del 5to al 11" },
  { id: "mode", label: "Dificultad", title: "Como lo quieres?", hint: "Facil o dificil" },
];

export const MODE_ACCENTS = {
  easy: {
    badge: "bg-sky-500/12 text-sky-700 dark:text-sky-200",
    bubble: "bg-sky-500/14 text-sky-700 dark:text-sky-200",
  },
  hard: {
    badge: "bg-rose-500/14 text-rose-700 dark:text-rose-200",
    bubble: "bg-rose-500/16 text-rose-700 dark:text-rose-200",
  },
};
