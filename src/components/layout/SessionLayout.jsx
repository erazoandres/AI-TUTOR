import BrandPill from "./BrandPill";
import ThemeSwitch from "../ThemeSwitch";

export default function SessionLayout({ isDark, onToggleTheme, children }) {
  return (
    <div className="h-screen min-h-screen overflow-hidden text-[color:var(--text-primary)] xl:h-[100dvh]">
      <div className="mx-auto flex h-full min-h-0 max-w-[1320px] flex-col gap-2 px-2 py-2 sm:px-3 sm:py-3">
        <header className="flex items-center justify-between gap-3">
          <BrandPill />
          <ThemeSwitch checked={isDark} onToggle={onToggleTheme} />
        </header>

        <main className="h-full min-h-0 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
