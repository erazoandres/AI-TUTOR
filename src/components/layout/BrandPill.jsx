import { GraduationCap } from "lucide-react";
import { cx } from "../../utils/classNames";

export default function BrandPill({ className = "" }) {
  return (
    <div
      className={cx(
        "inline-flex items-center gap-3 rounded-full px-2.5 py-2 ios-chip",
        className
      )}
      translate="no"
    >
      <span className="primary-action inline-flex h-9 w-9 items-center justify-center rounded-full">
        <GraduationCap className="h-4.5 w-4.5" aria-hidden="true" />
      </span>
      <span className="leading-none">
        <span className="display-font block text-sm font-extrabold text-[color:var(--text-primary)]">
          TutorIA
        </span>
        <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
          estudio guiado
        </span>
      </span>
    </div>
  );
}
