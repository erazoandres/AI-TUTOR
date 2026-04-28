import { useMemo } from "react";
import { getSubjectMeta } from "../utils/subjectMeta";
import { getTopicsForSubject, SUBJECTS } from "../utils/subjects";

export function useSubjectCards(progress, grade) {
  return useMemo(() => {
    return SUBJECTS.map((subject) => {
      const meta = getSubjectMeta(subject.id);
      const topics = getTopicsForSubject(subject.id, grade);
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
  }, [grade, progress]);
}
