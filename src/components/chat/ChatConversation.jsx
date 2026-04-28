import { Loader2, Send } from "lucide-react";
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
  onInputChange,
  onKeyDown,
  onSend,
}) {
  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-[24px] bg-[color:var(--surface-elevated)]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 sm:px-4">
        <div className="space-y-3">
          {messages.length === 0 && (
            <div className="mx-auto max-w-[560px] space-y-3 pt-4">
              <div className="rounded-[24px] bg-[color:var(--surface-strong)] px-4 py-3 text-center shadow-sm">
                <p className="text-sm font-semibold">Vamos con {activeTopic || subject}</p>
                <p className="mt-1 text-xs leading-5 text-[color:var(--text-secondary)]">
                  {modeSummary || "Te explico claro y corto."}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt.label}
                    type="button"
                    onClick={() => onSend(prompt.prompt)}
                    className="ios-surface-muted min-w-0 rounded-[20px] px-3 py-3 text-center text-xs font-semibold text-[color:var(--text-primary)] transition hover:scale-[1.01]"
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
              actions={
                message.role === "assistant" && index === lastAssistantIndex
                  ? followUpActions
                  : []
              }
              onAction={onSend}
            />
          ))}

          {loading && (
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm ios-chip"
              role="status"
              aria-live="polite"
            >
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Pensando...
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-[color:var(--line)] bg-[color:var(--surface-card)] px-3 py-3">
        <div className="rounded-[24px] bg-[color:var(--surface-strong)] p-2">
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
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent)] text-white shadow-sm transition hover:translate-y-[-1px] disabled:opacity-45"
            >
              <Send className="h-4.5 w-4.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
