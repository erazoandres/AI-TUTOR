import { useEffect, useMemo, useRef, useState } from "react";
import ChatConversation from "./chat/ChatConversation";
import ChatHeader from "./chat/ChatHeader";
import PracticeWorkspace from "./chat/PracticeWorkspace";
import TopicsWorkspace from "./chat/TopicsWorkspace";
import { useGroqAPI } from "../hooks/useGroqAPI";
import { useProgress } from "../hooks/useProgress";
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

  const scrollRef = useRef(null);
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
  const currentTopicStatus = activeTopic ? getTopicStatus(subject, activeTopic) : "pendiente";
  const lastAssistantIndex = [...messages]
    .map((message, index) => (message.role === "assistant" ? index : -1))
    .filter((index) => index >= 0)
    .pop();

  const quickPrompts = useMemo(() => {
    const focus = activeTopic || subject;

    return [
      {
        label: "Explicamelo",
        prompt: `Explicame ${focus} para ${gradeLabel} en modo ${modeName.toLowerCase()}.`,
      },
      {
        label: "Ejemplo",
        prompt: `Dame un ejemplo corto de ${focus} para ${gradeLabel}.`,
      },
      {
        label: mode === "easy" ? "Pregunta" : "Reto",
        prompt:
          mode === "easy"
            ? `Hazme una pregunta facil de ${focus}.`
            : `Hazme una pregunta retadora de ${focus}.`,
      },
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

    setWorkspaceView("chat");
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
    clearError();
  };

  const hasExercises = exercises.length > 0;
  const hasQuiz = quiz.length > 0;

  return (
    <div className="ios-surface flex h-full min-h-0 flex-col overflow-hidden rounded-[28px]">
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
        onOpenTopics={() => setWorkspaceView("topics")}
        onReset={handleResetWorkspace}
        onBackToSetup={onBackToSetup}
        onWorkspaceViewChange={setWorkspaceView}
      />

      <div className="min-h-0 flex-1 px-4 py-4">
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
      </div>
    </div>
  );
}
