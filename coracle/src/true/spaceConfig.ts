// A "space" decides how the same posts are presented and composed.
// Posts are always plain nostr events (kind 1 notes, kind 30023 articles);
// only the view and the composer rules change.

export type SpaceMode = "micro" | "blog" | "board"

export type SpaceConfig = {
  mode: SpaceMode
  label: string
  kinds: number[]
  layout: "full" | "list"
  titleRequired: boolean
  showTitleField: boolean
  maxLength?: number
}

export const SPACES: Record<SpaceMode, SpaceConfig> = {
  micro: {
    mode: "micro",
    label: "Micro",
    kinds: [1],
    layout: "full",
    titleRequired: false,
    showTitleField: false,
    maxLength: 280,
  },
  blog: {
    mode: "blog",
    label: "Blog",
    kinds: [30023],
    layout: "full",
    titleRequired: true,
    showTitleField: true,
  },
  board: {
    mode: "board",
    label: "Board",
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
