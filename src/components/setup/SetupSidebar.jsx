import { Sparkles } from "lucide-react";
import { SETUP_STEPS } from "./setupConstants";
import { cx } from "../../utils/classNames";

export default function SetupSidebar({
  activeStep,
  step,
}) {
  return (
    <aside className="flex min-h-0 flex-col rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-elevated)] px-3 py-3">
      <div className="flex items-center gap-2" aria-label="Progreso de configuracion">
        {SETUP_STEPS.map((item, index) => (
          <div
            key={item.id}
            className={cx(
              "h-2 flex-1 rounded-full transition",
              index <= activeStep
                ? "primary-action"
                : "bg-[color:var(--line)]"
            )}
          />
        ))}
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-3">
        <section className="shrink-0">
          <div className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-bold ios-chip">
            <Sparkles className="h-3.5 w-3.5 text-[color:var(--accent-strong)]" aria-hidden="true" />
            {step.label}
          </div>

          <h1 className="display-font mt-3 max-w-[12ch] text-[clamp(1.5rem,2.2vw,2.1rem)] font-extrabold leading-[0.94] tracking-tight">
            Ruta lista para <span className="study-gradient-text">empezar bien</span>
          </h1>
          <p className="mt-2 max-w-[28ch] text-[13px] leading-5 text-[color:var(--text-secondary)]">
            Materia, grado y dificultad quedan alineados antes de entrar al tutor.
          </p>
        </section>

        <section className="ios-surface-muted mt-auto rounded-xl px-3 py-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
            Antes de entrar
          </p>
          <p className="mt-2 text-[13px] leading-5 text-[color:var(--text-secondary)]">
            Primero elige la materia, luego el grado y al final la dificultad del tutor. La vista
            final aparecera cuando la configuracion quede completa.
          </p>
        </section>
      </div>
    </aside>
  );
}
