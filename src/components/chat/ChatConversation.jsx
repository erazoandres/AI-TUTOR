import { Lightbulb, Loader2, Send } from "lucide-react";
import MessageBubble from "../MessageBubble";

export default function ChatConversation({
  messages,
  loading,
  input,
  activeTopic,
  subject,
  modeSummary,
  quickPrompts,
  followUpActions,
  lastAssistantIndex,
  scrollRef,
  lastAssistantRef,
  onInputChange,
  onKeyDown,
  onSend,
}) {
  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl bg-[color:var(--surface-elevated)]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-2 sm:px-4">
        <div className="space-y-3">
          {messages.length === 0 && (
            <div className="mx-auto max-w-[920px] space-y-4 pt-2">
              <div className="ios-surface rounded-2xl px-5 py-5 text-center">
                <div className="primary-action mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full">
                  <Lightbulb className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="display-font mt-4 text-2xl font-extrabold">
                  Vamos con <span className="study-gradient-text">{activeTopic || subject}</span>
                </p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[color:var(--text-secondary)]">
                  {modeSummary || "Te explico claro y corto."}
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt.label}
                    type="button"
                    onClick={() => onSend(prompt.prompt)}
                    className="ios-surface-muted hover-lift min-w-0 rounded-2xl px-4 py-4 text-center text-xs font-bold text-[color:var(--text-primary)] transition"
                  >
                    <span className="block truncate">{prompt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              role={message.role}
              content={message.content}
              index={index}
              isLatestAssistant={message.role === "assistant" && index === lastAssistantIndex}
              actions={
                message.role === "assistant" && index === lastAssistantIndex
                  ? followUpActions
                  : []
              }
              anchorRef={message.role === "assistant" && index === lastAssistantIndex ? lastAssistantRef : null}
              onAction={onSend}
            />
          ))}

          {loading && (
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold ios-chip"
              role="status"
              aria-live="polite"
            >
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Pensando...
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-[color:var(--line)] bg-[color:var(--surface-card)] px-3 py-2">
        <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-2 shadow-[var(--shadow-soft)]">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(event) => onInputChange(event.target.value)}
              onKeyDown={onKeyDown}
              aria-label={`Pregunta sobre ${activeTopic || subject}`}
              name="tutor-question"
              autoComplete="off"
              placeholder={`Preguntame algo de ${activeTopic || subject}...`}
              rows={1}
              className="min-h-[44px] max-h-28 min-w-0 flex-1 resize-none border-0 bg-transparent px-3 py-2 text-sm leading-6 text-[color:var(--text-primary)] focus:outline-none focus:ring-0"
            />
            <button
              type="button"
              aria-label="Enviar pregunta"
              onClick={() => onSend()}
              disabled={loading || !input.trim()}
              className="primary-action inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition disabled:opacity-45"
            >
              <Send className="h-4.5 w-4.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
