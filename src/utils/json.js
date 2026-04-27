const CODE_BLOCK_RE = /^```(?:json)?\s*|\s*```$/g;

function tryParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function safeParseJson(rawValue) {
  if (typeof rawValue !== "string") {
    return null;
  }

  const trimmed = rawValue.trim();
  if (!trimmed) {
    return null;
  }

  const direct = tryParse(trimmed);
  if (direct) {
    return direct;
  }

  const withoutCodeFence = trimmed.replace(CODE_BLOCK_RE, "").trim();
  const fenced = tryParse(withoutCodeFence);
  if (fenced) {
    return fenced;
  }

  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return null;
  }

  return tryParse(jsonMatch[0]);
}
