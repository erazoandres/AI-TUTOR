import { Sparkles } from "lucide-react";
import { MODE_ACCENTS } from "./setupConstants";
import { cx } from "../../utils/classNames";

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
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
        {subjectCards.map((subject) => {
          const isActive = subject.name === selectedSubject.name;

          return (
            <button
              key={subject.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelectSubject(subject.name)}
              className={cx(
                "rounded-[22px] border px-2.5 py-3 text-center transition",
                isActive
                  ? `border-transparent bg-gradient-to-br ${subject.meta.activeBg} ring-1 ${subject.meta.activeRing}`
                  : "border-[color:var(--line)] bg-[color:var(--surface-elevated)] hover:bg-[color:var(--surface-muted)]"
              )}
            >
              <span
                className={`mx-auto inline-flex h-10 w-10 items-center justify-center rounded-2xl text-lg ${subject.meta.bubble}`}
                aria-hidden="true"
              >
                {subject.emoji}
              </span>
              <p className="mt-2 break-words text-[11px] font-semibold leading-4">
                {subject.name}
              </p>
            </button>
          );
        })}
      </div>
    );
  }

  if (step.id === "grade") {
    return (
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
        {grades.map((grade) => {
          const isActive = grade.id === selectedGrade.id;

          return (
            <button
              key={grade.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelectGrade(grade.id)}
              className={cx(
                "rounded-[20px] border px-2.5 py-3 text-left transition",
                isActive
                  ? "border-transparent bg-[color:var(--accent-soft)] ring-1 ring-sky-300/70 dark:ring-sky-400/35"
                  : "border-[color:var(--line)] bg-[color:var(--surface-elevated)] hover:bg-[color:var(--surface-muted)]"
              )}
            >
              <p className="text-sm font-semibold">{grade.label}</p>
              <p className="mt-1 text-[11px] text-[color:var(--text-secondary)]">
                {grade.stage}
              </p>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {modes.map((mode) => {
        const isActive = mode.id === selectedMode.id;
        const accent = MODE_ACCENTS[mode.id] || MODE_ACCENTS.easy;

        return (
          <button
            key={mode.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelectMode(mode.id)}
            className={cx(
              "rounded-[24px] border px-3.5 py-4 text-left transition",
              isActive
                ? "border-transparent bg-[color:var(--surface-strong)] ring-1 ring-[color:var(--accent)]/35 shadow-[0_16px_34px_-24px_rgba(15,23,42,0.65)]"
                : "border-[color:var(--line)] bg-[color:var(--surface-elevated)] hover:bg-[color:var(--surface-muted)]"
            )}
          >
            <span
              className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${accent.bubble}`}
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </span>
            <p className="mt-3 text-sm font-semibold">{mode.name}</p>
            <p className="mt-1 text-xs leading-5 text-[color:var(--text-secondary)]">
              {mode.summary}
            </p>
          </button>
        );
      })}
    </div>
  );
}
