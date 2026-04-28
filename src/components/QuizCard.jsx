import { useState } from "react";
import { BadgeHelp, CheckCircle2, Circle } from "lucide-react";

export default function QuizCard({ pregunta, numero, total = 0, onAnswer }) {
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
    <article className="ios-surface hover-lift rounded-2xl px-4 py-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold ios-chip">
          <BadgeHelp className="h-3.5 w-3.5" aria-hidden="true" />
          Pregunta {numero}{total ? ` / ${total}` : ""}
        </div>

        <span
          className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${
            submitted
              ? isCorrectSelection
                ? "bg-[color:var(--success-soft)] text-[color:var(--text-primary)]"
                : "bg-[color:var(--danger-soft)] text-[color:var(--text-primary)]"
              : "ios-chip"
          }`}
        >
          {submitted ? (isCorrectSelection ? "Correcta" : "Revisar") : "Pendiente"}
        </span>
      </div>

      <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-elevated)] px-4 py-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
          Enunciado
        </p>
        <p className="mt-2 text-sm font-medium leading-7 text-[color:var(--text-primary)]">
          {pregunta?.pregunta}
        </p>
      </div>

      <div className="mt-3 space-y-2">
        {(pregunta?.opciones || []).map((opcion, i) => {
          const letra = opcion[0];
          const isCorrect = letra === pregunta?.respuesta_correcta;
          const isSelected = selected === opcion;

          let style =
            "w-full rounded-2xl px-4 py-3 text-left text-sm font-medium leading-6 transition border ";

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
              <span className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current/20">
                  {submitted && isCorrect ? (
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Circle className="h-3 w-3" aria-hidden="true" />
                  )}
                </span>
                <span>{opcion}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className={`collapsible-panel ${submitted ? "is-open" : ""}`}>
        <div className="collapsible-panel-inner">
          {submitted && (
            <div
              className={`mt-3 rounded-2xl px-4 py-4 text-sm leading-7 ${
                isCorrectSelection
                  ? "bg-[color:var(--success-soft)] text-[color:var(--text-primary)]"
                  : "bg-[color:var(--danger-soft)] text-[color:var(--text-primary)]"
              }`}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
                Retroalimentacion
              </p>
              <p className="mt-2">
                <span className="font-semibold">{isCorrectSelection ? "Muy bien." : "Casi."}</span>{" "}
                {pregunta?.explicacion}
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
