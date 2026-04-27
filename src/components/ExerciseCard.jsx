import { useState } from "react";
import { ChevronDown, ChevronUp, Lightbulb, Pencil } from "lucide-react";

export default function ExerciseCard({ ejercicio, numero }) {
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const hints = Array.isArray(ejercicio?.pistas) ? ejercicio.pistas : [];

  return (
    <article className="ios-surface rounded-lg px-3 py-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-semibold ios-chip">
          <Pencil className="h-3.5 w-3.5" />
          Ejercicio {numero}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="ios-surface-muted inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold text-[color:var(--text-secondary)]"
          >
            {showHint ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            Pista
          </button>

          <button
            type="button"
            onClick={() => setShowAnswer(!showAnswer)}
            className="ios-surface-muted inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold text-[color:var(--text-secondary)]"
          >
            {showAnswer ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
            Respuesta
          </button>
        </div>
      </div>

      <p className="text-sm font-medium leading-6 text-[color:var(--text-primary)]">
        {ejercicio?.enunciado}
      </p>

      {showHint && hints.length > 0 && (
        <ul className="mt-3 space-y-2 rounded-lg bg-[color:var(--accent-soft)] px-3 py-3 text-sm leading-6 text-[color:var(--text-primary)]">
          {hints.map((hint, index) => (
            <li key={index} className="flex items-start gap-2">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent-strong)]" />
              <span>{hint}</span>
            </li>
          ))}
        </ul>
      )}

      {showAnswer && (
        <div className="mt-3 rounded-lg bg-[color:var(--success-soft)] px-3 py-3 text-sm leading-6 text-[color:var(--text-primary)]">
          {ejercicio?.respuesta}
        </div>
      )}
    </article>
  );
}
