import { useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Flame,
  RefreshCcw,
  Target,
} from "lucide-react";
import { useProgress } from "../hooks/useProgress";
import { SUBJECTS } from "../utils/subjects";

const STATUS_STYLES = {
  pendiente: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  visto: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200",
  dominado: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200",
  repasar: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200",
};

const STATUS_LABELS = {
  pendiente: "Pendiente",
  visto: "Visto",
  dominado: "Dominado",
  repasar: "Repasar",
};

const SUBJECT_BARS = {
  matematicas: "bg-sky-500",
  fisica: "bg-amber-500",
  quimica: "bg-emerald-500",
  biologia: "bg-pink-500",
  historia: "bg-violet-500",
  lengua: "bg-rose-500",
  programacion: "bg-cyan-500",
};

function formatRelativeTime(isoDate) {
  if (!isoDate) {
    return "Sin actividad";
  }

  const diffMs = new Date(isoDate).getTime() - Date.now();
  const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
  const minutes = Math.round(diffMs / (1000 * 60));
  const hours = Math.round(diffMs / (1000 * 60 * 60));
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (Math.abs(minutes) < 60) {
    return rtf.format(minutes, "minute");
  }

  if (Math.abs(hours) < 24) {
    return rtf.format(hours, "hour");
  }

  return rtf.format(days, "day");
}

