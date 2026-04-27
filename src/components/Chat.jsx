import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  LayoutGrid,
  Loader2,
  MessageSquare,
  RefreshCcw,
  Send,
  Sparkles,
  Target,
} from "lucide-react";
import { useGroqAPI } from "../hooks/useGroqAPI";
import { useProgress } from "../hooks/useProgress";
import { findTopicMatch, getSubjectByName } from "../utils/subjects";
import ExerciseCard from "./ExerciseCard";
import MessageBubble from "./MessageBubble";
import QuizCard from "./QuizCard";

const CHAT_STORAGE_PREFIX = "tutoria_chat";
const TOPIC_STATUS_LABELS = {
  pendiente: "Pendiente",
  visto: "Visto",
  dominado: "Dominado",
  repasar: "Repasar",
};

const STATUS_BADGES = {
  pendiente: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  visto: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200",
  dominado: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200",
  repasar: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200",
};

function getStorageKey(subject, grade, mode) {
  return `${CHAT_STORAGE_PREFIX}:${subject}:${grade}:${mode}`;
}

function getDefaultState() {
  return {
    messages: [],
    selectedTopic: "",
    exercises: [],
    exerciseTopic: "",
    quiz: [],
    quizTopic: "",
    quizProgress: { answered: 0, correct: 0 },
  };
}

function readStoredChat(storageKey) {
  if (typeof window === "undefined") {
    return getDefaultState();
  }

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) {
      return getDefaultState();
    }

    const parsed = JSON.parse(stored);
    return {
      messages: Array.isArray(parsed?.messages) ? parsed.messages : [],
      selectedTopic: parsed?.selectedTopic || "",
      exercises: Array.isArray(parsed?.exercises) ? parsed.exercises : [],
      exerciseTopic: parsed?.exerciseTopic || "",
      quiz: Array.isArray(parsed?.quiz) ? parsed.quiz : [],
      quizTopic: parsed?.quizTopic || "",
      quizProgress: parsed?.quizProgress || { answered: 0, correct: 0 },
    };
  } catch {
    return getDefaultState();
  }
}

