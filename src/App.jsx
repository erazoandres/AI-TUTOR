import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import Chat from "./components/Chat";
import ThemeSwitch from "./components/ThemeSwitch";
import { useProgress } from "./hooks/useProgress";
import { useTheme } from "./hooks/useTheme";
import { LEVELS, SUBJECTS } from "./utils/subjects";

const SESSION_STORAGE_KEY = "tutoria_session";
const DEFAULT_SESSION = {
  subject: SUBJECTS[0]?.name || "",
  level: LEVELS[0]?.name || "",
};

const SUBJECT_META = {
  matematicas: {
    categoryLabel: "Ciencias",
    summary: "Patrones, operaciones y pensamiento logico",
    activeBg: "from-sky-500/18 via-sky-500/10 to-transparent",
    activeRing: "ring-sky-300/60 dark:ring-sky-400/30",
    badge: "bg-sky-500/12 text-sky-700 dark:text-sky-200",
    bubble: "bg-sky-500/14 text-sky-700 dark:text-sky-200",
    bar: "bg-sky-500",
  },
  fisica: {
    categoryLabel: "Ciencias",
    summary: "Movimiento, energia y fenomenos",
    activeBg: "from-amber-500/18 via-amber-500/10 to-transparent",
    activeRing: "ring-amber-300/60 dark:ring-amber-400/30",
    badge: "bg-amber-500/14 text-amber-700 dark:text-amber-200",
    bubble: "bg-amber-500/16 text-amber-700 dark:text-amber-200",
    bar: "bg-amber-500",
  },
  quimica: {
    categoryLabel: "Ciencias",
    summary: "Materia, cambios y experimentos",
    activeBg: "from-emerald-500/18 via-emerald-500/10 to-transparent",
    activeRing: "ring-emerald-300/60 dark:ring-emerald-400/30",
    badge: "bg-emerald-500/14 text-emerald-700 dark:text-emerald-200",
    bubble: "bg-emerald-500/16 text-emerald-700 dark:text-emerald-200",
    bar: "bg-emerald-500",
  },
  biologia: {
    categoryLabel: "Ciencias",
    summary: "Vida, cuerpo y naturaleza",
    activeBg: "from-pink-500/18 via-pink-500/10 to-transparent",
    activeRing: "ring-pink-300/60 dark:ring-pink-400/30",
    badge: "bg-pink-500/14 text-pink-700 dark:text-pink-200",
    bubble: "bg-pink-500/16 text-pink-700 dark:text-pink-200",
    bar: "bg-pink-500",
  },
  historia: {
    categoryLabel: "Humanas",
    summary: "Procesos, epocas y contexto",
    activeBg: "from-violet-500/18 via-violet-500/10 to-transparent",
    activeRing: "ring-violet-300/60 dark:ring-violet-400/30",
    badge: "bg-violet-500/14 text-violet-700 dark:text-violet-200",
    bubble: "bg-violet-500/16 text-violet-700 dark:text-violet-200",
    bar: "bg-violet-500",
  },
  lengua: {
    categoryLabel: "Humanas",
    summary: "Lectura, escritura y expresion",
    activeBg: "from-rose-500/18 via-rose-500/10 to-transparent",
    activeRing: "ring-rose-300/60 dark:ring-rose-400/30",
    badge: "bg-rose-500/14 text-rose-700 dark:text-rose-200",
    bubble: "bg-rose-500/16 text-rose-700 dark:text-rose-200",
    bar: "bg-rose-500",
  },
  programacion: {
    categoryLabel: "Tech",
    summary: "Logica, web y algoritmos",
    activeBg: "from-cyan-500/18 via-cyan-500/10 to-transparent",
    activeRing: "ring-cyan-300/60 dark:ring-cyan-400/30",
    badge: "bg-cyan-500/14 text-cyan-700 dark:text-cyan-200",
    bubble: "bg-cyan-500/16 text-cyan-700 dark:text-cyan-200",
    bar: "bg-cyan-500",
  },
};