export default function ProgressMap() {
  const { progress, updateTopic, getTopicStatus, clearProgress } = useProgress();
  const [openSubjectId, setOpenSubjectId] = useState("matematicas");

  const subjectSummaries = useMemo(() => {
    return SUBJECTS.map((subject) => {
      const topicEntries = subject.topics.map((topic) => {
        const item = progress[subject.name]?.[topic];
        return {
          topic,
          status: item?.status || "pendiente",
          updatedAt: item?.updatedAt || null,
        };
      });

      const counts = topicEntries.reduce(
        (acc, entry) => {
          acc[entry.status] += 1;
          return acc;
        },
        { pendiente: 0, visto: 0, dominado: 0, repasar: 0 }
      );

      const completed = counts.visto + counts.dominado + counts.repasar;
      const percentage = Math.round((counts.dominado / subject.topics.length) * 100);
      const lastUpdated = topicEntries
        .filter((entry) => entry.updatedAt)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0]?.updatedAt;

      return {
        ...subject,
        topicEntries,
        counts,
        completed,
        percentage,
        started: completed > 0,
        lastUpdated,
      };
    });
  }, [progress]);

  const totals = subjectSummaries.flatMap((subject) => subject.topicEntries);
  const totalTopics = totals.length || 1;
  const masteredCount = totals.filter((entry) => entry.status === "dominado").length;
  const reviewCount = totals.filter((entry) => entry.status === "repasar").length;
  const seenCount = totals.filter((entry) => entry.status === "visto").length;
  const startedSubjects = subjectSummaries.filter((subject) => subject.started).length;
  const completionPercent = Math.round((masteredCount / totalTopics) * 100);
  const strongestSubject = subjectSummaries
    .filter((subject) => subject.started)
    .sort((a, b) => b.percentage - a.percentage)[0];

  const recentUpdates = subjectSummaries
    .flatMap((subject) =>
      subject.topicEntries
        .filter((entry) => entry.updatedAt)
        .map((entry) => ({
          subject: subject.name,
          emoji: subject.emoji,
          topic: entry.topic,
          status: entry.status,
          updatedAt: entry.updatedAt,
        }))
    )
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  const reviewQueue = subjectSummaries
    .flatMap((subject) =>
      subject.topicEntries
        .filter((entry) => entry.status === "repasar")
        .map((entry) => ({
          subject: subject.name,
          emoji: subject.emoji,
          topic: entry.topic,
        }))
    )
    .slice(0, 5);

  return (
    <div className="space-y-5">
      <section className="ios-surface animate-fade-up rounded-lg px-5 py-6">
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ios-chip">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </div>
            <h2 className="text-2xl font-bold sm:text-3xl">Tu tablero de avance</h2>
            <p className="max-w-2xl text-sm leading-6 text-[color:var(--text-secondary)]">
              Mira qué materias van mejor, qué temas piden repaso y cuáles fueron tus últimos pasos.
            </p>

            <div className="flex flex-wrap gap-2">
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <span
                  key={key}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[key]}`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="ios-surface-muted animate-breathe mx-auto flex w-full max-w-sm items-center justify-between rounded-lg px-5 py-5">
            <div className="space-y-1">
              <p className="text-sm text-[color:var(--text-secondary)]">Dominio total</p>
              <p className="text-3xl font-bold">{completionPercent}%</p>
              <p className="text-xs text-[color:var(--text-secondary)]">
                {masteredCount} temas dominados de {totalTopics}
              </p>
            </div>

            <div
              className="relative flex h-28 w-28 items-center justify-center rounded-full p-2"
              style={{
                background: `conic-gradient(var(--accent) ${completionPercent * 3.6}deg, var(--surface-muted) 0deg)`,
              }}
            >
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[color:var(--surface-strong)]">
                <span className="text-xl font-bold">{completionPercent}%</span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={clearProgress}
          className="ios-surface-muted mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-[color:var(--text-secondary)] transition hover:text-red-500"
        >
          <RefreshCcw className="h-4 w-4" />
          Reiniciar progreso
        </button>
      </section>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <article className="ios-surface hover-lift animate-fade-up rounded-lg px-4 py-4" style={{ animationDelay: "40ms" }}>
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <p className="text-sm text-[color:var(--text-secondary)]">Temas dominados</p>
          <p className="mt-1 text-3xl font-bold">{masteredCount}</p>
        </article>

        <article className="ios-surface hover-lift animate-fade-up rounded-lg px-4 py-4" style={{ animationDelay: "90ms" }}>
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--success-soft)] text-emerald-600 dark:text-emerald-300">
            <Target className="h-5 w-5" />
          </div>
          <p className="text-sm text-[color:var(--text-secondary)]">En práctica</p>
          <p className="mt-1 text-3xl font-bold">{seenCount}</p>
        </article>

        <article className="ios-surface hover-lift animate-fade-up rounded-lg px-4 py-4" style={{ animationDelay: "140ms" }}>
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--warning-soft)] text-amber-600 dark:text-amber-300">
            <Clock3 className="h-5 w-5" />
          </div>
          <p className="text-sm text-[color:var(--text-secondary)]">Para repasar</p>
          <p className="mt-1 text-3xl font-bold">{reviewCount}</p>
        </article>

        <article className="ios-surface hover-lift animate-fade-up rounded-lg px-4 py-4" style={{ animationDelay: "190ms" }}>
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--danger-soft)] text-rose-600 dark:text-rose-300">
            <Flame className="h-5 w-5" />
          </div>
          <p className="text-sm text-[color:var(--text-secondary)]">Materias activas</p>
          <p className="mt-1 text-3xl font-bold">{startedSubjects}</p>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-4">
          {subjectSummaries.map((subject, index) => {
            const isOpen = openSubjectId === subject.id;

            return (
              <article
                key={subject.id}
                className="ios-surface hover-lift animate-fade-up overflow-hidden rounded-lg"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`h-1.5 w-full ${SUBJECT_BARS[subject.id] || "bg-blue-500"}`} />
                <div className="px-5 py-5">
                  <button
                    type="button"
                    onClick={() => setOpenSubjectId((current) => (current === subject.id ? "" : subject.id))}
                    className="w-full text-left"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{subject.emoji}</span>
                        <div className="space-y-2">
                          <div>
                            <h3 className="text-lg font-semibold">{subject.name}</h3>
                            <p className="text-sm text-[color:var(--text-secondary)]">
                              {subject.counts.dominado} dominados, {subject.counts.repasar} por repasar
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full px-3 py-1 text-xs ios-chip">
                              {subject.percentage}% de dominio
                            </span>
                            <span className="rounded-full px-3 py-1 text-xs ios-chip">
                              {subject.completed}/{subject.topicEntries.length} activos
                            </span>
                            <span className="rounded-full px-3 py-1 text-xs ios-chip">
                              {subject.lastUpdated ? formatRelativeTime(subject.lastUpdated) : "Sin avances"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <ChevronDown
                        className={`mt-1 h-5 w-5 shrink-0 text-[color:var(--text-secondary)] transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-[color:var(--surface-muted)]">
                    <div
                      className={`h-full rounded-full ${SUBJECT_BARS[subject.id] || "bg-blue-500"} transition-all duration-500`}
                      style={{ width: `${subject.percentage}%` }}
                    />
                  </div>

                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="space-y-2 pt-1">
                        {subject.topicEntries.map((entry) => (
                          <div
                            key={entry.topic}
                            className="ios-surface-muted flex flex-col gap-2 rounded-lg px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div>
                              <p className="text-sm font-medium">{entry.topic}</p>
                              <p className="text-xs text-[color:var(--text-secondary)]">
                                {entry.updatedAt ? `Actualizado ${formatRelativeTime(entry.updatedAt)}` : "Aún sin actividad"}
                              </p>
                            </div>

                            <select
                              value={entry.status}
                              onChange={(e) => updateTopic(subject.name, entry.topic, e.target.value)}
                              className={`rounded-full border-0 px-3 py-2 text-xs font-medium ${STATUS_STYLES[entry.status]}`}
                            >
                              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                                <option key={key} value={key}>
                                  {label}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <aside className="space-y-4">
          <section className="ios-surface animate-fade-up rounded-lg px-5 py-5" style={{ animationDelay: "60ms" }}>
            <h3 className="text-lg font-semibold">Resumen rápido</h3>
            <div className="mt-4 space-y-3">
              <div className="ios-surface-muted rounded-lg px-4 py-3">
                <p className="text-sm text-[color:var(--text-secondary)]">Materia más fuerte</p>
                <p className="mt-1 font-semibold">
                  {strongestSubject ? `${strongestSubject.emoji} ${strongestSubject.name}` : "Aún estás empezando"}
                </p>
              </div>

              <div className="ios-surface-muted rounded-lg px-4 py-3">
                <p className="text-sm text-[color:var(--text-secondary)]">Próximo foco</p>
                <p className="mt-1 font-semibold">
                  {reviewQueue.length > 0
                    ? `${reviewQueue[0].emoji} ${reviewQueue[0].topic}`
                    : "Sigue practicando para generar sugerencias"}
                </p>
              </div>
            </div>
          </section>

          <section className="ios-surface animate-fade-up rounded-lg px-5 py-5" style={{ animationDelay: "120ms" }}>
            <h3 className="text-lg font-semibold">Últimos movimientos</h3>
            <div className="mt-4 space-y-3">
              {recentUpdates.length > 0 ? (
                recentUpdates.map((entry) => (
                  <div key={`${entry.subject}-${entry.topic}`} className="ios-surface-muted rounded-lg px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">
                          {entry.emoji} {entry.topic}
                        </p>
                        <p className="text-sm text-[color:var(--text-secondary)]">{entry.subject}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[entry.status]}`}>
                        {STATUS_LABELS[entry.status]}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-[color:var(--text-secondary)]">
                      {formatRelativeTime(entry.updatedAt)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-6 text-[color:var(--text-secondary)]">
                  Cuando cambies el estado de un tema o completes un quiz, aquí verás tu actividad reciente.
                </p>
              )}
            </div>
          </section>

          <section className="ios-surface animate-fade-up rounded-lg px-5 py-5" style={{ animationDelay: "180ms" }}>
            <h3 className="text-lg font-semibold">Temas para repasar</h3>
            <div className="mt-4 space-y-2">
              {reviewQueue.length > 0 ? (
                reviewQueue.map((entry) => (
                  <div key={`${entry.subject}-${entry.topic}`} className="ios-surface-muted flex items-center gap-3 rounded-lg px-4 py-3">
                    <span className="text-xl">{entry.emoji}</span>
                    <div>
                      <p className="font-medium">{entry.topic}</p>
                      <p className="text-sm text-[color:var(--text-secondary)]">{entry.subject}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-6 text-[color:var(--text-secondary)]">
                  Todavía no hay temas marcados para repaso. Vas muy bien.
                </p>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
