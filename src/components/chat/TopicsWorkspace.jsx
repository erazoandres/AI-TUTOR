import { STATUS_BADGES, TOPIC_STATUS_LABELS } from "./chatConstants";
import { cx } from "../../utils/classNames";

export default function TopicsWorkspace({
  subject,
  subjectTopics,
  activeTopic,
  currentTopicStatus,
  getTopicStatus,
  onTopicSelect,
  onUpdateTopic,
}) {
  return (
    <section className="flex h-full min-h-0 flex-col gap-3" aria-label="Temas">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {subjectTopics.map((topic) => {
          const status = getTopicStatus(subject, topic);
          const isActive = topic === activeTopic;

          return (
            <button
              key={topic}
              type="button"
              aria-pressed={isActive}
              onClick={() => onTopicSelect(topic)}
              className={cx(
                "rounded-[22px] border px-4 py-4 text-left transition",
                isActive
                  ? "border-transparent bg-[color:var(--accent-soft)] shadow-sm"
                  : "border-[color:var(--line)] bg-[color:var(--surface-elevated)] hover:bg-[color:var(--surface-muted)]"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="min-w-0 break-words text-sm font-semibold text-[color:var(--text-primary)]">
                  {topic}
                </p>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                    STATUS_BADGES[status]
                  }`}
                >
                  {TOPIC_STATUS_LABELS[status]}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="ios-surface-muted rounded-[24px] px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
          Tema activo
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <p className="break-words text-base font-bold">{activeTopic || "Tema libre"}</p>
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              STATUS_BADGES[currentTopicStatus]
            }`}
          >
            {TOPIC_STATUS_LABELS[currentTopicStatus]}
          </span>
        </div>

        {activeTopic && (
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(TOPIC_STATUS_LABELS).map(([statusKey, label]) => (
              <button
                key={statusKey}
                type="button"
                aria-pressed={currentTopicStatus === statusKey}
                onClick={() => onUpdateTopic(subject, activeTopic, statusKey)}
                className={cx(
                  "rounded-full px-3 py-2 text-xs font-semibold transition",
                  currentTopicStatus === statusKey
                    ? "bg-[color:var(--accent)] text-white"
                    : "ios-chip hover:text-[color:var(--text-primary)]"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
