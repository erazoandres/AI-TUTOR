import { useMemo, useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  EyeOff,
  HelpCircle,
  PanelRight,
  Sparkles,
  Target,
} from "lucide-react";
import ExerciseCard from "../ExerciseCard";
import QuizCard from "../QuizCard";
import { cx } from "../../utils/classNames";

export default function PracticeWorkspace({
  activeTopic,
  loading,
  hasExercises,
  hasQuiz,
  practiceView,
  exercises,
  exerciseTopic,
  quiz,
  quizTopic,
  quizProgress,
  studentProfile,
  onGenerateExercises,
  onGenerateQuiz,
  onPracticeViewChange,
  onQuizAnswer,
}) {
  const [showContextRail, setShowContextRail] = useState(true);
  const totalQuizQuestions = quiz.length;
  const completedQuiz = totalQuizQuestions > 0 && quizProgress.answered === totalQuizQuestions;
  const activeSummary = useMemo(() => {
    if (practiceView === "quiz" && hasQuiz) {
      return {
        eyebrow: "Modo evaluacion",
        title: quizTopic || activeTopic,
        description: completedQuiz
          ? "Resultado final disponible. Puedes revisar respuestas o cambiar de modo."
          : "Responde con calma y deja que el progreso marque el ritmo.",
        statA: `${quizProgress.correct}/${Math.max(quizProgress.answered, 0)}`,
        labelA: "correctas",
        statB: `${totalQuizQuestions}`,
        labelB: "preguntas",
      };
    }

    if (practiceView === "exercises" && hasExercises) {
      return {
        eyebrow: "Modo practica",
        title: exerciseTopic || activeTopic,
        description:
          studentProfile?.practiceHint || "Trabaja primero el razonamiento y luego valida con la respuesta.",
        statA: `${exercises.length}`,
        labelA: "ejercicios",
        statB: hintsSummary(exercises),
        labelB: "pistas",
      };
    }

    return {
      eyebrow: "Espacio adaptable",
      title: activeTopic || "Practica guiada",
      description: "Genera ejercicios o quiz y el panel se reorganiza para darle prioridad al contenido.",
      statA: "2",
      labelA: "modos",
      statB: "1",
      labelB: "foco",
    };
  }, [
    activeTopic,
    completedQuiz,
    exerciseTopic,
    exercises,
    hasExercises,
    hasQuiz,
    practiceView,
    quizProgress.answered,
    quizProgress.correct,
    quizTopic,
    studentProfile?.practiceHint,
    totalQuizQuestions,
  ]);

  return (
    <section className="flex h-full min-h-0 flex-col gap-3" aria-label="Practica">
      <div className="ios-surface grid gap-3 rounded-2xl px-3 py-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="grid gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {!(hasExercises || hasQuiz) && (
              <>
                <button
                  type="button"
                  onClick={onGenerateExercises}
                  disabled={loading}
                  className={cx(
                    "practice-mode-button",
                    practiceView === "exercises" && hasExercises && "is-active"
                  )}
                >
                  <span className="primary-action inline-flex h-9 w-9 items-center justify-center rounded-full">
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold">Ejercicios</span>
                    <span className="block truncate text-[11px] text-[color:var(--text-secondary)]">
                      practica guiada
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onGenerateQuiz}
                  disabled={loading}
                  className={cx(
                    "practice-mode-button",
                    practiceView === "quiz" && hasQuiz && "is-active"
                  )}
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--danger-soft)] text-[color:var(--color-coral)]">
                    <HelpCircle className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold">Quiz</span>
                    <span className="block truncate text-[11px] text-[color:var(--text-secondary)]">
                      evaluacion rapida
                    </span>
                  </span>
                </button>
              </>
            )}

            {(hasExercises || hasQuiz) && (
              <div
                className="ios-segmented grid min-w-[220px] grid-cols-2 rounded-full p-1"
                role="tablist"
                aria-label="Tipo de practica"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={practiceView === "exercises"}
                  onClick={() => onPracticeViewChange("exercises")}
                  className={cx(
                    "ios-segmented-button px-3 py-2 text-xs font-bold",
                    practiceView === "exercises" && "is-active"
                  )}
                >
                  Ejercicios
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={practiceView === "quiz"}
                  onClick={() => onPracticeViewChange("quiz")}
                  className={cx(
                    "ios-segmented-button px-3 py-2 text-xs font-bold",
                    practiceView === "quiz" && "is-active"
                  )}
                >
                  Quiz
                </button>
              </div>
            )}
          </div>

          <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-elevated)] px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold ios-chip">
                  <Sparkles className="h-3.5 w-3.5 text-[color:var(--accent-strong)]" aria-hidden="true" />
                  {activeSummary.eyebrow}
                </span>
                <span className="rounded-full bg-[color:var(--accent-soft)] px-3 py-1 text-[11px] font-bold text-[color:var(--accent-strong)]">
                  {practiceView === "quiz" ? "medir" : "resolver"}
                </span>
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
                <div>
                  <h3 className="display-font text-[1.4rem] font-extrabold leading-tight">
                    {activeSummary.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[color:var(--text-secondary)]">
                    {activeSummary.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-[color:var(--surface-strong)] px-3 py-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
                      {activeSummary.labelA}
                    </p>
                    <p className="mt-1 text-xl font-extrabold">{activeSummary.statA}</p>
                  </div>
                  <div className="rounded-xl bg-[color:var(--surface-strong)] px-3 py-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
                      {activeSummary.labelB}
                    </p>
                    <p className="mt-1 text-xl font-extrabold">{activeSummary.statB}</p>
                  </div>
                </div>
              </div>
            </div>

            {(hasExercises || hasQuiz) && (
              <button
                type="button"
                aria-pressed={showContextRail}
                onClick={() => setShowContextRail((current) => !current)}
                className="ios-surface-muted control-button inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition"
              >
                {showContextRail ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <PanelRight className="h-4 w-4" aria-hidden="true" />
                )}
                {showContextRail ? "Ocultar resumen" : "Mostrar resumen"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div
        className={cx(
          "min-h-0 flex-1 gap-3 lg:grid",
          showContextRail && (hasExercises || hasQuiz)
            ? "lg:grid-cols-[minmax(0,1fr)_300px]"
            : "lg:grid-cols-[minmax(0,1fr)]"
        )}
      >
        <div className="min-h-0 overflow-y-auto pr-1">
          <div className="space-y-3">
            {!hasExercises && !hasQuiz && (
              <div className="flex h-full min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-[color:var(--line)] bg-[color:var(--surface-elevated)] px-6 py-6 text-center">
                <div>
                  <div className="primary-action mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full">
                    <Target className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <p className="display-font mt-3 text-xl font-extrabold">Practica con foco</p>
                  <p className="mt-1 text-sm leading-6 text-[color:var(--text-secondary)]">
                    Genera ejercicios o quiz y la vista se adaptara al contenido importante.
                  </p>
                </div>
              </div>
            )}

            {practiceView === "quiz" && hasQuiz && (
              <>
                {quiz.map((question, index) => (
                  <QuizCard
                    key={`${quizTopic}-${index}`}
                    pregunta={question}
                    numero={index + 1}
                    total={quiz.length}
                    onAnswer={onQuizAnswer}
                  />
                ))}
              </>
            )}

            {practiceView === "exercises" && hasExercises && (
              <>
                {exercises.map((exercise, index) => (
                  <ExerciseCard
                    key={`${exerciseTopic}-${index}`}
                    ejercicio={exercise}
                    numero={index + 1}
                    total={exercises.length}
                  />
                ))}
              </>
            )}
          </div>
        </div>

        {showContextRail && (hasExercises || hasQuiz) && (
          <aside className="mt-3 min-h-0 lg:mt-0">
            <div className="ios-surface sticky top-0 rounded-2xl px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
                    Resumen activo
                  </p>
                  <p className="mt-1 text-base font-bold">{activeSummary.title}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowContextRail(false)}
                  className="ios-surface-muted control-button inline-flex h-9 w-9 items-center justify-center rounded-full"
                  aria-label="Ocultar resumen lateral"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-xl bg-[color:var(--surface-elevated)] px-3 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
                    Tema
                  </p>
                  <p className="mt-1 text-sm font-semibold">{practiceView === "quiz" ? quizTopic : exerciseTopic}</p>
                </div>

                <div className="rounded-xl bg-[color:var(--surface-elevated)] px-3 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
                    Enfoque
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[color:var(--text-secondary)]">
                    {practiceView === "quiz"
                      ? completedQuiz
                        ? "Ya tienes resultado. Revisa errores y vuelve a intentar si quieres subir precision."
                        : "Responde una a una. La explicacion aparece solo cuando ya sirve para aprender."
                      : "Las pistas y respuestas quedan ocultas hasta que realmente las necesites."}
                  </p>
                </div>

                <div className="rounded-xl bg-[color:var(--surface-elevated)] px-3 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
                    Accion rapida
                  </p>
                  <div className="mt-2 grid gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        practiceView === "quiz" ? onPracticeViewChange("exercises") : onPracticeViewChange("quiz")
                      }
                      className="ios-surface-muted control-button inline-flex items-center justify-between rounded-xl px-3 py-2 text-sm font-bold transition"
                    >
                      Cambiar a {practiceView === "quiz" ? "ejercicios" : "quiz"}
                      <ChevronLeft className="h-4 w-4 rotate-180" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}

function hintsSummary(exercises) {
  const totalHints = exercises.reduce((acc, exercise) => {
    return acc + (Array.isArray(exercise?.pistas) ? exercise.pistas.length : 0);
  }, 0);

  return `${totalHints}`;
}
