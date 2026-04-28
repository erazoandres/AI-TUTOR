import { ArrowLeft, ChevronDown, ChevronUp, RefreshCcw, Sparkles } from "lucide-react";
import WorkspaceTabs from "./WorkspaceTabs";
import { STATUS_BADGES, TOPIC_STATUS_LABELS } from "./chatConstants";
import { cx } from "../../utils/classNames";

export default function ChatHeader({
  subject,
  gradeLabel,
  modeName,
  activeTopic,
  currentTopicStatus,
  workspaceView,
  notice,
  error,
  hasApiKey,
  model,
  isCondensed = false,
  canToggleOverview = false,
  isOverviewExpanded = true,
  onToggleOverview,
  onOpenTopics,
  onReset,
  onBackToSetup,
  onWorkspaceViewChange,
}) {
  return (
    <header
      className={cx(
        "chat-header-shell border-b border-[color:var(--line)] bg-[color:var(--surface-card)] px-4 py-3",
        isCondensed && "is-condensed"
      )}
    >
      <div className="chat-header-overview grid gap-3">
        <div className="chat-header-overview-row grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex min-w-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ios-chip">
                <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{subject}</span>
              </span>
              <span className="inline-flex rounded-full px-3 py-1.5 text-xs font-bold ios-chip">
                {gradeLabel}
              </span>
              <span className="inline-flex rounded-full px-3 py-1.5 text-xs font-bold ios-chip">
                {modeName}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onOpenTopics}
                className="primary-action rounded-full px-4 py-2 text-xs font-bold transition"
              >
                {activeTopic || "Elegir tema"}
              </button>
              {/* Status badge removed to save horizontal space */}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 xl:justify-end">
            <span className="inline-flex min-w-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ios-chip">
              {hasApiKey ? model : "Modo local"}
            </span>
            <button
              type="button"
              onClick={onReset}
              className="ios-surface-muted control-button inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold transition"
            >
              <RefreshCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Limpiar
            </button>
            <button
              type="button"
              onClick={onBackToSetup}
              className="ios-surface-muted control-button inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Ajustes
            </button>
          </div>
        </div>
      </div>

      <div className="chat-header-toolbar mt-3 flex flex-wrap items-center justify-between gap-3">
        <WorkspaceTabs activeView={workspaceView} onChange={onWorkspaceViewChange} />

        <div className="flex flex-wrap items-center justify-end gap-2" aria-live="polite">
          {canToggleOverview && (
            <button
              type="button"
              onClick={onToggleOverview}
              className={cx(
                "chat-header-toggle ios-surface-muted control-button inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold transition",
                !isOverviewExpanded && "is-collapsed"
              )}
            >
              {isOverviewExpanded ? (
                <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {isOverviewExpanded ? "Ocultar panel" : "Mostrar panel"}
            </button>
          )}

          {(notice || error || !hasApiKey) && (
            <>
              {!hasApiKey && (
                <div className="rounded-full bg-[color:var(--warning-soft)] px-3 py-2 text-xs font-bold text-[color:var(--text-primary)]">
                  Modo local
                </div>
              )}
              {hasApiKey && (
                <div className="rounded-full bg-[color:var(--accent-soft)] px-3 py-2 text-xs font-bold text-[color:var(--text-primary)]">
                  {model}
                </div>
              )}
              {notice && (
                <div className="rounded-full bg-[color:var(--accent-soft)] px-3 py-2 text-xs font-bold text-[color:var(--text-primary)]">
                  {notice}
                </div>
              )}
              {error && (
                <div className="rounded-full bg-[color:var(--danger-soft)] px-3 py-2 text-xs font-bold text-[color:var(--text-primary)]">
                  {error}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
