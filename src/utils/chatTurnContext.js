function extractCalloutText(content, label) {
  if (typeof content !== "string" || !content.trim()) {
    return "";
  }

  const lines = content.replace(/\r/g, "").split("\n");
  const labelPattern = new RegExp(`^${label}:?\\s*(.*)$`, "i");
  const anyCalloutPattern = /^(Idea clave|Ejemplo|Tu turno|Recuerda):?\s*(.*)$/i;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    const match = line.match(labelPattern);

    if (!match) {
      continue;
    }

    if (match[1]?.trim()) {
      return match[1].trim();
    }

    const collected = [];
    let pointer = index + 1;

    while (pointer < lines.length) {
      const nextLine = lines[pointer].trim();
      if (!nextLine) {
        if (collected.length > 0) {
          break;
        }

        pointer += 1;
        continue;
      }

      if (anyCalloutPattern.test(nextLine)) {
        break;
      }

      collected.push(nextLine);
      pointer += 1;
    }

    return collected.join(" ").trim();
  }

  return "";
}

export function extractTurnPrompt(content) {
  return extractCalloutText(content, "Tu turno");
}

export function extractIdeaContext(content) {
  return extractCalloutText(content, "Idea clave");
}
