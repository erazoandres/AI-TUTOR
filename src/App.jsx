import { useEffect, useMemo, useState } from "react";
import Chat from "./components/Chat";
import SessionLayout from "./components/layout/SessionLayout";
import SetupScreen from "./components/SetupScreen";
import { useProgress } from "./hooks/useProgress";
import { useSubjectCards } from "./hooks/useSubjectCards";
import { useTheme } from "./hooks/useTheme";
import { buildStudentProfile, getGradeById, getModeById, GRADES, MODES } from "./utils/studentProfile";
import { SUBJECTS } from "./utils/subjects";

// DESIGN SYSTEM
// Paleta: primario #2F5BFF, acento #00C9A7, coral #FF6B6B sobre fondo #EEF6FF.
// Tipografia: display -> Syne, body -> Plus Jakarta Sans / Outfit.
// Feeling: tutor digital colorido, claro y concentrado para sesiones escolares.

const SESSION_STORAGE_KEY = "tutoria_session";
const DEFAULT_SESSION = {
  subject: SUBJECTS[0]?.name || "",
  grade: GRADES[0]?.id || "5",
  mode: MODES[0]?.id || "easy",
  ready: false,
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
  const subjectCards = useSubjectCards(progress, session.grade);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }, [session]);

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
    <SessionLayout isDark={isDark} onToggleTheme={toggleTheme}>
      <Chat
        key={`${session.subject}-${session.grade}-${session.mode}`}
        subject={session.subject}
        grade={session.grade}
        mode={session.mode}
        studentProfile={studentProfile}
        onBackToSetup={() => handleSessionChange({ ready: false })}
      />
    </SessionLayout>
  );
}
