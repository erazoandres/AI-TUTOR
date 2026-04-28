import { useState } from "react";
import { BadgeHelp } from "lucide-react";

export default function QuizCard({ pregunta, numero, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (opcion) => {
    if (submitted) {
      return;
    }

    setSelected(opcion);
    setSubmitted(true);
    onAnswer(opcion[0] === pregunta.respuesta_correcta);
  };

  const selectedLetter = selected?.[0];
  const isCorrectSelection = selectedLetter === pregunta?.respuesta_correcta;

  return (
    <article className="ios-surface rounded-lg px-3 py-3">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-semibold ios-chip">
        <BadgeHelp className="h-3.5 w-3.5" aria-hidden="true" />
        Pregunta {numero}
      </div>

      <p className="mb-3 text-sm font-medium leading-6 text-[color:var(--text-primary)]">
        {pregunta?.pregunta}
      </p>

      <div className="space-y-2">
        {(pregunta?.opciones || []).map((opcion, i) => {
          const letra = opcion[0];
          const isCorrect = letra === pregunta?.respuesta_correcta;
          const isSelected = selected === opcion;

          let style =
            "w-full rounded-lg px-3 py-2.5 text-left text-sm leading-6 transition border ";

          if (!submitted) {
            style +=
              "border-[color:var(--line)] bg-[color:var(--surface-elevated)] hover:bg-[color:var(--surface-muted)]";
          } else if (isCorrect) {
            style +=
              "border-emerald-300 bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-100";
          } else if (isSelected) {
            style +=
              "border-rose-300 bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-100";
          } else {
            style += "border-[color:var(--line)] bg-[color:var(--surface-elevated)] opacity-60";
          }

          return (
            <button
              key={i}
              type="button"
              aria-pressed={isSelected}
              className={style}
              onClick={() => handleSubmit(opcion)}
            >
              {opcion}
            </button>
          );
        })}
      </div>

      {submitted && (
        <div
          className={`mt-3 rounded-lg px-3 py-3 text-sm leading-6 ${
            isCorrectSelection
              ? "bg-[color:var(--success-soft)] text-[color:var(--text-primary)]"
              : "bg-[color:var(--danger-soft)] text-[color:var(--text-primary)]"
          }`}
        >
          <span className="font-semibold">{isCorrectSelection ? "Muy bien." : "Casi."}</span>{" "}
          {pregunta?.explicacion}
        </div>
      )}
    </article>
  );
}
