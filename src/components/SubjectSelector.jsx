import { Brain, Sparkles, Stars } from "lucide-react";
import { LEVELS, SUBJECTS } from "../utils/subjects";

const SUBJECT_ACCENTS = {
  matematicas: "bg-sky-500",
  fisica: "bg-amber-500",
  quimica: "bg-emerald-500",
  biologia: "bg-pink-500",
  historia: "bg-violet-500",
  lengua: "bg-rose-500",
  programacion: "bg-cyan-500",
};

const LEVEL_ICONS = {
  Básico: Sparkles,
  Intermedio: Brain,
  Avanzado: Stars,
};

export default function SubjectSelector({ onStart }) {
  const handleSelect = (subject, level) => {
    onStart({ subject, level });
  };

  return (
    <div className="space-y-5">
      <section className="ios-surface rounded-lg px-5 py-6">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ios-chip">
          <Sparkles className="h-4 w-4" />
          Elige tu misión
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold sm:text-3xl">¿Qué quieres aprender hoy?</h2>
          <p className="max-w-2xl text-sm leading-6 text-[color:var(--text-secondary)] sm:text-base">
            Toca una materia, elige tu ritmo y empieza a preguntar con tus propias palabras.
          </p>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {SUBJECTS.map((subject) => (
          <section key={subject.id} className="ios-surface overflow-hidden rounded-lg">
            <div className={`h-1.5 w-full ${SUBJECT_ACCENTS[subject.id] || "bg-blue-500"}`} />
            <div className="space-y-4 px-5 py-5">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{subject.emoji}</span>
                  <div>
                    <h3 className="text-lg font-semibold">{subject.name}</h3>
                    <p className="text-sm text-[color:var(--text-secondary)]">
                      Temas favoritos para empezar
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {subject.topics.slice(0, 3).map((topic) => (
                    <span key={topic} className="rounded-full px-3 py-1 text-xs ios-chip">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {LEVELS.map((level) => {
                  const Icon = LEVEL_ICONS[level.name] || Brain;

                  return (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => handleSelect(subject.name, level.name)}
                      className="ios-surface-muted flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition hover:translate-y-[-1px]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block font-semibold">{level.name}</span>
                          <span className="block text-xs text-[color:var(--text-secondary)]">
                            {level.description}
                          </span>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
