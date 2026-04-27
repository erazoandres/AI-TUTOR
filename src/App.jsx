import { useEffect, useMemo, useState } from "react";
import { BookOpen, GraduationCap, RefreshCcw, Sparkles, Target } from "lucide-react";
import Chat from "./components/Chat";
import SetupScreen from "./components/SetupScreen";
import ThemeSwitch from "./components/ThemeSwitch";
import { useProgress } from "./hooks/useProgress";
import { useTheme } from "./hooks/useTheme";
import { buildStudentProfile, getGradeById, getModeById, GRADES, MODES } from "./utils/studentProfile";
import { getTopicsForSubject, SUBJECTS } from "./utils/subjects";

const SESSION_STORAGE_KEY = "tutoria_session";
const DEFAULT_SESSION = {
  subject: SUBJECTS[0]?.name || "",
  grade: GRADES[0]?.id || "5",
  mode: MODES[0]?.id || "easy",
  ready: false,
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

function normalizeSession(storedValue) {
  const candidate = storedValue && typeof storedValue === "object" ? storedValue : {};
  const subjectExists = SUBJECTS.some((subject) => subject.name === candidate.subject);
  const grade = getGradeById(String(candidate.grade || ""))?.id || DEFAULT_SESSION.grade;
  const mode = getModeById(candidate.mode)?.id || DEFAULT_SESSION.mode;

  return {
    subject: subjectExists ? candidate.subject : DEFAULT_SESSION.subject,
    grade,
    mode,
    ready: Boolean(candidate.ready && subjectExists),
  };
}

function readStoredSession() {
  if (typeof window === "undefined") {
    return DEFAULT_SESSION;
  }

  try {
    const stored = window.localStorage.getItem(SESSION_STORAGE_KEY);
    return stored ? normalizeSession(JSON.parse(stored)) : DEFAULT_SESSION;
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
      const topics = getTopicsForSubject(subject.id, session.grade);
      const topicStates = topics.map(
        (topic) => progress[subject.name]?.[topic]?.status || "pendiente"
      );
      const masteredCount = topicStates.filter((status) => status === "dominado").length;
      const activeCount = topicStates.filter((status) => status !== "pendiente").length;
      const totalTopics = topics.length || 1;
      const mastery = Math.round((masteredCount / totalTopics) * 100);

      return {
        ...subject,
        topics,
        meta,
        masteredCount,
        activeCount,
        mastery,
      };
    });
  }, [progress, session.grade]);

  const selectedSubject =
    subjectCards.find((subject) => subject.name === session.subject) || subjectCards[0];
  const selectedGrade = getGradeById(session.grade) || GRADES[0];
  const selectedMode = getModeById(session.mode) || MODES[0];
  const studentProfile = useMemo(
    () => buildStudentProfile(session.grade, session.mode),
    [session.grade, session.mode]
  );

  const handleSessionChange = (patch) => {
    setSession((current) => ({
      ...current,
      ...patch,
    }));
  };

  if (!session.ready) {
    return (
      <div className="h-screen min-h-screen overflow-hidden text-[color:var(--text-primary)] xl:h-[100dvh]">
        <SetupScreen
          subjectCards={subjectCards}
          grades={GRADES}
          modes={MODES}
          selectedSubject={selectedSubject}
          selectedGrade={selectedGrade}
          selectedMode={selectedMode}
          studentProfile={studentProfile}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onSelectSubject={(subject) => handleSessionChange({ subject })}
          onSelectGrade={(grade) => handleSessionChange({ grade })}
          onSelectMode={(mode) => handleSessionChange({ mode })}
          onStart={() => handleSessionChange({ ready: true })}
        />
      </div>
    );
  }

  return (
    <div className="h-screen min-h-screen overflow-hidden text-[color:var(--text-primary)] xl:h-[100dvh]">
      <div className="mx-auto grid h-full min-h-0 max-w-[1600px] gap-4 px-4 py-4 xl:grid-cols-[310px_minmax(0,1fr)]">
        <aside className="ios-surface grid min-h-0 grid-rows-[auto_auto_auto_auto_auto_auto] gap-3 overflow-hidden rounded-[28px] px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ios-chip">
                <GraduationCap className="h-3.5 w-3.5" />
                TutorIA
              </div>
              <h1 className="mt-3 text-lg font-bold">Perfil activo</h1>
              <p className="mt-1 text-xs leading-5 text-[color:var(--text-secondary)]">
                Materia, grado y modo listos para empezar.
              </p>
            </div>

            <ThemeSwitch checked={isDark} onToggle={toggleTheme} />
          </div>

          <div
            className={`rounded-[26px] bg-gradient-to-br ${selectedSubject.meta.activeBg} px-4 py-4 ring-1 ${selectedSubject.meta.activeRing}`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl ${selectedSubject.meta.bubble}`}
              >
                {selectedSubject.emoji}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${selectedSubject.meta.badge}`}
                  >
                    {selectedSubject.meta.categoryLabel}
                  </span>
                  <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold ios-chip">
                    {selectedGrade.label}
                  </span>
                </div>
                <p className="mt-2 text-base font-semibold">{selectedSubject.name}</p>
                <p className="mt-1 text-xs leading-5 text-[color:var(--text-secondary)]">
                  {selectedSubject.meta.summary}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] font-medium text-[color:var(--text-secondary)]">
              <span>{selectedSubject.activeCount} temas activos</span>
              <span>{selectedSubject.mastery}% dominio</span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/40 dark:bg-slate-900/40">
              <div
                className={`h-full rounded-full ${selectedSubject.meta.bar}`}
                style={{
                  width: `${Math.max(
                    selectedSubject.mastery,
                    selectedSubject.activeCount > 0 ? 14 : 8
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-elevated)] px-3 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
                Grado
              </p>
              <p className="mt-2 text-sm font-semibold">{selectedGrade.label}</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-elevated)] px-3 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
                Modo
              </p>
              <p className="mt-2 text-sm font-semibold">{selectedMode.name}</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-elevated)] px-3 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
                Etapa
              </p>
              <p className="mt-2 text-sm font-semibold">{selectedGrade.stage}</p>
            </div>
          </div>

          <div className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-elevated)] px-3 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-[color:var(--accent)]" />
              Como respondere
            </div>
            <p className="mt-2 text-xs leading-5 text-[color:var(--text-secondary)]">
              {studentProfile.summary}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-[color:var(--accent-soft)] px-2.5 py-1 text-[10px] font-semibold text-[color:var(--accent-strong)]">
                {studentProfile.practiceHint}
              </span>
              <span className="rounded-full bg-[color:var(--surface-strong)] px-2.5 py-1 text-[10px] font-semibold">
                {selectedMode.shortLabel}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-elevated)] px-3 py-3">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
                <Target className="h-4 w-4" />
              </div>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
                Temas
              </p>
              <p className="mt-1 text-lg font-bold">{selectedSubject.topics.length}</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-elevated)] px-3 py-3">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-[color:var(--success-soft)] text-emerald-600 dark:text-emerald-300">
                <BookOpen className="h-4 w-4" />
              </div>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
                Activos
              </p>
              <p className="mt-1 text-lg font-bold">{selectedSubject.activeCount}</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-elevated)] px-3 py-3">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-[color:var(--warning-soft)] text-amber-600 dark:text-amber-300">
                <Sparkles className="h-4 w-4" />
              </div>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
                Dominio
              </p>
              <p className="mt-1 text-lg font-bold">{selectedSubject.mastery}%</p>
            </div>
          </div>

          <div className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-elevated)] px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--text-secondary)]">
              Temas de entrada
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedSubject.topics.slice(0, 4).map((topic) => (
                <span
                  key={topic}
                  className="rounded-full bg-[color:var(--surface-strong)] px-2.5 py-1 text-[10px] font-semibold"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSessionChange({ ready: false })}
            className="ios-surface-muted inline-flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-xs font-semibold text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
          >
            <RefreshCcw className="h-4 w-4" />
            Cambiar perfil
          </button>
        </aside>

        <main className="h-full min-h-0 overflow-hidden">
          <Chat
            key={`${session.subject}-${session.grade}-${session.mode}`}
            subject={session.subject}
            grade={session.grade}
            mode={session.mode}
            studentProfile={studentProfile}
            onBackToSetup={() => handleSessionChange({ ready: false })}
          />
        </main>
      </div>
    </div>
  );
}
