import { HelpCircle, Lightbulb, Loader2, Send } from "lucide-react";
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
  turnPrompt,
  turnReplyMode,
  onTurnReplyModeChange,
  onRequestHint,
  onInputChange,
  onKeyDown,
  onSend,
}) {
  const isEmpty = messages.length === 0;

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl bg-[color:var(--surface-elevated)]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-2 sm:px-4">
        <div className={isEmpty ? "flex min-h-full flex-col justify-center" : "space-y-3"}>
          {isEmpty && (
            <div className="mx-auto flex w-full max-w-[920px] flex-col justify-center py-1">
              <div className="ios-surface rounded-[28px] px-4 py-4 text-center sm:px-5 sm:py-5">
                <div className="primary-action mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full sm:h-11 sm:w-11">
                  <Lightbulb className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="display-font mt-3 text-[clamp(1.55rem,2.5vw,2.4rem)] font-extrabold leading-[1.02]">
                  Vamos con <span className="study-gradient-text">{activeTopic || subject}</span>
                </p>
                <p className="mx-auto mt-2 max-w-[42ch] text-[13px] leading-5 text-[color:var(--text-secondary)] sm:text-sm">
                  {modeSummary || "Te explico claro y corto."}
                </p>

                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  {quickPrompts.map((prompt) => (
                  <button
                    key={prompt.label}
                    type="button"
                    onClick={() =>
                      onSend({
                        userFacingContent: prompt.userFacingContent || prompt.label,
                        requestContent: prompt.requestContent,
                      })
                    }
                    className="ios-surface-muted hover-lift min-h-[52px] min-w-0 rounded-2xl px-3 py-3 text-center text-xs font-bold text-[color:var(--text-primary)] transition"
                  >
                    <span className="block truncate">{prompt.label}</span>
                    </button>
                  ))}
                </div>
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
        {turnPrompt && (
          <div className="mb-2 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-elevated)] px-3 py-2.5 shadow-[var(--shadow-soft)]">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[color:var(--accent-strong)]">
                    Tu turno
                  </p>
                  <p className="min-w-0 text-[13px] font-medium leading-5 text-[color:var(--text-primary)]">
                    {turnPrompt}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onRequestHint}
                className="ios-surface-muted control-button inline-flex min-h-[36px] items-center rounded-full px-3 py-1.5 text-[11px] font-bold transition"
              >
                <HelpCircle className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
                Pista
              </button>

              <div className="ios-segmented inline-flex rounded-full p-1">
                <button
                  type="button"
                  onClick={() => onTurnReplyModeChange("review")}
                  className={`ios-segmented-button min-h-[36px] rounded-full px-3 py-1.5 text-[11px] font-bold ${
                    turnReplyMode === "review" ? "is-active" : ""
                  }`}
                >
                  Revisar
                </button>
                <button
                  type="button"
                  onClick={() => onTurnReplyModeChange("guided")}
                  className={`ios-segmented-button min-h-[36px] rounded-full px-3 py-1.5 text-[11px] font-bold ${
                    turnReplyMode === "guided" ? "is-active" : ""
                  }`}
                >
                  Con ayuda
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-2 shadow-[var(--shadow-soft)]">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(event) => onInputChange(event.target.value)}
              onKeyDown={onKeyDown}
              aria-label={`Pregunta sobre ${activeTopic || subject}`}
              name="tutor-question"
              autoComplete="off"
              placeholder={
                turnPrompt
                  ? "Escribe tu respuesta a la pregunta del tutor..."
                  : `Preguntame algo de ${activeTopic || subject}...`
              }
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
