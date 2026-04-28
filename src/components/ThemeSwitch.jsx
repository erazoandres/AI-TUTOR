import { MoonStar, SunMedium } from "lucide-react";

export default function ThemeSwitch({ checked, onToggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={checked ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      onClick={onToggle}
      className="ios-surface-muted control-button inline-flex items-center gap-2 rounded-full px-2.5 py-2 text-xs font-semibold transition"
    >
      <span
        className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition ${
          checked
            ? "bg-[color:var(--surface-strong)] text-[color:var(--accent-strong)]"
            : "primary-action"
        }`}
      >
        {checked ? (
          <MoonStar className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <SunMedium className="h-3.5 w-3.5" aria-hidden="true" />
        )}
      </span>
      <span>{checked ? "Oscuro" : "Claro"}</span>
    </button>
  );
}
