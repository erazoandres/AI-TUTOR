import { ArrowLeft, RefreshCcw, Sparkles } from "lucide-react";
import WorkspaceTabs from "./WorkspaceTabs";
import { STATUS_BADGES, TOPIC_STATUS_LABELS } from "./chatConstants";

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
  onOpenTopics,
  onReset,
  onBackToSetup,
  onWorkspaceViewChange,
}) {
  return (
    <header className="border-b border-[color:var(--line)] px-4 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex min-w-0 items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ios-chip">
              <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{subject}</span>
            </span>
            <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold ios-chip">
              {gradeLabel}
            </span>
            <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold ios-chip">
              {modeName}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenTopics}
              className="ios-surface-muted rounded-full px-3 py-1.5 text-xs font-semibold text-[color:var(--text-primary)] transition hover:scale-[1.01]"
            >
              {activeTopic || "Elegir tema"}
            </button>
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                STATUS_BADGES[currentTopicStatus]
              }`}
            >
              {TOPIC_STATUS_LABELS[currentTopicStatus]}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="ios-surface-muted inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
          >
            <RefreshCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Limpiar
          </button>
          <button
            type="button"
            onClick={onBackToSetup}
            className="ios-surface-muted inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Setup
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <WorkspaceTabs activeView={workspaceView} onChange={onWorkspaceViewChange} />

        {(notice || error || !hasApiKey) && (
          <div className="flex flex-wrap gap-2" aria-live="polite">
            {!hasApiKey && (
              <div className="rounded-full bg-[color:var(--warning-soft)] px-3 py-1.5 text-xs font-medium text-[color:var(--text-primary)]">
                Modo local
              </div>
            )}
            {hasApiKey && (
              <div className="rounded-full bg-[color:var(--accent-soft)] px-3 py-1.5 text-xs font-medium text-[color:var(--text-primary)]">
                {model}
              </div>
            )}
            {notice && (
              <div className="rounded-full bg-[color:var(--accent-soft)] px-3 py-1.5 text-xs font-medium text-[color:var(--text-primary)]">
                {notice}
              </div>
            )}
            {error && (
              <div className="rounded-full bg-[color:var(--danger-soft)] px-3 py-1.5 text-xs font-medium text-[color:var(--text-primary)]">
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