export default function Chat({ subject, grade, mode, studentProfile, onBackToSetup }) {
  const storageKey = useMemo(
    () => getStorageKey(subject, grade, mode),
    [subject, grade, mode]
  );
  const storedState = useMemo(() => readStoredChat(storageKey), [storageKey]);
  const [messages, setMessages] = useState(storedState.messages);
  const [input, setInput] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(storedState.selectedTopic);
  const [exercises, setExercises] = useState(storedState.exercises);
  const [exerciseTopic, setExerciseTopic] = useState(storedState.exerciseTopic);
  const [quiz, setQuiz] = useState(storedState.quiz);
  const [quizTopic, setQuizTopic] = useState(storedState.quizTopic);
  const [quizProgress, setQuizProgress] = useState(
    storedState.quizProgress || { answered: 0, correct: 0 }
  );
  const [notice, setNotice] = useState("");
  const [sideView, setSideView] = useState("practice");
  const [practiceView, setPracticeView] = useState(
    storedState.quiz?.length ? "quiz" : "exercises"
  );
  const scrollRef = useRef(null);
  const subjectMeta = useMemo(() => getSubjectByName(subject, grade), [grade, subject]);
  const subjectTopics = subjectMeta?.topics || [];
  const gradeLabel = studentProfile?.grade?.longLabel || "este grado";
  const modeName = studentProfile?.mode?.name || "Facil";
  const modeSummary = studentProfile?.mode?.summary || "";

  const inferredTopic = useMemo(() => {
    const fromInput = findTopicMatch(subject, input, grade);
    if (fromInput) {
      return fromInput;
    }

    const latestUserQuestion = [...messages]
      .reverse()
      .find((message) => message.role === "user")
      ?.content;

    return findTopicMatch(subject, latestUserQuestion || "", grade);
  }, [grade, input, messages, subject]);

  const activeTopic = selectedTopic || inferredTopic || subjectTopics[0] || "";
  const { updateTopic, getTopicStatus } = useProgress();
  const {
    sendMessage,
    generateExercises,
    generateQuiz,
    loading,
    error,
    hasApiKey,
    model,
    clearError,
  } = useGroqAPI();

  const quickPrompts = useMemo(() => {
    const focus = activeTopic || subject;

    return [
      `Explicame ${focus} para ${gradeLabel} en modo ${modeName.toLowerCase()}.`,
      `Dame un ejemplo corto de ${focus} para ${gradeLabel}.`,
      mode === "easy"
        ? `Hazme una pregunta facil de ${focus}.`
        : `Hazme una pregunta retadora de ${focus}.`,
    ];
  }, [activeTopic, gradeLabel, mode, modeName, subject]);

  const followUpActions = useMemo(() => {
    const focus = activeTopic || subject;

    return [
      {
        label: mode === "easy" ? "Mas simple" : "Mas claro",
        prompt: `Explicamelo mejor para ${gradeLabel}, sobre ${focus}, con lenguaje mas simple.`,
      },
      {
        label: "Otro ejemplo",
        prompt: `Dame otro ejemplo corto de ${focus} para ${gradeLabel}.`,
      },
      {
        label: mode === "easy" ? "Mini reto" : "Sube reto",
        prompt:
          mode === "easy"
            ? `Ponme un mini reto de una sola pregunta sobre ${focus} para ${gradeLabel}.`
            : `Ponme una sola pregunta un poco mas dificil sobre ${focus} para ${gradeLabel}.`,
      },
    ];
  }, [activeTopic, gradeLabel, mode, subject]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        messages,
        selectedTopic,
        exercises,
        exerciseTopic,
        quiz,
        quizTopic,
        quizProgress,
      })
    );
  }, [
    exercises,
    exerciseTopic,
    messages,
    quiz,
    quizProgress,
    quizTopic,
    selectedTopic,
    storageKey,
  ]);

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }

    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const topicStats = useMemo(() => {
    const counts = { pendiente: 0, visto: 0, dominado: 0, repasar: 0 };

    subjectTopics.forEach((topic) => {
      const status = getTopicStatus(subject, topic);
      counts[status] += 1;
    });

    const total = subjectTopics.length || 1;
    const activeCount = counts.visto + counts.dominado + counts.repasar;

    return {
      counts,
      total,
      activeCount,
      masteredPercent: Math.round((counts.dominado / total) * 100),
    };
  }, [getTopicStatus, subject, subjectTopics]);

  const currentTopicStatus = activeTopic ? getTopicStatus(subject, activeTopic) : "pendiente";
  const lastAssistantIndex = [...messages]
    .map((message, index) => (message.role === "assistant" ? index : -1))
    .filter((index) => index >= 0)
    .pop();

  const markTopicAsSeen = (topicName) => {
    if (topicName && getTopicStatus(subject, topicName) === "pendiente") {
      updateTopic(subject, topicName, "visto");
    }
  };

  const handleSend = async (customInput) => {
    const textToSend = (customInput ?? input).trim();
    if (!textToSend || loading) {
      return;
    }

    const detectedTopic = findTopicMatch(subject, textToSend, grade);
    const topicForTurn = selectedTopic || detectedTopic || activeTopic;
    const userMessage = { role: "user", content: textToSend };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setNotice("");

    if (detectedTopic && !selectedTopic) {
      setSelectedTopic(detectedTopic);
    }

    if (error) {
      clearError();
    }

    markTopicAsSeen(topicForTurn);

    const response = await sendMessage({
      messages: newMessages,
      subject,
      grade,
      mode,
      topic: topicForTurn,
      studentProfile,
    });

    if (response) {
      setMessages([...newMessages, { role: "assistant", content: response }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic((current) => (current === topic ? "" : topic));
    setNotice("");
  };

  const handleGenerateExercises = async () => {
    const topicForTurn = activeTopic;
    if (!topicForTurn) {
      setNotice("Elige un tema para crear ejercicios.");
      return;
    }

    setNotice("");
    setSideView("practice");
    setPracticeView("exercises");

    const generatedExercises = await generateExercises({
      subject,
      topic: topicForTurn,
      grade,
      mode,
      studentProfile,
    });

    setExercises(generatedExercises);
    setExerciseTopic(topicForTurn);
    markTopicAsSeen(topicForTurn);
  };

  const handleGenerateQuiz = async () => {
    const topicForTurn = activeTopic;
    if (!topicForTurn) {
      setNotice("Elige un tema para crear un quiz.");
      return;
    }

    setNotice("");
    setSideView("practice");
    setPracticeView("quiz");

    const generatedQuiz = await generateQuiz({
      subject,
      topic: topicForTurn,
      grade,
      mode,
      studentProfile,
    });

    setQuiz(generatedQuiz);
    setQuizTopic(topicForTurn);
    setQuizProgress({ answered: 0, correct: 0 });
    markTopicAsSeen(topicForTurn);
  };

  const handleQuizAnswer = (isCorrect) => {
    setQuizProgress((current) => {
      const next = {
        answered: current.answered + 1,
        correct: current.correct + (isCorrect ? 1 : 0),
      };

      if (quiz.length > 0 && next.answered === quiz.length && quizTopic) {
        const nextStatus = next.correct / quiz.length >= 0.8 ? "dominado" : "repasar";
        updateTopic(subject, quizTopic, nextStatus);
      }

      return next;
    });
  };

  const handleResetWorkspace = () => {
    setMessages([]);
    setExercises([]);
    setExerciseTopic("");
    setQuiz([]);
    setQuizTopic("");
    setQuizProgress({ answered: 0, correct: 0 });
    setInput("");
    setNotice("");
    setSelectedTopic("");
    clearError();
  };

  const hasExercises = exercises.length > 0;
  const hasQuiz = quiz.length > 0;

  return (
    <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
      <section className="flex min-h-0 flex-col gap-3">
        <div className="ios-surface rounded-lg px-3 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ios-chip">
                <Sparkles className="h-3.5 w-3.5" />
                {subject}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ios-chip">
                {gradeLabel}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ios-chip">
                Modo {modeName}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  STATUS_BADGES[currentTopicStatus]
                }`}
              >
                {activeTopic ? `${activeTopic} · ${TOPIC_STATUS_LABELS[currentTopicStatus]}` : "Sin tema"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onBackToSetup}
                className="ios-surface-muted inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Setup
              </button>
              <button
                type="button"
                onClick={handleGenerateExercises}
                disabled={loading}
                className="ios-surface-muted inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)] disabled:opacity-55"
              >
                <BookOpen className="h-3.5 w-3.5" />
                Ejercicios
              </button>
              <button
                type="button"
                onClick={handleGenerateQuiz}
                disabled={loading}
                className="ios-surface-muted inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)] disabled:opacity-55"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                Quiz
              </button>
              <button
                type="button"
                onClick={handleResetWorkspace}
                className="ios-surface-muted inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                Limpiar
              </button>
            </div>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {subjectTopics.map((topic) => {
              const isActive = selectedTopic === topic || (!selectedTopic && activeTopic === topic);
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => handleTopicSelect(topic)}
                  className={`shrink-0 rounded-full px-3 py-2 text-xs font-semibold transition ${
                    isActive
                      ? "bg-[color:var(--accent)] text-white shadow-sm"
                      : "ios-chip hover:text-[color:var(--text-primary)]"
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>

          {(notice || error || !hasApiKey) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {!hasApiKey && (
                <div className="rounded-full bg-[color:var(--warning-soft)] px-3 py-1.5 text-xs text-[color:var(--text-primary)]">
                  Modo local
                </div>
              )}
              {hasApiKey && (
                <div className="rounded-full bg-[color:var(--accent-soft)] px-3 py-1.5 text-xs text-[color:var(--text-primary)]">
                  {model}
                </div>
              )}
              {notice && (
                <div className="rounded-full bg-[color:var(--accent-soft)] px-3 py-1.5 text-xs text-[color:var(--text-primary)]">
                  {notice}
                </div>
              )}
              {error && (
                <div className="rounded-full bg-[color:var(--danger-soft)] px-3 py-1.5 text-xs text-[color:var(--text-primary)]">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="ios-surface flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg">
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3">
            <div className="space-y-3">
              {messages.length === 0 && (
                <div className="grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
                  <div className="rounded-lg bg-[color:var(--accent-soft)] px-4 py-4">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[color:var(--accent)] shadow-sm dark:bg-slate-900">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3 text-lg font-bold">Listo para {gradeLabel}</h3>
                    <p className="mt-1 text-sm leading-6 text-[color:var(--text-secondary)]">
                      {modeSummary || "Respondo corto, claro y adaptado al estudiante."}
                    </p>
                  </div>

                  <div className="grid gap-2">
                    {quickPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => handleSend(prompt)}
                        className="ios-surface-muted rounded-lg px-4 py-3 text-left text-sm text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <MessageBubble
                  key={i}
                  role={msg.role}
                  content={msg.content}
                  index={i}
                  actions={msg.role === "assistant" && i === lastAssistantIndex ? followUpActions : []}
                  onAction={handleSend}
                />
              ))}

              {loading && (
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm ios-chip">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Pensando...
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-[color:var(--line)] px-3 py-3">
            <div className="flex items-end gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Preguntame algo de ${activeTopic || subject} para ${gradeLabel}...`}
                rows={2}
                className="ios-input min-h-[54px] flex-1 resize-none rounded-[20px] px-4 py-3 text-sm leading-6 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-500/30"
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--accent)] text-white shadow-sm transition hover:translate-y-[-1px] disabled:opacity-45"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <aside className="grid min-h-0 gap-3 xl:grid-rows-[auto_minmax(0,1fr)]">
        <div className="grid grid-cols-3 gap-2">
          <div className="ios-surface rounded-lg px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
              Dominio
            </p>
            <p className="mt-1 text-xl font-bold">{topicStats.masteredPercent}%</p>
          </div>
          <div className="ios-surface rounded-lg px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
              Activos
            </p>
            <p className="mt-1 text-xl font-bold">{topicStats.activeCount}</p>
          </div>
          <div className="ios-surface rounded-lg px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
              Repasar
            </p>
            <p className="mt-1 text-xl font-bold">{topicStats.counts.repasar}</p>
          </div>
        </div>

        <div className="ios-surface flex min-h-0 flex-col overflow-hidden rounded-lg">
          <div className="border-b border-[color:var(--line)] px-3 py-3">
            <div className="ios-segmented grid grid-cols-2 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setSideView("practice")}
                className={`ios-segmented-button flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold ${
                  sideView === "practice" ? "is-active" : ""
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                Practica
              </button>
              <button
                type="button"
                onClick={() => setSideView("topics")}
                className={`ios-segmented-button flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold ${
                  sideView === "topics" ? "is-active" : ""
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Temas
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
            {sideView === "practice" ? (
              <div className="space-y-3">
                {(hasExercises || hasQuiz) && (
                  <div className="ios-segmented grid grid-cols-2 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setPracticeView("exercises")}
                      className={`ios-segmented-button px-3 py-2 text-xs font-semibold ${
                        practiceView === "exercises" ? "is-active" : ""
                      }`}
                    >
                      Ejercicios
                    </button>
                    <button
                      type="button"
                      onClick={() => setPracticeView("quiz")}
                      className={`ios-segmented-button px-3 py-2 text-xs font-semibold ${
                        practiceView === "quiz" ? "is-active" : ""
                      }`}
                    >
                      Quiz
                    </button>
                  </div>
                )}

                {practiceView === "quiz" && hasQuiz && (
                  <>
                    <div className="ios-surface-muted rounded-lg px-4 py-3">
                      <p className="text-sm font-semibold">{quizTopic}</p>
                      <p className="mt-1 text-xs text-[color:var(--text-secondary)]">
                        {quizProgress.correct} bien de {quizProgress.answered} respondidas.
                      </p>
                    </div>
                    {quiz.map((question, index) => (
                      <QuizCard
                        key={`${quizTopic}-${index}`}
                        pregunta={question}
                        numero={index + 1}
                        onAnswer={handleQuizAnswer}
                      />
                    ))}
                  </>
                )}

                {practiceView === "exercises" && hasExercises && (
                  <>
                    <div className="ios-surface-muted rounded-lg px-4 py-3">
                      <p className="text-sm font-semibold">{exerciseTopic}</p>
                      <p className="mt-1 text-xs text-[color:var(--text-secondary)]">
                        {studentProfile?.practiceHint ||
                          "Practica una idea a la vez y usa las pistas solo cuando haga falta."}
                      </p>
                    </div>
                    {exercises.map((exercise, index) => (
                      <ExerciseCard
                        key={`${exerciseTopic}-${index}`}
                        ejercicio={exercise}
                        numero={index + 1}
                      />
                    ))}
                  </>
                )}

                {!hasExercises && !hasQuiz && (
                  <div className="rounded-lg border border-dashed border-[color:var(--line)] px-4 py-5 text-center">
                    <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
                      <Target className="h-5 w-5" />
                    </div>
                    <p className="mt-3 text-sm font-semibold">Practica compacta</p>
                    <p className="mt-1 text-xs leading-5 text-[color:var(--text-secondary)]">
                      Genera ejercicios o un quiz del tema actual y se abriran aqui.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {subjectTopics.map((topic) => {
                  const status = getTopicStatus(subject, topic);
                  const isActive = topic === activeTopic;

                  return (
                    <div
                      key={topic}
                      className={`rounded-lg border px-3 py-3 ${
                        isActive
                          ? "border-transparent bg-[color:var(--accent-soft)]"
                          : "border-[color:var(--line)] bg-[color:var(--surface-elevated)]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">{topic}</p>
                          <span
                            className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              STATUS_BADGES[status]
                            }`}
                          >
                            {TOPIC_STATUS_LABELS[status]}
                          </span>
                        </div>

                        <select
                          value={status}
                          onChange={(e) => updateTopic(subject, topic, e.target.value)}
                          className="ios-input rounded-full px-3 py-2 text-xs"
                        >
                          {Object.entries(TOPIC_STATUS_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t border-[color:var(--line)] px-3 py-3">
            <div className="flex items-center gap-2 text-xs text-[color:var(--text-secondary)]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {topicStats.counts.dominado} de {topicStats.total} temas dominados.
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
