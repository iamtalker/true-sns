import {describe, expect, it} from "vitest"
import {readingMinutes, summarize} from "../../../src/true/blog"
import {normalizeOwner, parseHostConfig} from "../../../src/true/spaceConfig"
import {npubEncode} from "nostr-tools/nip19"

const HEX = "4f5034c23c591d1575ebb3e9986e638205a1c9280df076e580864d1d51373b55"

describe("blog helpers", () => {
  it("rounds reading time up with a minimum of one minute", () => {
    expect(readingMinutes("짧음")).toBe(1)
    expect(readingMinutes("가".repeat(501))).toBe(2)
    expect(readingMinutes("가 ".repeat(1000))).toBe(2)
  })

  it("prefers the author's summary, else cuts the start of the text", () => {
    expect(summarize("  직접 쓴 요약 ", "본문")).toBe("직접 쓴 요약")
    expect(summarize(undefined, "# 제목\n\n**굵게** 본문")).toBe("제목 굵게 본문")
    expect(summarize("", "가".repeat(200))).toBe("가".repeat(140) + "…")
  })
})

describe("host owner", () => {
  it("accepts hex and npub, rejects the rest", () => {
    expect(normalizeOwner(HEX)).toBe(HEX)
    expect(normalizeOwner(npubEncode(HEX))).toBe(HEX)
    expect(normalizeOwner("npub1garbage")).toBe("")
    expect(normalizeOwner(42)).toBe("")
    expect(parseHostConfig({owner: HEX}).owner).toBe(HEX)
  })
})