const LEVEL_META = {
  basico: {
    label: "Paso a paso",
    summary: "Vamos suave, con ideas simples y ejemplos faciles de seguir.",
    support: "Ideal si acabas de ver el tema o quieres ganar confianza.",
    chips: ["Explicaciones cortas", "Ejemplos guiados", "Sin prisa"],
    activeBg: "from-sky-500/18 via-sky-500/10 to-transparent",
    activeRing: "ring-sky-300/60 dark:ring-sky-400/30",
    badge: "bg-sky-500/12 text-sky-700 dark:text-sky-200",
    bubble: "bg-sky-500/14 text-sky-700 dark:text-sky-200",
    bar: "bg-sky-500",
  },
  intermedio: {
    label: "Conectar ideas",
    summary: "Juntamos concepto y practica para que el tema empiece a tener sentido.",
    support: "Sirve cuando ya reconoces el tema y quieres usarlo mejor.",
    chips: ["Mas contexto", "Practica breve", "Menos memoria"],
    activeBg: "from-emerald-500/18 via-emerald-500/10 to-transparent",
    activeRing: "ring-emerald-300/60 dark:ring-emerald-400/30",
    badge: "bg-emerald-500/14 text-emerald-700 dark:text-emerald-200",
    bubble: "bg-emerald-500/16 text-emerald-700 dark:text-emerald-200",
    bar: "bg-emerald-500",
  },
  avanzado: {
    label: "Ir mas lejos",
    summary: "Entramos a los porques, errores finos y retos un poco mas fuertes.",
    support: "Perfecto si quieres profundizar y defender mejor tus respuestas.",
    chips: ["Mas detalle", "Retos cortos", "Mejor criterio"],
    activeBg: "from-rose-500/18 via-rose-500/10 to-transparent",
    activeRing: "ring-rose-300/60 dark:ring-rose-400/30",
    badge: "bg-rose-500/14 text-rose-700 dark:text-rose-200",
    bubble: "bg-rose-500/16 text-rose-700 dark:text-rose-200",
    bar: "bg-rose-500",
  },
};

