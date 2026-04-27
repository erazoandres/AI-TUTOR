import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "tutoria_progress";

function readStoredProgress() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {};
    }

    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function useProgress() {
  const [progress, setProgress] = useState(readStoredProgress);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (Object.keys(progress).length === 0) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const updateTopic = useCallback((subject, topic, status) => {
    if (!subject || !topic || !status) {
      return;
    }

    setProgress((current) => ({
      ...current,
      [subject]: {
        ...(current[subject] || {}),
        [topic]: { status, updatedAt: new Date().toISOString() },
      },
    }));
  }, []);

  const getTopicStatus = useCallback(
    (subject, topic) => progress[subject]?.[topic]?.status || "pendiente",
    [progress]
  );

  const clearProgress = useCallback(() => {
    setProgress({});
  }, []);

  return { progress, updateTopic, getTopicStatus, clearProgress };
}
