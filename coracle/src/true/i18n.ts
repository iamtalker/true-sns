// Lightweight UI translation. Coracle ships English-only strings spread over hundreds of
// components, so instead of editing each one we translate exact-match text on the page
// (text nodes and a few attributes) from a dictionary, and keep it up to date with a
// MutationObserver. Unknown text is left alone, so a missing entry just shows English.
import {KO, KO_PATTERNS} from "src/true/ko"

export type Lang = "en" | "ko"

const ATTRS = ["placeholder", "title", "aria-label", "alt"]

// Never touch what users typed or posted
const SKIP = "script, style, textarea, input, .ProseMirror, [data-no-translate]"

const dicts: Record<Lang, Record<string, string> | undefined> = {en: undefined, ko: KO}

let observer: MutationObserver | undefined
let lookup: Record<string, string> | undefined
let patterns: [RegExp, string][] = []

export const translate = (text: string): string | undefined => {
  const trimmed = text.trim()

  if (!trimmed || !lookup) return undefined

  // Source files wrap long sentences, so compare with whitespace collapsed
  const key = trimmed.replace(/\s+/g, " ")
  const hit = lookup[key]

  if (hit !== undefined) return text.replace(trimmed, hit)

  for (const [re, out] of patterns) {
    if (re.test(key)) return text.replace(trimmed, key.replace(re, out))
  }

  return undefined
}

const translateNode = (node: Node) => {
  if (node.nodeType === Node.TEXT_NODE) {
    const parent = node.parentElement

    if (!parent || parent.closest(SKIP)) return

    const out = translate((node as Text).data)

    if (out !== undefined && out !== (node as Text).data) (node as Text).data = out

    return
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return

  const el = node as Element

  if (el.matches(SKIP) || el.closest(SKIP)) return

  for (const attr of ATTRS) {
    const value = el.getAttribute(attr)

    if (value) {
      const out = translate(value)

      if (out !== undefined && out !== value) el.setAttribute(attr, out)
    }
  }

  el.childNodes.forEach(translateNode)
}

export const stopTranslator = () => {
  observer?.disconnect()
  observer = undefined
  lookup = undefined
}

export const startTranslator = (lang: Lang) => {
  stopTranslator()

  lookup = dicts[lang]
  patterns = lang === "ko" ? KO_PATTERNS : []

  if (!lookup || typeof document === "undefined") return

  document.documentElement.lang = lang

  const run = () => {
    translateNode(document.body)

    observer = new MutationObserver(mutations => {
      for (const m of mutations) {
        if (m.type === "characterData") translateNode(m.target)
        else if (m.type === "attributes") translateNode(m.target)
        else m.addedNodes.forEach(translateNode)
      }
    })

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRS,
    })
  }

  if (document.body) run()
  else document.addEventListener("DOMContentLoaded", run, {once: true})
}
