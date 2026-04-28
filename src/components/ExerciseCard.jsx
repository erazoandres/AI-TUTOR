import { useState } from "react";
import { ChevronDown, ChevronUp, Lightbulb, Pencil, Sparkles } from "lucide-react";

export default function ExerciseCard({ ejercicio, numero, total = 0 }) {
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const hints = Array.isArray(ejercicio?.pistas) ? ejercicio.pistas : [];

  return (
    <article className="ios-surface hover-lift rounded-2xl px-4 py-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold ios-chip">
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          Ejercicio {numero}{total ? ` / ${total}` : ""}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            aria-expanded={showHint}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
              showHint ? "primary-action" : "ios-surface-muted control-button"
            }`}
          >
            {showHint ? (
              <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            Pista
          </button>

          <button
            type="button"
            onClick={() => setShowAnswer(!showAnswer)}
            aria-expanded={showAnswer}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
              showAnswer
                ? "bg-[color:var(--success-soft)] text-[color:var(--text-primary)]"
                : "ios-surface-muted control-button"
            }`}
          >
            {showAnswer ? (
              <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            Respuesta
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-elevated)] px-4 py-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
              Enunciado
            </p>
            <p className="mt-2 text-sm font-medium leading-7 text-[color:var(--text-primary)]">
              {ejercicio?.enunciado}
            </p>
          </div>
        </div>
      </div>

      <div className={`collapsible-panel ${showHint && hints.length > 0 ? "is-open" : ""}`}>
        <div className="collapsible-panel-inner">
          {showHint && hints.length > 0 && (
            <ul className="mt-3 space-y-2 rounded-2xl bg-[color:var(--accent-soft)] px-4 py-4 text-sm leading-6 text-[color:var(--text-primary)]">
              {hints.map((hint, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Lightbulb
                    className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent-strong)]"
                    aria-hidden="true"
                  />
                  <span>{hint}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className={`collapsible-panel ${showAnswer ? "is-open" : ""}`}>
        <div className="collapsible-panel-inner">
          {showAnswer && (
            <div className="mt-3 rounded-2xl bg-[color:var(--success-soft)] px-4 py-4 text-sm leading-7 text-[color:var(--text-primary)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
                Respuesta sugerida
              </p>
              <p className="mt-2">{ejercicio?.respuesta}</p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