function readStoredSession() {
  if (typeof window === "undefined") {
    return DEFAULT_SESSION;
  }

  try {
    const stored = window.localStorage.getItem(SESSION_STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_SESSION;
  } catch {
    return DEFAULT_SESSION;
  }
}

export default function App() {
  const [session, setSession] = useState(readStoredSession);
  const { isDark, toggleTheme } = useTheme();
  const { progress } = useProgress();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  const subjectCards = useMemo(() => {
    return SUBJECTS.map((subject) => {
      const meta = SUBJECT_META[subject.id] || SUBJECT_META.matematicas;
      const topicStates = subject.topics.map(
        (topic) => progress[subject.name]?.[topic]?.status || "pendiente"
      );
      const masteredCount = topicStates.filter((status) => status === "dominado").length;
      const activeCount = topicStates.filter((status) => status !== "pendiente").length;
      const mastery = Math.round((masteredCount / subject.topics.length) * 100);

      return {
        ...subject,
        meta,
        masteredCount,
        activeCount,
        mastery,
      };
    });
  }, [progress]);

  const activeSubjectIndex = Math.max(
    subjectCards.findIndex((subject) => subject.name === session.subject),
    0
  );
  const activeSubject = subjectCards[activeSubjectIndex] || subjectCards[0];

  const activeLevelIndex = Math.max(
    LEVELS.findIndex((level) => level.name === session.level),
    0
  );
  const activeLevel = LEVELS[activeLevelIndex] || LEVELS[0];

  const changeSubjectByIndex = (nextIndex) => {
    const total = subjectCards.length;
    if (total === 0) {
      return;
    }

    const normalizedIndex = ((nextIndex % total) + total) % total;
    setSession((current) => ({
      ...current,
      subject: subjectCards[normalizedIndex].name,
    }));
  };

  const changeLevelByIndex = (nextIndex) => {
    const total = LEVELS.length;
    if (total === 0) {
      return;
    }

    const normalizedIndex = ((nextIndex % total) + total) % total;
    setSession((current) => ({
      ...current,
      level: LEVELS[normalizedIndex].name,
    }));
  };

  return (
    <div className="h-[100dvh] overflow-hidden text-[color:var(--text-primary)]">
      <div className="mx-auto grid h-full max-w-[1600px] gap-4 px-4 py-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="ios-surface flex min-h-0 flex-col overflow-hidden rounded-lg px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ios-chip">
                <GraduationCap className="h-3.5 w-3.5" />
                TutorIA
              </div>
              <h1 className="mt-3 text-xl font-bold">Panel de estudio</h1>
              <p className="mt-1 text-sm leading-6 text-[color:var(--text-secondary)]">
                Todas las materias siguen aqui, pero ahora viven en una biblioteca deslizante.
              </p>
            </div>

            <ThemeSwitch checked={isDark} onToggle={toggleTheme} />
          </div>

          <div className="mt-4 flex min-h-0 flex-1 flex-col gap-4">
            <section className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-elevated)] px-3 py-3">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <LayoutGrid className="h-4 w-4 text-[color:var(--accent)]" />
                    Materias
                  </div>
                  <p className="mt-1 text-xs text-[color:var(--text-secondary)]">
                    {activeSubjectIndex + 1} de {subjectCards.length}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => changeSubjectByIndex(activeSubjectIndex - 1)}
                    className="ios-surface-muted inline-flex h-9 w-9 items-center justify-center rounded-full text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => changeSubjectByIndex(activeSubjectIndex + 1)}
                    className="ios-surface-muted inline-flex h-9 w-9 items-center justify-center rounded-full text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-[24px]">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${activeSubjectIndex * 100}%)` }}
                >
                  {subjectCards.map((subject) => (
                    <article
                      key={subject.id}
                      className={`min-w-full rounded-[24px] bg-gradient-to-br ${subject.meta.activeBg} px-4 py-4 ring-1 ${subject.meta.activeRing}`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl ${subject.meta.bubble}`}
                        >
                          {subject.emoji}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${subject.meta.badge}`}
                            >
                              {subject.meta.categoryLabel}
                            </span>
                            <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold ios-chip">
                              Nivel {session.level}
                            </span>
                          </div>
                          <p className="mt-2 text-lg font-semibold">{subject.name}</p>
                          <p className="mt-1 text-xs leading-5 text-[color:var(--text-secondary)]">
                            {subject.meta.summary}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="rounded-2xl bg-white/70 px-3 py-3 dark:bg-slate-950/35">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
                            Dominio
                          </p>
                          <p className="mt-1 text-xl font-bold">{subject.mastery}%</p>
                        </div>
                        <div className="rounded-2xl bg-white/70 px-3 py-3 dark:bg-slate-950/35">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
                            Activos
                          </p>
                          <p className="mt-1 text-xl font-bold">
                            {subject.activeCount}/{subject.topics.length}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
                          <span>Progreso</span>
                          <span>
                            {subject.masteredCount}/{subject.topics.length}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/40 dark:bg-slate-900/40">
                          <div
                            className={`h-full rounded-full ${subject.meta.bar}`}
                            style={{
                              width: `${Math.max(
                                subject.mastery,
                                subject.activeCount > 0 ? 14 : 8
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {subject.topics.slice(0, 3).map((topic) => (
                          <span
                            key={topic}
                            className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-medium text-[color:var(--text-primary)] dark:bg-slate-900/60"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex justify-center gap-1.5">
                {subjectCards.map((subject, index) => (
                  <button
                    key={`dot-${subject.id}`}
                    type="button"
                    onClick={() => changeSubjectByIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === activeSubjectIndex
                        ? `w-8 ${subject.meta.bar}`
                        : "w-2 bg-[color:var(--line)]"
                    }`}
                    aria-label={subject.name}
                  />
                ))}
              </div>
            </section>

            <section className="min-h-0 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-elevated)] px-3 py-3">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-[color:var(--accent)]" />
                Acceso rapido
              </div>

              <div className="no-scrollbar overflow-x-auto pb-1">
                <div className="flex gap-2">
                  {subjectCards.map((subject, index) => {
                    const isActive = index === activeSubjectIndex;

                    return (
                      <button
                        key={subject.id}
                        type="button"
                        onClick={() => changeSubjectByIndex(index)}
                        className={`w-[108px] shrink-0 rounded-2xl border px-3 py-3 text-left transition ${
                          isActive
                            ? `border-transparent bg-gradient-to-br ${subject.meta.activeBg} ring-1 ${subject.meta.activeRing}`
                            : "border-[color:var(--line)] bg-[color:var(--surface-strong)] hover:bg-[color:var(--surface-muted)]"
                        }`}
                      >
                        <div
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl text-lg ${subject.meta.bubble}`}
                        >
                          {subject.emoji}
                        </div>
                        <p className="mt-2 text-xs font-semibold leading-5">{subject.name}</p>
                        <p className="mt-1 text-[11px] text-[color:var(--text-secondary)]">
                          {subject.meta.categoryLabel}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-elevated)] px-3 py-3">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Sparkles className="h-4 w-4 text-[color:var(--accent)]" />
                    Ritmo
                  </div>
                  <p className="mt-1 text-xs text-[color:var(--text-secondary)]">
                    {activeLevelIndex + 1} de {LEVELS.length}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => changeLevelByIndex(activeLevelIndex - 1)}
                    className="ios-surface-muted inline-flex h-9 w-9 items-center justify-center rounded-full text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => changeLevelByIndex(activeLevelIndex + 1)}
                    className="ios-surface-muted inline-flex h-9 w-9 items-center justify-center rounded-full text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-[22px]">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${activeLevelIndex * 100}%)` }}
                >
                  {LEVELS.map((level) => {
                    const meta = LEVEL_META[level.id] || LEVEL_META.basico;

                    return (
                      <article
                        key={level.id}
                        className={`min-w-full rounded-[22px] bg-gradient-to-br ${meta.activeBg} px-4 py-4 ring-1 ${meta.activeRing}`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${meta.bubble}`}
                          >
                            <Sparkles className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.badge}`}
                              >
                                {meta.label}
                              </span>
                              <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold ios-chip">
                                {level.name}
                              </span>
                            </div>
                            <p className="mt-2 text-sm font-semibold">{meta.summary}</p>
                            <p className="mt-1 text-xs leading-5 text-[color:var(--text-secondary)]">
                              {meta.support}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {meta.chips.map((chip) => (
                            <span
                              key={chip}
                              className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-medium text-[color:var(--text-primary)] dark:bg-slate-900/60"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 flex justify-center gap-1.5">
                {LEVELS.map((level, index) => {
                  const meta = LEVEL_META[level.id] || LEVEL_META.basico;

                  return (
                    <button
                      key={`level-dot-${level.id}`}
                      type="button"
                      onClick={() => changeLevelByIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === activeLevelIndex
                          ? `w-8 ${meta.bar}`
                          : "w-2 bg-[color:var(--line)]"
                      }`}
                      aria-label={level.name}
                    />
                  );
                })}
              </div>

              <div className="mt-3 no-scrollbar overflow-x-auto pb-1">
                <div className="flex gap-2">
                  {LEVELS.map((level, index) => {
                    const meta = LEVEL_META[level.id] || LEVEL_META.basico;
                    const isActive = index === activeLevelIndex;

                    return (
                      <button
                        key={level.id}
                        type="button"
                        onClick={() => changeLevelByIndex(index)}
                        className={`w-[112px] shrink-0 rounded-2xl border px-3 py-3 text-left transition ${
                          isActive
                            ? `border-transparent bg-gradient-to-br ${meta.activeBg} ring-1 ${meta.activeRing}`
                            : "border-[color:var(--line)] bg-[color:var(--surface-strong)] hover:bg-[color:var(--surface-muted)]"
                        }`}
                      >
                        <div
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-2xl ${meta.bubble}`}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                        </div>
                        <p className="mt-2 text-xs font-semibold">{level.name}</p>
                        <p className="mt-1 text-[11px] text-[color:var(--text-secondary)]">
                          {meta.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        </aside>

        <main className="min-h-0">
          <Chat
            key={`${session.subject}-${session.level}`}
            subject={session.subject}
            level={session.level}
          />
        </main>
      </div>
    </div>
  );
}
