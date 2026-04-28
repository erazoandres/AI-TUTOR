import { WORKSPACE_TABS } from "./chatConstants";
import { cx } from "../../utils/classNames";

export default function WorkspaceTabs({ activeView, onChange }) {
  return (
    <div
      className="ios-segmented grid w-full max-w-[460px] grid-cols-4 rounded-full p-1"
      role="tablist"
      aria-label="Espacio de trabajo"
    >
      {WORKSPACE_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeView === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cx(
              "ios-segmented-button inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold",
              isActive && "is-active"
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="workspace-tab-label">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
