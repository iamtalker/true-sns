// Small helpers for the blog view (pure, so they can be unit-tested)

// Hangul and other CJK read more densely than English words, so count characters.
const CHARS_PER_MINUTE = 500

export const readingMinutes = (content: string) =>
  Math.max(1, Math.ceil([...content.replace(/\s+/g, "")].length / CHARS_PER_MINUTE))

// Use the author's summary when there is one, otherwise the start of the text.
export const summarize = (summary: string | undefined, content: string, max = 140) => {
  if (summary && summary.trim()) return summary.trim()

  const plain = content
    .replace(/^#+\s*/gm, "")
    .replace(/[*_`>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
  const chars = [...plain]

  return chars.length > max ? chars.slice(0, max).join("") + "…" : plain
}
