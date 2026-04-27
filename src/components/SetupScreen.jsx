import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, GraduationCap, Sparkles } from "lucide-react";
import ThemeSwitch from "./ThemeSwitch";

const STEPS = [
  { id: "subject", label: "Tema", title: "Que quieres estudiar?", hint: "Elige una materia" },
  { id: "grade", label: "Grado", title: "En que grado estas?", hint: "Del 5to al 11" },
  { id: "mode", label: "Dificultad", title: "Como lo quieres?", hint: "Facil o dificil" },
];

const MODE_ACCENTS = {
  easy: {
    badge: "bg-sky-500/12 text-sky-700 dark:text-sky-200",
    bubble: "bg-sky-500/14 text-sky-700 dark:text-sky-200",
  },
  hard: {
    badge: "bg-rose-500/14 text-rose-700 dark:text-rose-200",
    bubble: "bg-rose-500/16 text-rose-700 dark:text-rose-200",
  },
};

export default function SetupScreen({
  subjectCards,
  grades,
  modes,
  selectedSubject,
  selectedGrade,
  selectedMode,
  isDark,
  onToggleTheme,
  onSelectSubject,
  onSelectGrade,
  onSelectMode,
  onStart,
}) {
  const [activeStep, setActiveStep] = useState(0);
  const step = STEPS[activeStep] || STEPS[0];
  const isLastStep = activeStep === STEPS.length - 1;
  const modeAccent = MODE_ACCENTS[selectedMode.id] || MODE_ACCENTS.easy;

  const selectionChips = useMemo(
    () => [
      { key: "subject", value: selectedSubject.name, tone: selectedSubject.meta.badge },
      { key: "grade", value: selectedGrade.longLabel, tone: "ios-chip" },
      { key: "mode", value: selectedMode.name, tone: modeAccent.badge },
    ],
    [
      modeAccent.badge,
      selectedGrade.longLabel,
      selectedMode.name,
      selectedSubject.meta.badge,
      selectedSubject.name,
    ]
  );

  const goPrev = () => setActiveStep((current) => Math.max(current - 1, 0));
  const goNext = () => setActiveStep((current) => Math.min(current + 1, STEPS.length - 1));

  const handleSubjectSelect = (subjectName) => {
    onSelectSubject(subjectName);
    setActiveStep(1);
  };

  const handleGradeSelect = (gradeId) => {
    onSelectGrade(gradeId);
    setActiveStep(2);
  };

  const renderStepOptions = () => {
    if (step.id === "subject") {
      return (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
          {subjectCards.map((subject) => {
            const isActive = subject.name === selectedSubject.name;

            return (
              <button
                key={subject.id}
                type="button"
                onClick={() => handleSubjectSelect(subject.name)}
                className={`rounded-[22px] border px-2.5 py-3 text-center transition ${
                  isActive
                    ? `border-transparent bg-gradient-to-br ${subject.meta.activeBg} ring-1 ${subject.meta.activeRing}`
                    : "border-[color:var(--line)] bg-[color:var(--surface-elevated)] hover:bg-[color:var(--surface-muted)]"
                }`}
              >
                <span
                  className={`mx-auto inline-flex h-10 w-10 items-center justify-center rounded-2xl text-lg ${subject.meta.bubble}`}
                >
                  {subject.emoji}
                </span>
                <p className="mt-2 text-[11px] font-semibold leading-4">{subject.name}</p>
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
                onClick={() => handleGradeSelect(grade.id)}
                className={`rounded-[20px] border px-2.5 py-3 text-left transition ${
                  isActive
                    ? "border-transparent bg-[color:var(--accent-soft)] ring-1 ring-sky-300/70 dark:ring-sky-400/35"
                    : "border-[color:var(--line)] bg-[color:var(--surface-elevated)] hover:bg-[color:var(--surface-muted)]"
                }`}
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
              onClick={() => onSelectMode(mode.id)}
              className={`rounded-[24px] border px-3.5 py-4 text-left transition ${
                isActive
                  ? "border-transparent bg-[color:var(--surface-strong)] ring-1 ring-[color:var(--accent)]/35 shadow-[0_16px_34px_-24px_rgba(15,23,42,0.65)]"
                  : "border-[color:var(--line)] bg-[color:var(--surface-elevated)] hover:bg-[color:var(--surface-muted)]"
              }`}
            >
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${accent.bubble}`}
              >
                <Sparkles className="h-4 w-4" />
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
  };

  return (
    <div className="mx-auto flex h-full max-w-[1020px] items-center justify-center px-3 py-3">
      <section className="ios-surface grid h-full max-h-full min-h-0 w-full grid-rows-[auto_minmax(0,1fr)] rounded-[30px] px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ios-chip">
            <GraduationCap className="h-3.5 w-3.5" />
            TutorIA
          </div>

          <ThemeSwitch checked={isDark} onToggle={onToggleTheme} />
        </div>

        <div className="mt-4 grid min-h-0 gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="rounded-[26px] border border-[color:var(--line)] bg-[color:var(--surface-elevated)] px-3 py-3">
            <div className="flex items-center gap-2">
              {STEPS.map((item, index) => (
                <div
                  key={item.id}
                  className={`h-2 flex-1 rounded-full transition ${
                    index <= activeStep ? "bg-[color:var(--accent)]" : "bg-[color:var(--line)]"
                  }`}
                />
              ))}
            </div>

            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
              {step.label}
            </p>
            <h1 className="mt-2 text-[1.35rem] font-bold leading-tight">{step.title}</h1>
            <p className="mt-1 text-xs text-[color:var(--text-secondary)]">{step.hint}</p>

            <div
              className={`mt-4 rounded-[24px] bg-gradient-to-br ${selectedSubject.meta.activeBg} px-3 py-3 ring-1 ${selectedSubject.meta.activeRing}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl text-lg ${selectedSubject.meta.bubble}`}
                >
                  {selectedSubject.emoji}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{selectedSubject.name}</p>
                  <p className="text-xs text-[color:var(--text-secondary)]">
                    {selectedGrade.label} - {selectedMode.name}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {selectionChips.map((chip) => (
                  <span
                    key={chip.key}
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${chip.tone}`}
                  >
                    {chip.value}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          <div className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto] rounded-[26px] border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-3 py-3 dark:bg-slate-950/24 sm:px-4 sm:py-4">
            <div className="min-h-0 overflow-y-auto pr-1">{renderStepOptions()}</div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={goPrev}
                disabled={activeStep === 0}
                className="ios-surface-muted inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)] disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Atras
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
                  {activeStep + 1} / {STEPS.length}
                </span>

                {isLastStep ? (
                  <button
                    type="button"
                    onClick={onStart}
                    className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:translate-y-[-1px]"
                  >
                    Empezar
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={goNext}
                    className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:translate-y-[-1px]"
                  >
                    Seguir
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
