import { Sparkles } from "lucide-react";
import FormattedContent from "./FormattedContent";

export default function MessageBubble({
  role,
  content,
  index = 0,
  isLatestAssistant = false,
  actions = [],
  anchorRef = null,
  onAction,
}) {
  const isUser = role === "user";

  return (
    <div
      ref={anchorRef}
      className={`animate-fade-up flex ${isUser ? "justify-end" : "justify-start"}`}
      style={{ animationDelay: `${Math.min(index * 40, 180)}ms` }}
    >
      <div
        className={
          isUser
            ? "order-2 max-w-[94%] sm:max-w-[82%] lg:max-w-[68%]"
            : "w-full max-w-full"
        }
      >
        {!isUser && (
          <div className="animate-pop-in mb-2 inline-flex items-center gap-2 rounded-full px-2.5 py-1.5 text-[10px] font-bold ios-chip sm:px-3 sm:text-[11px]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            TutorIA
          </div>
        )}
        <div
          className={`break-words whitespace-pre-wrap px-3 py-2.5 text-sm leading-6 shadow-sm sm:px-3.5 sm:py-3 ${
            isUser
              ? "primary-action rounded-2xl rounded-br-md text-white"
              : `assistant-message-card ios-surface rounded-2xl rounded-bl-md text-[color:var(--text-primary)] ${
                  isLatestAssistant ? "assistant-message-reveal" : ""
                }`
          }`}
        >
          {isUser ? content : <FormattedContent content={content} animated={isLatestAssistant} />}
        </div>

        {!isUser && actions.length > 0 && (
            <div className="assistant-actions mt-3">
              {actions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() =>
                    onAction?.({
                      userFacingContent: action.userFacingContent || action.label,
                      requestContent: action.requestContent,
                    })
                  }
                  className="ios-surface-muted control-button rounded-full px-3 py-2 text-xs font-bold transition"
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
