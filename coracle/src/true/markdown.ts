// Markdown <-> Nostr event conversion for the "own your data" export/import.
// Pure functions only, so they can be unit-tested without the app runtime.

export const NOTE = 1
export const LONG_FORM = 30023

const MD_KINDS = [NOTE, LONG_FORM]

export type EventLike = {
  id?: string
  kind: number
  pubkey?: string
  created_at: number
  content: string
  tags: string[][]
}

export type MarkdownDoc = {
  filename: string
  text: string
}

export type EventTemplate = {
  kind: number
  created_at: number
  content: string
  tags: string[][]
}

const getTag = (tags: string[][], name: string) => tags.find(t => t[0] === name)?.[1]

const quote = (s: string) => JSON.stringify(s)

const unquote = (s: string) => {
  const v = s.trim()

  if (v.startsWith('"')) {
    try {
      return JSON.parse(v) as string
    } catch (e) {
      // fall through to the raw value
    }
  }

  return v
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)

const pad = (n: number) => String(n).padStart(2, "0")

const dateStamp = (ts: number) => {
  const d = new Date(ts * 1000)

  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`
}

export const isMarkdownKind = (kind: number) => MD_KINDS.includes(kind)

export const eventToMarkdown = (event: EventLike): MarkdownDoc | undefined => {
  if (!isMarkdownKind(event.kind)) return undefined

  const topics = event.tags.filter(t => t[0] === "t").map(t => t[1])
  const title = getTag(event.tags, "title")
  const d = getTag(event.tags, "d")
  const lines = ["---", `kind: ${event.kind}`]

  if (event.id) lines.push(`id: ${event.id}`)
  if (d) lines.push(`d: ${quote(d)}`)
  if (title) lines.push(`title: ${quote(title)}`)

  const summary = getTag(event.tags, "summary")

  if (summary) lines.push(`summary: ${quote(summary)}`)

  lines.push(`created_at: ${event.created_at}`)

  const publishedAt = getTag(event.tags, "published_at")

  if (publishedAt) lines.push(`published_at: ${publishedAt}`)
  if (topics.length > 0) lines.push(`tags: [${topics.map(quote).join(", ")}]`)

  lines.push("---", "", event.content, "")

  const folder = event.kind === LONG_FORM ? "articles" : "notes"
  const slug = slugify(title || d || event.content.split("\n")[0] || "") || (event.id || "").slice(0, 8)
  const filename = `${folder}/${dateStamp(event.created_at)}-${slug || "untitled"}.md`

  return {filename, text: lines.join("\n")}
}

const parseList = (raw: string) => {
  const m = raw.trim().match(/^\[(.*)\]$/s)

  if (!m) return raw.trim() ? [unquote(raw)] : []

  const inner = m[1].trim()

  if (!inner) return []

  try {
    return JSON.parse(`[${inner}]`) as string[]
  } catch (e) {
    return inner.split(",").map(s => unquote(s))
  }
}

export const parseMarkdown = (text: string, fallbackName = "untitled") => {
  const src = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n")
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/)
  const meta: Record<string, string> = {}

  let body = src

  if (m) {
    body = src.slice(m[0].length)

    for (const line of m[1].split("\n")) {
      const i = line.indexOf(":")

      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
    }
  }

  return {meta, body: body.replace(/^\n+/, "").replace(/\s+$/, ""), fallbackName}
}

export const markdownToTemplate = (
  text: string,
  fallbackName = "untitled",
  now = Math.floor(Date.now() / 1000),
): EventTemplate => {
  const {meta, body} = parseMarkdown(text, fallbackName)
  const title = meta.title ? unquote(meta.title) : undefined
  const kind = meta.kind ? Number(meta.kind) : title ? LONG_FORM : NOTE
  const tags: string[][] = []

  if (kind === LONG_FORM) {
    const d = meta.d ? unquote(meta.d) : slugify(title || fallbackName) || fallbackName

    tags.push(["d", d])
    if (title) tags.push(["title", title])
    if (meta.summary) tags.push(["summary", unquote(meta.summary)])
    if (meta.published_at) tags.push(["published_at", meta.published_at])
  }

  for (const t of parseList(meta.tags || "")) tags.push(["t", t])

  const created = Number(meta.created_at)

  return {
    kind: isMarkdownKind(kind) ? kind : NOTE,
    created_at: Number.isFinite(created) && created > 0 ? created : now,
    content: body,
    tags,
  }
}
