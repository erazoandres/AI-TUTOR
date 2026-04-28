import { MoonStar, SunMedium } from "lucide-react";

export default function ThemeSwitch({ checked, onToggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={checked ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      onClick={onToggle}
      className="ios-surface-muted inline-flex items-center gap-2 rounded-full px-2.5 py-2 text-xs font-semibold text-[color:var(--text-primary)] transition hover:scale-[1.01]"
    >
      <span
        className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${
          checked
            ? "bg-slate-900 text-slate-100"
            : "bg-[color:var(--accent-soft)] text-[color:var(--accent)]"
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
