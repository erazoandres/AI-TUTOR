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
    <footer className="mt-2 flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={onPrev}
        disabled={activeStep === 0}
        className="ios-surface-muted control-button inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-bold transition disabled:opacity-40"
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
          className="primary-action inline-flex items-center gap-2 rounded-full px-4.5 py-2 text-sm font-bold transition"
        >
          {isLastStep ? "Entrar al tutor" : "Seguir"}
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </footer>
  );
}
