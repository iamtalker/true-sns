import {decode} from "nostr-tools/nip19"

// A "space" decides how the same posts are presented and composed.
// Posts are always plain nostr events (kind 1 notes, kind 30023 articles);
// only the view and the composer rules change.

export type SpaceMode = "micro" | "blog" | "board"

export type SpaceConfig = {
  mode: SpaceMode
  label: string
  description: string
  kinds: number[]
  layout: "full" | "list" | "blog"
  titleRequired: boolean
  showTitleField: boolean
  maxLength?: number
}

export const SPACES: Record<SpaceMode, SpaceConfig> = {
  micro: {
    mode: "micro",
    label: "Micro",
    description: "Short posts as cards, no title, up to 280 characters.",
    kinds: [1],
    layout: "full",
    titleRequired: false,
    showTitleField: false,
    maxLength: 280,
  },
  blog: {
    mode: "blog",
    label: "Blog",
    description: "One author's long posts, for reading: big title, summary, reading time.",
    kinds: [30023],
    layout: "blog",
    titleRequired: true,
    showTitleField: true,
  },
  board: {
    mode: "board",
    label: "Board",
    description: "Everyone's posts as a one-line list for discussion: title, author, date, reply count.",
    kinds: [1, 30023],
    layout: "list",
    titleRequired: true,
    showTitleField: true,
  },
}

export const SPACE_MODES = Object.keys(SPACES) as SpaceMode[]

export const DEFAULT_SPACE: SpaceMode = "micro"

export const isSpaceMode = (v: unknown): v is SpaceMode =>
  typeof v === "string" && v in SPACES

export const getSpace = (mode: unknown): SpaceConfig =>
  isSpaceMode(mode) ? SPACES[mode] : SPACES[DEFAULT_SPACE]

export type DraftCheck = {ok: boolean; asArticle?: boolean; error?: string}

// Decide whether a draft is acceptable in this space and which kind it becomes.
export const checkDraft = (space: SpaceConfig, title: string, content: string): DraftCheck => {
  const t = title.trim()
  const c = content.trim()

  if (!c) return {ok: false, error: "Please provide some content."}

  if (space.titleRequired && !t) return {ok: false, error: "Please provide a title."}

  if (space.maxLength && [...c].length > space.maxLength) {
    return {ok: false, error: `This space allows at most ${space.maxLength} characters.`}
  }

  return {ok: true, asArticle: Boolean(t) && space.showTitleField}
}

export const slugifyTitle = (title: string, fallback: string) =>
  title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || fallback

// Host configuration: the server operator decides how the space looks. It is a small JSON
// document served next to the app (see public/true-host.json), so any static host can provide it.

export type HostLang = "en" | "ko"

export type HostConfig = {
  name: string
  mode: SpaceMode
  allowUserMode: boolean
  lang: HostLang
  // Hex pubkey of the blog's author. When set, the Blog mode shows only this person's posts.
  owner: string
}

export const DEFAULT_HOST: HostConfig = {
  name: "",
  mode: DEFAULT_SPACE,
  allowUserMode: true,
  lang: "en",
  owner: "",
}

// Accepts a hex pubkey or an npub and returns hex ("" when it is neither).
export const normalizeOwner = (value: unknown): string => {
  if (typeof value !== "string") return ""

  const v = value.trim()

  if (/^[0-9a-f]{64}$/.test(v)) return v

  if (v.startsWith("npub1")) {
    try {
      const d = decode(v)

      return d.type === "npub" ? (d.data as string) : ""
    } catch (e) {
      return ""
    }
  }

  return ""
}

// Accepts anything (the file comes from the network) and falls back field by field.
export const parseHostConfig = (raw: unknown): HostConfig => {
  const o = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {}

  return {
    name: typeof o.name === "string" ? o.name.slice(0, 80) : DEFAULT_HOST.name,
    mode: isSpaceMode(o.mode) ? o.mode : DEFAULT_HOST.mode,
    allowUserMode:
      typeof o.allowUserMode === "boolean" ? o.allowUserMode : DEFAULT_HOST.allowUserMode,
    lang: o.lang === "ko" || o.lang === "en" ? o.lang : DEFAULT_HOST.lang,
    owner: normalizeOwner(o.owner),
  }
}

// The host's mode wins unless it lets users choose and this user already did.
export const resolveMode = (host: HostConfig, userMode: unknown): SpaceMode =>
  host.allowUserMode && isSpaceMode(userMode) ? userMode : host.mode
