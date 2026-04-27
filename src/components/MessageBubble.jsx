import { Sparkles } from "lucide-react";
import FormattedContent from "./FormattedContent";

export default function MessageBubble({
  role,
  content,
  index = 0,
  actions = [],
  onAction,
}) {
  const isUser = role === "user";

  return (
    <div
      className={`animate-fade-up flex ${isUser ? "justify-end" : "justify-start"}`}
      style={{ animationDelay: `${Math.min(index * 40, 180)}ms` }}
    >
      <div className={`max-w-[96%] sm:max-w-[88%] ${isUser ? "order-2" : ""}`}>
        {!isUser && (
          <div className="animate-pop-in mb-2 inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-semibold ios-chip">
            <Sparkles className="h-3.5 w-3.5" />
            TutorIA
          </div>
        )}
        <div
          className={`whitespace-pre-wrap px-3.5 py-3 text-sm leading-6 shadow-sm ${
            isUser
              ? "rounded-[22px] rounded-br-md bg-[color:var(--accent)] text-white"
              : "ios-surface rounded-[22px] rounded-bl-md text-[color:var(--text-primary)]"
          }`}
        >
          {isUser ? content : <FormattedContent content={content} />}
        </div>

        {!isUser && actions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => onAction?.(action.prompt)}
                className="ios-surface-muted rounded-full px-3 py-2 text-xs font-medium text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
