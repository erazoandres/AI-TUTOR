function renderInline(text, keyPrefix) {
  const tokenRegex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  const parts = [];
  let lastIndex = 0;
  let matchIndex = 0;

  for (const match of text.matchAll(tokenRegex)) {
    const [token] = match;
    const start = match.index ?? 0;

    if (start > lastIndex) {
      parts.push(
        <span key={`${keyPrefix}-plain-${matchIndex}`}>
          {text.slice(lastIndex, start)}
        </span>
      );
    }

    if (token.startsWith("**")) {
      parts.push(
        <strong
          key={`${keyPrefix}-bold-${matchIndex}`}
          className="font-semibold text-[color:var(--text-primary)]"
        >
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`")) {
      parts.push(
        <code
          key={`${keyPrefix}-code-${matchIndex}`}
          className="rounded-full bg-[color:var(--accent-soft)] px-2 py-0.5 text-[0.92em] font-semibold text-[color:var(--accent-strong)]"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else {
      parts.push(
        <em key={`${keyPrefix}-italic-${matchIndex}`} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    }

    lastIndex = start + token.length;
    matchIndex += 1;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={`${keyPrefix}-tail`}>{text.slice(lastIndex)}</span>);
  }

  return parts.length > 0 ? parts : text;
}

function getCallout(line) {
  const match = line.match(/^(Idea clave|Ejemplo|Tu turno|Recuerda):\s+(.+)$/i);

  if (!match) {
    return null;
  }

  const label = match[1].trim();
  const text = match[2].trim();
  const normalizedLabel = label.toLowerCase();
  const tone =
    normalizedLabel === "idea clave"
      ? "primary"
      : normalizedLabel === "ejemplo"
        ? "success"
        : normalizedLabel === "tu turno"
          ? "warning"
          : "neutral";

  return { label, text, tone };
}

function parseBlocks(content) {
  const text = content.replace(/\r/g, "");
  const lines = text.split("\n");
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const currentLine = lines[index].trim();

    if (!currentLine) {
      index += 1;
      continue;
    }

    const callout = getCallout(currentLine);
    if (callout) {
      blocks.push({
        type: "callout",
        ...callout,
      });
      index += 1;
      continue;
    }

    const headingMatch = currentLine.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2].trim(),
      });
      index += 1;
      continue;
    }

    if (/^\d+\.\s+/.test(currentLine)) {
      const items = [];

      while (index < lines.length) {
        const line = lines[index].trim();
        if (!line) {
          index += 1;
          break;
        }

        const match = line.match(/^\d+\.\s+(.+)$/);
        if (match) {
          items.push(match[1].trim());
          index += 1;
          continue;
        }

        if (items.length > 0) {
          items[items.length - 1] = `${items[items.length - 1]} ${line}`.trim();
          index += 1;
          continue;
        }

        break;
      }

      blocks.push({ type: "ordered", items });
      continue;
    }

    if (/^[-*•]\s+/.test(currentLine)) {
      const items = [];

      while (index < lines.length) {
        const line = lines[index].trim();
        if (!line) {
          index += 1;
          break;
        }

        const match = line.match(/^[-*•]\s+(.+)$/);
        if (match) {
          items.push(match[1].trim());
          index += 1;
          continue;
        }

        if (items.length > 0) {
          items[items.length - 1] = `${items[items.length - 1]} ${line}`.trim();
          index += 1;
          continue;
        }

        break;
      }

      blocks.push({ type: "unordered", items });
      continue;
    }

    const paragraphLines = [];

    while (index < lines.length) {
      const line = lines[index].trim();
      if (!line) {
        index += 1;
        break;
      }

      if (
        /^(#{1,3})\s+/.test(line) ||
        /^\d+\.\s+/.test(line) ||
        /^[-*•]\s+/.test(line) ||
        getCallout(line)
      ) {
        break;
      }

      paragraphLines.push(line);
      index += 1;
    }

    blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
  }

  return blocks;
}

export default function FormattedContent({ content, animated = false }) {
  const blocks = parseBlocks(content);
  const revealClass = animated ? "formatted-reveal-block" : "";
  const isCalloutSequence =
    blocks.length > 1 && blocks.every((block) => block.type === "callout");

  return (
    <div className={`formatted-content ${isCalloutSequence ? "is-callout-sequence" : ""}`}>
      {blocks.map((block, blockIndex) => {
        if (block.type === "callout") {
          return (
            <div
              key={`callout-${blockIndex}`}
              className={`formatted-callout formatted-callout-${block.tone} ${
                isCalloutSequence ? "is-sequence-item" : ""
              } ${revealClass}`}
              style={animated ? { animationDelay: `${80 + blockIndex * 55}ms` } : undefined}
            >
              <span className="formatted-callout-label">{block.label}</span>
              <p className="formatted-callout-text">
                {renderInline(block.text, `callout-${blockIndex}`)}
              </p>
            </div>
          );
        }

        if (block.type === "heading") {
          const headingClass =
            block.level === 1
              ? "text-lg font-bold"
              : block.level === 2
                ? "text-base font-semibold"
                : "text-sm font-semibold uppercase tracking-wide text-[color:var(--text-secondary)]";

          return (
            <h4
              key={`heading-${blockIndex}`}
              className={`${headingClass} ${revealClass}`}
              style={animated ? { animationDelay: `${80 + blockIndex * 55}ms` } : undefined}
            >
              {renderInline(block.text, `heading-${blockIndex}`)}
            </h4>
          );
        }

        if (block.type === "ordered") {
          return (
            <ol
              key={`ordered-${blockIndex}`}
              className={`space-y-3 ${revealClass}`}
              style={animated ? { animationDelay: `${80 + blockIndex * 55}ms` } : undefined}
            >
              {block.items.map((item, itemIndex) => (
                <li key={`ordered-item-${itemIndex}`} className="formatted-row">
                  <span className="formatted-index">{itemIndex + 1}</span>
                  <span>{renderInline(item, `ordered-${blockIndex}-${itemIndex}`)}</span>
                </li>
              ))}
            </ol>
          );
        }

        if (block.type === "unordered") {
          return (
            <ul
              key={`unordered-${blockIndex}`}
              className={`space-y-2.5 ${revealClass}`}
              style={animated ? { animationDelay: `${80 + blockIndex * 55}ms` } : undefined}
            >
              {block.items.map((item, itemIndex) => (
                <li key={`unordered-item-${itemIndex}`} className="formatted-row">
                  <span className="formatted-dot" />
                  <span>{renderInline(item, `unordered-${blockIndex}-${itemIndex}`)}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p
            key={`paragraph-${blockIndex}`}
            className={revealClass}
            style={animated ? { animationDelay: `${80 + blockIndex * 55}ms` } : undefined}
          >
            {renderInline(block.text, `paragraph-${blockIndex}`)}
          </p>
        );
      })}
    </div>
  );
}
