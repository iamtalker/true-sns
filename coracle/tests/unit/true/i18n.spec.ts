import {describe, expect, it} from "vitest"
import {startTranslator, stopTranslator, translate} from "../../../src/true/i18n"

describe("translate", () => {
  it("does nothing until a language is started", () => {
    stopTranslator()
    expect(translate("Settings")).toBeUndefined()
  })

  it("translates exact text and keeps surrounding whitespace", () => {
    startTranslator("ko")
    expect(translate("  Settings\n")).toBe("  설정\n")
    expect(translate("Unknown text")).toBeUndefined()
  })

  it("collapses wrapped lines before matching", () => {
    startTranslator("ko")
    expect(translate("Do not share   this\n   with anyone.")).toBe("절대 다른 사람에게 알려 주지 마세요.")
    expect(translate("Do not share this with anyone.")).toBe("절대 다른 사람에게 알려 주지 마세요.")
  })

  it("translates numbers with patterns", () => {
    startTranslator("ko")
    expect(translate("5 words")).toBe("5단어")
    expect(translate("0 / 280 characters")).toBe("0 / 280자")
    expect(translate("Wrote 2 file(s) to docs")).toBe("docs에 파일 2개를 저장했습니다.")
  })

  it("leaves English alone", () => {
    startTranslator("en")
    expect(translate("Settings")).toBeUndefined()
  })
})

describe("board and blog labels", () => {
  it("translates reply counts and reading time", () => {
    startTranslator("ko")
    expect(translate("Replies: 2")).toBe("댓글 2")
    expect(translate("3 min read")).toBe("3분 읽기")
  })
})
