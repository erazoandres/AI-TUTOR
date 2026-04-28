import { SETUP_STEPS } from "./setupConstants";
import { cx } from "../../utils/classNames";

export default function SetupSidebar({
  activeStep,
  step,
  selectedSubject,
  selectedGrade,
  selectedMode,
  selectionChips,
}) {
  return (
    <aside className="rounded-[26px] border border-[color:var(--line)] bg-[color:var(--surface-elevated)] px-3 py-3">
      <div className="flex items-center gap-2" aria-hidden="true">
        {SETUP_STEPS.map((item, index) => (
          <div
            key={item.id}
            className={cx(
              "h-2 flex-1 rounded-full transition",
              index <= activeStep ? "bg-[color:var(--accent)]" : "bg-[color:var(--line)]"
            )}
          />
        ))}
      </div>

      <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
        {step.label}
      </p>
      <h1 className="mt-2 text-[1.35rem] font-bold leading-tight text-balance">
        {step.title}
      </h1>
      <p className="mt-1 text-xs text-[color:var(--text-secondary)]">{step.hint}</p>

      <div
        className={`mt-4 rounded-[24px] bg-gradient-to-br ${selectedSubject.meta.activeBg} px-3 py-3 ring-1 ${selectedSubject.meta.activeRing}`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-lg ${selectedSubject.meta.bubble}`}
            aria-hidden="true"
          >
            {selectedSubject.emoji}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{selectedSubject.name}</p>
            <p className="truncate text-xs text-[color:var(--text-secondary)]">
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
  );
}
