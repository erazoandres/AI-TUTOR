import { useState } from "react";
import { safeParseJson } from "../utils/json";
import { buildLocalExercises, buildLocalQuiz, buildLocalTutorReply } from "../utils/mockTutor";
import { getExercisePrompt, getQuizPrompt, getTutorPrompt } from "../utils/prompts";

const API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

function normalizeTextResponse(data) {
  const content = data?.choices?.[0]?.message?.content;

  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part?.text === "string" ? part.text.trim() : ""))
      .filter(Boolean)
      .join("\n\n");
  }

  return "";
}

function formatApiError(status, payload) {
  const details =
    payload?.error?.message ||
    payload?.message ||
    payload?.detail ||
    (typeof payload === "string" ? payload : "");

  return details ? `Groq ${status}: ${details}` : `Groq ${status}`;
}

export function useGroqAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  const model = import.meta.env.VITE_GROQ_MODEL || DEFAULT_MODEL;
  const hasApiKey = Boolean(apiKey);

  const requestGroq = async ({
    systemPrompt,
    messages,
    maxCompletionTokens = 1024,
    responseFormat = null,
  }) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_completion_tokens: maxCompletionTokens,
        ...(responseFormat ? { response_format: responseFormat } : {}),
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        ],
      }),
    });

    if (!response.ok) {
      let payload = null;
      try {
        payload = await response.json();
      } catch {
        payload = await response.text();
      }

      throw new Error(formatApiError(response.status, payload));
    }

    return response.json();
  };

  const sendMessage = async ({ messages, subject, grade, mode, topic, studentProfile }) => {
    const systemPrompt = getTutorPrompt({ subject, grade, mode, topic, studentProfile });

    setLoading(true);
    setError(null);

    try {
      if (!hasApiKey) {
        return buildLocalTutorReply({ subject, grade, mode, topic, messages, studentProfile });
      }

      const data = await requestGroq({
        systemPrompt,
        messages,
        maxCompletionTokens: 420,
      });

      const text = normalizeTextResponse(data);
      if (!text) {
        throw new Error("La respuesta de Groq llego vacia.");
      }

      return text;
    } catch {
      setError("No pude contactar a Groq. Estoy usando una respuesta local de apoyo.");
      return buildLocalTutorReply({ subject, grade, mode, topic, messages, studentProfile });
    } finally {
      setLoading(false);
    }
  };

  const generateExercises = async ({ subject, topic, grade, mode, studentProfile }) => {
    setLoading(true);
    setError(null);

    try {
      if (!hasApiKey) {
        return buildLocalExercises({ subject, topic, grade, mode, studentProfile }).ejercicios;
      }

      const data = await requestGroq({
        systemPrompt: getTutorPrompt({ subject, grade, mode, topic, studentProfile }),
        messages: [
          {
            role: "user",
            content: getExercisePrompt({ subject, topic, grade, mode, studentProfile }),
          },
        ],
        maxCompletionTokens: 1200,
        responseFormat: { type: "json_object" },
      });

      const parsed = safeParseJson(normalizeTextResponse(data));
      if (!Array.isArray(parsed?.ejercicios)) {
        throw new Error("El formato de ejercicios no fue valido.");
      }

      return parsed.ejercicios;
    } catch {
      setError("No pude generar ejercicios con Groq. Deje una version local para que sigamos.");
      return buildLocalExercises({ subject, topic, grade, mode, studentProfile }).ejercicios;
    } finally {
      setLoading(false);
    }
  };

  const generateQuiz = async ({ subject, topic, grade, mode, studentProfile }) => {
    setLoading(true);
    setError(null);

    try {
      if (!hasApiKey) {
        return buildLocalQuiz({ subject, topic, grade, mode, studentProfile }).preguntas;
      }

      const data = await requestGroq({
        systemPrompt: getTutorPrompt({ subject, grade, mode, topic, studentProfile }),
        messages: [
          {
            role: "user",
            content: getQuizPrompt({ subject, topic, grade, mode, studentProfile }),
          },
        ],
        maxCompletionTokens: 1400,
        responseFormat: { type: "json_object" },
      });

      const parsed = safeParseJson(normalizeTextResponse(data));
      if (!Array.isArray(parsed?.preguntas)) {
        throw new Error("El formato del quiz no fue valido.");
      }

      return parsed.preguntas;
    } catch {
      setError("No pude generar el quiz con Groq. Deje una version local para practicar.");
      return buildLocalQuiz({ subject, topic, grade, mode, studentProfile }).preguntas;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendMessage,
    generateExercises,
    generateQuiz,
    loading,
    error,
    hasApiKey,
    model,
    clearError: () => setError(null),
  };
}
