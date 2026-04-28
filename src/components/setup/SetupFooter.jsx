import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SetupFooter({
  activeStep,
  totalSteps,
  isLastStep,
  onPrev,
  onNext,
  onStart,
}) {
  return (
    <footer className="mt-4 flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={onPrev}
        disabled={activeStep === 0}
        className="ios-surface-muted inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)] disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Atras
      </button>

      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
          {activeStep + 1} / {totalSteps}
        </span>

        <button
          type="button"
          onClick={isLastStep ? onStart : onNext}
          className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:translate-y-[-1px]"
        >
          {isLastStep ? "Empezar" : "Seguir"}
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </footer>
  );
}
