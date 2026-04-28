import { useEffect, useMemo, useRef, useState } from "react";
import ChatConversation from "./chat/ChatConversation";
import ChatHeader from "./chat/ChatHeader";
import PracticeWorkspace from "./chat/PracticeWorkspace";
import TopicsWorkspace from "./chat/TopicsWorkspace";
import ProgressMap from "./ProgressMap";
import { useGroqAPI } from "../hooks/useGroqAPI";
import { useProgress } from "../hooks/useProgress";
import { extractIdeaContext, extractTurnPrompt } from "../utils/chatTurnContext";
import { findTopicMatch, getSubjectByName } from "../utils/subjects";

const CHAT_STORAGE_PREFIX = "tutoria_chat";

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
  const [workspaceView, setWorkspaceView] = useState("chat");
  const [practiceView, setPracticeView] = useState(
    storedState.quiz?.length ? "quiz" : "exercises"
  );
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(() => storedState.messages.length === 0);
  const [turnReplyMode, setTurnReplyMode] = useState("review");

  const scrollRef = useRef(null);
  const lastAssistantRef = useRef(null);
  const subjectMeta = useMemo(() => getSubjectByName(subject, grade), [grade, subject]);
  const subjectTopics = subjectMeta?.topics || [];
  const gradeLabel = studentProfile?.grade?.longLabel || "este grado";
  const modeName = studentProfile?.mode?.name || "Facil";
  const modeSummary = studentProfile?.mode?.summary || "";
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
  const latestAssistantMessage = [...messages].reverse().find((message) => message.role === "assistant");
  const latestTurnPrompt = extractTurnPrompt(latestAssistantMessage?.content || "");
  const latestIdeaContext = extractIdeaContext(latestAssistantMessage?.content || "");
  const currentTopicStatus = activeTopic ? getTopicStatus(subject, activeTopic) : "pendiente";
  const lastAssistantIndex = [...messages]
    .map((message, index) => (message.role === "assistant" ? index : -1))
    .filter((index) => index >= 0)
    .pop();
  const isEasyMode = mode === "easy";
  const isMediumMode = mode === "medium";

  const quickPrompts = useMemo(() => {
    const focus = activeTopic || subject;

    return [
      {
        label: "Explicamelo",
        userFacingContent: "Explicamelo",
        requestContent: `Explicame ${focus} para ${gradeLabel} en modo ${modeName.toLowerCase()}.`,
      },
      {
        label: "Ejemplo",
        userFacingContent: "Ejemplo",
        requestContent: `Dame un ejemplo corto de ${focus} para ${gradeLabel}.`,
      },
      {
        label: isEasyMode ? "Pregunta" : isMediumMode ? "Aplicacion" : "Reto",
        userFacingContent: isEasyMode ? "Pregunta" : isMediumMode ? "Aplicacion" : "Reto",
        requestContent:
          isEasyMode
            ? `Hazme una pregunta facil de ${focus}.`
            : isMediumMode
              ? `Hazme una pregunta de aplicacion simple sobre ${focus}.`
              : `Hazme una pregunta retadora y un poco mas profunda sobre ${focus}.`,
      },
    ];
  }, [activeTopic, gradeLabel, isEasyMode, isMediumMode, modeName, subject]);

  const followUpActions = useMemo(() => {
    const focus = activeTopic || subject;
    const sameThemeContext = latestTurnPrompt
      ? `Mantente en la misma idea de esta pregunta del tutor: "${latestTurnPrompt}".`
      : latestIdeaContext
        ? `Mantente en esta misma idea: "${latestIdeaContext}".`
        : `Mantente en el tema ${focus}.`;

    return [
      {
        label: isEasyMode ? "Mas simple" : isMediumMode ? "Mas claro" : "Mas breve",
        userFacingContent: isEasyMode ? "Mas simple" : isMediumMode ? "Mas claro" : "Mas breve",
        requestContent: `Explicamelo mejor para ${gradeLabel}, sobre ${focus}, con lenguaje mas simple. ${sameThemeContext} Ayudame a responder sin cambiar de tema.`,
      },
      {
        label: "Otro ejemplo",
        userFacingContent: "Otro ejemplo",
        requestContent: `Dame otro ejemplo corto de ${focus} para ${gradeLabel}. ${sameThemeContext}`,
      },
      {
        label: isEasyMode ? "Mini reto" : isMediumMode ? "Conecta ideas" : "Sube reto",
        userFacingContent: isEasyMode ? "Mini reto" : isMediumMode ? "Conecta ideas" : "Sube reto",
        requestContent:
          isEasyMode
            ? `Ponme un mini reto de una sola pregunta sobre ${focus} para ${gradeLabel}. ${sameThemeContext}`
            : isMediumMode
              ? `Hazme conectar ${focus} con un ejemplo y una razon breve para ${gradeLabel}. ${sameThemeContext}`
              : `Ponme una sola pregunta un poco mas dificil sobre ${focus} para ${gradeLabel}. ${sameThemeContext}`,
      },
    ];
  }, [activeTopic, gradeLabel, isEasyMode, isMediumMode, latestIdeaContext, latestTurnPrompt, subject]);

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
    const latestMessage = messages[messages.length - 1];
    if (!latestMessage) {
      return;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (latestMessage.role === "assistant" && lastAssistantRef.current) {
      lastAssistantRef.current.scrollIntoView({
        block: "start",
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  }, [messages]);

  const markTopicAsSeen = (topicName) => {
    if (topicName && getTopicStatus(subject, topicName) === "pendiente") {
      updateTopic(subject, topicName, "visto");
    }
  };

  const handleSend = async (customInput) => {
    const usesStructuredInput = customInput && typeof customInput === "object";
    const payload =
      typeof customInput === "string"
        ? {
            userFacingContent: customInput,
            requestContent: customInput,
          }
        : customInput && typeof customInput === "object"
          ? {
              userFacingContent: customInput.userFacingContent ?? customInput.requestContent ?? "",
              requestContent: customInput.requestContent ?? customInput.userFacingContent ?? "",
            }
          : {
              userFacingContent: input,
              requestContent: input,
            };

    const userFacingContent = String(payload.userFacingContent || "").trim();
    const requestContent = String(payload.requestContent || "").trim();

    if (!userFacingContent || !requestContent || loading) {
      return;
    }

    const toneInstruction =
      turnReplyMode === "guided"
        ? "Si mi respuesta esta incompleta o tiene un error, corrigeme paso a paso y dame una pista antes de la respuesta final."
        : "Dime si mi respuesta esta bien, si esta cerca o si tiene un error, y explicame por que de forma breve.";
    const contextInstruction = latestIdeaContext
      ? `La idea central actual es: "${latestIdeaContext}".`
      : "";
    const finalRequestContent =
      !usesStructuredInput && latestTurnPrompt
        ? `Estoy respondiendo a tu "Tu turno". La pregunta fue: "${latestTurnPrompt}". ${contextInstruction} Mi respuesta es: "${requestContent}". ${toneInstruction} Mantente en este mismo tema para ${gradeLabel} y en modo ${modeName}.`
        : requestContent;

    const detectedTopic = findTopicMatch(subject, finalRequestContent, grade);
    const topicForTurn = selectedTopic || detectedTopic || activeTopic;
    const userMessage = { role: "user", content: userFacingContent };
    const requestMessage = { role: "user", content: finalRequestContent };
    const renderedMessages = [...messages, userMessage];
    const requestMessages = [...messages, requestMessage];

    setWorkspaceView("chat");
    setMessages(renderedMessages);
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
      messages: requestMessages,
      subject,
      grade,
      mode,
      topic: topicForTurn,
      studentProfile,
    });

    if (response) {
      setMessages([...renderedMessages, { role: "assistant", content: response }]);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
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
    setWorkspaceView("practice");
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
    setWorkspaceView("practice");
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
    setWorkspaceView("chat");
    setPracticeView("exercises");
    setIsHeaderExpanded(true);
    setTurnReplyMode("review");
    clearError();
  };

  const handleRequestHint = () => {
    if (!latestTurnPrompt) {
      return;
    }

    const contextInstruction = latestIdeaContext
      ? `La idea central actual es: "${latestIdeaContext}".`
      : "";

    handleSend({
      userFacingContent: "Necesito una pista",
      requestContent: `Sin cambiar de tema, dame una pista breve para responder esta pregunta del tutor: "${latestTurnPrompt}". ${contextInstruction} No me des toda la solucion de una vez.`,
    });
  };

  const hasExercises = exercises.length > 0;
  const hasQuiz = quiz.length > 0;
  const hasStartedConversation = messages.length > 0;
  // Condensa el header también cuando se está en la vista de práctica
  const isHeaderCondensed = workspaceView === "practice" || (hasStartedConversation && !isHeaderExpanded);

  useEffect(() => {
    if (messages.length === 1) {
      setIsHeaderExpanded(false);
    }
  }, [messages.length]);

  return (
    <div className="ios-surface animate-fade-up flex h-full min-h-0 flex-col overflow-hidden rounded-2xl">
      <ChatHeader
        subject={subject}
        gradeLabel={gradeLabel}
        modeName={modeName}
        activeTopic={activeTopic}
        currentTopicStatus={currentTopicStatus}
        workspaceView={workspaceView}
        notice={notice}
        error={error}
        hasApiKey={hasApiKey}
        model={model}
        isCondensed={isHeaderCondensed}
        canToggleOverview={hasStartedConversation}
        isOverviewExpanded={isHeaderExpanded}
        onToggleOverview={() => setIsHeaderExpanded((current) => !current)}
        onOpenTopics={() => setWorkspaceView("topics")}
        onReset={handleResetWorkspace}
        onBackToSetup={onBackToSetup}
        onWorkspaceViewChange={setWorkspaceView}
      />

      <div className="min-h-0 flex-1 px-2 py-2 sm:px-3 sm:py-3">
        {workspaceView === "chat" && (
          <ChatConversation
            messages={messages}
            loading={loading}
            input={input}
            activeTopic={activeTopic}
            subject={subject}
            modeSummary={modeSummary}
            quickPrompts={quickPrompts}
            followUpActions={followUpActions}
            lastAssistantIndex={lastAssistantIndex}
            scrollRef={scrollRef}
            lastAssistantRef={lastAssistantRef}
            turnPrompt={latestTurnPrompt}
            turnReplyMode={turnReplyMode}
            onTurnReplyModeChange={setTurnReplyMode}
            onRequestHint={handleRequestHint}
            onInputChange={setInput}
            onKeyDown={handleKeyDown}
            onSend={handleSend}
          />
        )}

        {workspaceView === "practice" && (
          <PracticeWorkspace
            activeTopic={activeTopic}
            loading={loading}
            hasExercises={hasExercises}
            hasQuiz={hasQuiz}
            practiceView={practiceView}
            exercises={exercises}
            exerciseTopic={exerciseTopic}
            quiz={quiz}
            quizTopic={quizTopic}
            quizProgress={quizProgress}
            studentProfile={studentProfile}
            onGenerateExercises={handleGenerateExercises}
            onGenerateQuiz={handleGenerateQuiz}
            onPracticeViewChange={setPracticeView}
            onQuizAnswer={handleQuizAnswer}
          />
        )}

        {workspaceView === "topics" && (
          <TopicsWorkspace
            subject={subject}
            subjectTopics={subjectTopics}
            activeTopic={activeTopic}
            currentTopicStatus={currentTopicStatus}
            getTopicStatus={getTopicStatus}
            onTopicSelect={handleTopicSelect}
            onUpdateTopic={updateTopic}
          />
        )}

        {workspaceView === "progress" && (
          <div className="h-full min-h-0 overflow-y-auto pr-1">
            <ProgressMap />
          </div>
        )}
      </div>
    </div>
  );
}
