import {describe, expect, it} from "vitest"
import {eventToMarkdown, markdownToTemplate} from "../../../src/true/markdown"

describe("markdown round trip", () => {
  it("round-trips a long-form article", () => {
    const event = {
      id: "abc12345",
      kind: 30023,
      created_at: 1700000000,
      content: "# 안녕\n\n본문 **굵게**",
      tags: [
        ["d", "my-post"],
        ["title", 'He said "hi": ok'],
        ["summary", "요약"],
        ["t", "일상"],
        ["t", "nostr"],
      ],
    }
    const doc = eventToMarkdown(event)!

    expect(doc.filename).toMatch(/^articles\/2023-11-14-/)

    const back = markdownToTemplate(doc.text)

    expect(back.kind).toBe(30023)
    expect(back.created_at).toBe(1700000000)
    expect(back.content).toBe(event.content)
    expect(back.tags).toEqual(
      expect.arrayContaining([
        ["d", "my-post"],
        ["title", 'He said "hi": ok'],
        ["summary", "요약"],
        ["t", "일상"],
        ["t", "nostr"],
      ]),
    )
  })

  it("round-trips a short note", () => {
    const doc = eventToMarkdown({id: "n1", kind: 1, created_at: 1700000000, content: "짧은 글", tags: [["t", "a"]]})!

    expect(doc.filename.startsWith("notes/")).toBe(true)
    expect(markdownToTemplate(doc.text)).toMatchObject({kind: 1, content: "짧은 글", tags: [["t", "a"]]})
  })

  it("imports plain markdown without frontmatter", () => {
    expect(markdownToTemplate("just text\n", "file", 5)).toEqual({kind: 1, created_at: 5, content: "just text", tags: []})
  })

  it("skips unsupported kinds", () => {
    expect(eventToMarkdown({kind: 7, created_at: 1, content: "+", tags: []})).toBeUndefined()
  })
})

import {stableFilename} from "../../../src/true/markdown"

describe("stable filenames", () => {
  it("keeps an article's file when its title changes", () => {
    const a = {id: "1", kind: 30023, created_at: 1, content: "x", tags: [["d", "my-post"], ["title", "A"]]}
    const b = {...a, id: "2", created_at: 99, tags: [["d", "my-post"], ["title", "B"]]}

    expect(stableFilename(a)).toBe("articles/my-post.md")
    expect(stableFilename(b)).toBe(stableFilename(a))
  })

  it("keys notes by id and skips other kinds", () => {
    expect(stableFilename({id: "abcdef123", kind: 1, created_at: 1700000000, content: "", tags: []})).toBe(
      "notes/2023-11-14-abcdef12.md",
    )
    expect(stableFilename({kind: 7, created_at: 1, content: "", tags: []})).toBeUndefined()
  })
})
