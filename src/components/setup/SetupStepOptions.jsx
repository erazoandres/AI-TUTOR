import { ArrowRight, BookOpenCheck, Gauge, Sparkles } from "lucide-react";
import { MODE_ACCENTS } from "./setupConstants";
import { cx } from "../../utils/classNames";

const MODE_VISUALS = {
  easy: {
    icon: BookOpenCheck,
    helper: "Ideal si quieres pasos cortos y cero saltos.",
    compare: "1 idea por turno, apoyo alto",
  },
  medium: {
    icon: Gauge,
    helper: "Ideal si quieres claridad con un poco mas de reto.",
    compare: "equilibrio entre guia y reto",
  },
  detailed: {
    icon: Sparkles,
    helper: "Ideal si quieres mas contexto, porques y matices.",
    compare: "mas profundidad, menos resumen",
  },
};

export default function SetupStepOptions({
  step,
  subjectCards,
  grades,
  modes,
  selectedSubject,
  selectedGrade,
  selectedMode,
  onSelectSubject,
  onSelectGrade,
  onSelectMode,
}) {
  if (step.id === "subject") {
    return (
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        {subjectCards.map((subject) => {
          const isActive = subject.name === selectedSubject.name;

          return (
            <button
              key={subject.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelectSubject(subject.name)}
              style={{
                "--subject-glow": subject.meta.glow,
                "--subject-glow-soft": subject.meta.glowSoft,
              }}
              className={cx(
                "subject-option-card hover-lift rounded-xl border px-3 py-3 text-left transition",
                isActive
                  ? `border-transparent bg-gradient-to-br ${subject.meta.activeBg} shadow-[var(--shadow-color)] ring-1 ${subject.meta.activeRing}`
                  : "border-[color:var(--line)] bg-[color:var(--surface-elevated)] hover:bg-[color:var(--surface-muted)]"
              )}
            >
              <div className="subject-option-card-content">
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-lg ${subject.meta.bubble}`}
                    aria-hidden="true"
                  >
                    {subject.emoji}
                  </span>
                  <span className="rounded-full px-2.5 py-1 text-[10px] font-bold ios-chip">
                    {subject.mastery}%
                  </span>
                </div>
                <p className="mt-2.5 break-words text-sm font-bold leading-5">
                  {subject.name}
                </p>
                <p className="mt-1 min-h-8 text-[11px] leading-4 text-[color:var(--text-secondary)]">
                  {subject.meta.summary}
                </p>
                <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[color:var(--surface-muted)]">
                  <div
                    className={`h-full rounded-full ${subject.meta.bar}`}
                    style={{ width: `${subject.mastery}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  if (step.id === "grade") {
    return (
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        {grades.map((grade) => {
          const isActive = grade.id === selectedGrade.id;

          return (
            <button
              key={grade.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelectGrade(grade.id)}
              className={cx(
                "hover-lift rounded-xl border px-3 py-3 text-left transition",
                isActive
                  ? "border-transparent bg-[color:var(--accent-soft)] shadow-[var(--shadow-color)] ring-1 ring-[color:var(--accent)]/40"
                  : "border-[color:var(--line)] bg-[color:var(--surface-elevated)] hover:bg-[color:var(--surface-muted)]"
              )}
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--accent-soft)] text-xs font-extrabold text-[color:var(--accent-strong)]">
                {grade.label}
              </div>
              <p className="mt-2.5 text-sm font-bold">{grade.longLabel}</p>
              <p className="mt-1 text-[11px] font-semibold text-[color:var(--text-secondary)]">
                {grade.stage}
              </p>
              <p className="mt-1.5 text-[11px] leading-4 text-[color:var(--text-secondary)]">
                {grade.summary}
              </p>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid gap-2.5 md:grid-cols-3">
      {modes.map((mode) => {
        const isActive = mode.id === selectedMode.id;
        const accent = MODE_ACCENTS[mode.id] || MODE_ACCENTS.easy;
        const visual = MODE_VISUALS[mode.id] || MODE_VISUALS.easy;
        const Icon = visual.icon;

        return (
          <button
            key={mode.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelectMode(mode.id)}
            className={cx(
              "hover-lift rounded-xl border px-4 py-4 text-left transition",
              isActive
                ? "border-transparent bg-[color:var(--surface-strong)] shadow-[var(--shadow-color)] ring-1 ring-[color:var(--accent)]/35"
                : "border-[color:var(--line)] bg-[color:var(--surface-elevated)] hover:bg-[color:var(--surface-muted)]"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${accent.bubble}`}
              >
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <ArrowRight className="h-4.5 w-4.5 text-[color:var(--text-secondary)]" aria-hidden="true" />
            </div>
            <p className="mt-3 text-base font-bold">{mode.name}</p>
            <p className="mt-1 text-xs font-semibold text-[color:var(--text-secondary)]">
              {mode.shortLabel}
            </p>
            <p className="mt-2 min-h-[3.75rem] text-[13px] leading-5 text-[color:var(--text-secondary)]">
              {mode.summary}
            </p>
            <p className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${accent.badge}`}>
              {visual.compare}
            </p>
            <p className="mt-2 text-[11px] leading-4 text-[color:var(--text-secondary)]">
              {visual.helper}
            </p>
          </button>
        );
      })}
    </div>
  );
}
