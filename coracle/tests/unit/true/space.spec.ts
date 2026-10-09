import {describe, expect, it} from "vitest"
import {SPACES, checkDraft, getSpace, slugifyTitle} from "../../../src/true/spaceConfig"

describe("space config", () => {
  it("falls back to micro for unknown modes", () => {
    expect(getSpace("nope").mode).toBe("micro")
  })

  it("micro enforces length and ignores titles", () => {
    expect(checkDraft(SPACES.micro, "", "a".repeat(281)).ok).toBe(false)
    expect(checkDraft(SPACES.micro, "ignored", "hi")).toEqual({ok: true, asArticle: false})
  })

  it("counts characters, not UTF-16 units", () => {
    expect(checkDraft(SPACES.micro, "", "😀".repeat(280)).ok).toBe(true)
  })

  it("blog and board require a title and become articles", () => {
    expect(checkDraft(SPACES.blog, "", "body").ok).toBe(false)
    expect(checkDraft(SPACES.board, "제목", "body")).toEqual({ok: true, asArticle: true})
  })

  it("rejects empty content", () => {
    expect(checkDraft(SPACES.blog, "t", "  ").ok).toBe(false)
  })

  it("slugifies unicode titles", () => {
    expect(slugifyTitle("안녕 Hello!", "x")).toBe("안녕-hello")
    expect(slugifyTitle("!!!", "fallback")).toBe("fallback")
  })
})

import {DEFAULT_HOST, parseHostConfig, resolveMode} from "../../../src/true/spaceConfig"

describe("host config", () => {
  it("falls back field by field on bad input", () => {
    expect(parseHostConfig(null)).toEqual(DEFAULT_HOST)
    expect(parseHostConfig({mode: "wiki", allowUserMode: "yes", name: 5})).toEqual(DEFAULT_HOST)
    expect(parseHostConfig({mode: "board", name: "x", lang: "ko"})).toEqual({
      name: "x",
      mode: "board",
      allowUserMode: true,
      lang: "ko",
      owner: "",
    })
    expect(parseHostConfig({lang: "fr"}).lang).toBe("en")
  })

  it("host wins unless users may choose", () => {
    const locked = {...DEFAULT_HOST, mode: "board" as const, allowUserMode: false}
    const open = {...locked, allowUserMode: true}

    expect(resolveMode(locked, "blog")).toBe("board")
    expect(resolveMode(open, "blog")).toBe("blog")
    expect(resolveMode(open, null)).toBe("board")
    expect(resolveMode(open, "garbage")).toBe("board")
  })
})
