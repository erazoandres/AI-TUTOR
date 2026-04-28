import { GraduationCap } from "lucide-react";
import { cx } from "../../utils/classNames";

export default function BrandPill({ className = "" }) {
  return (
    <div
      className={cx(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ios-chip",
        className
      )}
      translate="no"
    >
      <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
      TutorIA
    </div>
  );
}
