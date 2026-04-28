import { BookOpen, HelpCircle, Target } from "lucide-react";
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
  return (
    <section className="flex h-full min-h-0 flex-col gap-3" aria-label="Practica">
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={onGenerateExercises}
          disabled={loading}
          className="ios-surface-muted rounded-[22px] px-4 py-4 text-left transition hover:scale-[1.01] disabled:opacity-55"
        >
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
          </div>
          <p className="mt-3 text-sm font-semibold">Ejercicios</p>
          <p className="mt-1 min-h-4 truncate text-xs text-[color:var(--text-secondary)]">
            {activeTopic}
          </p>
        </button>

        <button
          type="button"
          onClick={onGenerateQuiz}
          disabled={loading}
          className="ios-surface-muted rounded-[22px] px-4 py-4 text-left transition hover:scale-[1.01] disabled:opacity-55"
        >
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
          </div>
          <p className="mt-3 text-sm font-semibold">Quiz</p>
          <p className="mt-1 min-h-4 truncate text-xs text-[color:var(--text-secondary)]">
            {activeTopic}
          </p>
        </button>
      </div>

      {(hasExercises || hasQuiz) && (
        <div
          className="ios-segmented grid w-full max-w-[280px] grid-cols-2 rounded-full p-1"
          role="tablist"
          aria-label="Tipo de practica"
        >
          <button
            type="button"
            role="tab"
            aria-selected={practiceView === "exercises"}
            onClick={() => onPracticeViewChange("exercises")}
            className={cx(
              "ios-segmented-button px-3 py-2 text-xs font-semibold",
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
              "ios-segmented-button px-3 py-2 text-xs font-semibold",
              practiceView === "quiz" && "is-active"
            )}
          >
            Quiz
          </button>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-3 pr-1">
          {!hasExercises && !hasQuiz && (
            <div className="flex h-full min-h-[280px] items-center justify-center rounded-[24px] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-elevated)] px-6 py-6 text-center">
              <div>
                <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
                  <Target className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="mt-3 text-sm font-semibold">Vamos a practicar</p>
                <p className="mt-1 text-xs leading-5 text-[color:var(--text-secondary)]">
                  Toca Ejercicios o Quiz.
                </p>
              </div>
            </div>
          )}

          {practiceView === "quiz" && hasQuiz && (
            <>
              <div className="ios-surface-muted rounded-[22px] px-4 py-3">
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
                  onAnswer={onQuizAnswer}
                />
              ))}
            </>
          )}

          {practiceView === "exercises" && hasExercises && (
            <>
              <div className="ios-surface-muted rounded-[22px] px-4 py-3">
                <p className="text-sm font-semibold">{exerciseTopic}</p>
                <p className="mt-1 text-xs text-[color:var(--text-secondary)]">
                  {studentProfile?.practiceHint || "Primero entender, luego practicar."}
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
        </div>
      </div>
    </section>
  );
}
