// Mirror the user's own notes/articles to a folder of plain .md files they chose.
// One-way (app -> folder) and never deletes anything in the folder. Needs the File System
// Access API (Chromium browsers); elsewhere the manual Markdown export is the fallback.
import {openDB} from "idb"
import {writable} from "svelte/store"
import {on} from "@welshman/lib"
import type {RepositoryUpdate} from "@welshman/net"
import type {AppPolicy} from "@welshman/app"
import {app, appPolicies, sessions} from "src/engine/core"
import {eventToMarkdown, stableFilename} from "src/true/markdown"

export type MirrorStatus = "unsupported" | "off" | "needs-permission" | "on" | "error"

export const mirrorStatus = writable<MirrorStatus>("off")
export const mirrorFolderName = writable<string>("")
export const mirrorMessage = writable<string>("")

const DB = "true-sns-folder"
const KEY = "mirror"

export const isSupported = () =>
  typeof window !== "undefined" && typeof (window as any).showDirectoryPicker === "function"

const db = () => openDB(DB, 1, {upgrade: d => void d.createObjectStore("handles")})

const saveHandle = async (handle: any) => (await db()).put("handles", handle, KEY)

const loadHandle = async (): Promise<any | undefined> => (await db()).get("handles", KEY)

export const forgetFolder = async () => {
  await (await db()).delete("handles", KEY)
  mirrorStatus.set(isSupported() ? "off" : "unsupported")
  mirrorFolderName.set("")
}

const hasPermission = async (handle: any, request: boolean) => {
  const opts = {mode: "readwrite"}

  if ((await handle.queryPermission?.(opts)) === "granted") return true

  return request && (await handle.requestPermission?.(opts)) === "granted"
}

const writeFile = async (dir: any, path: string, text: string) => {
  const parts = path.split("/")
  const name = parts.pop() as string

  let handle = dir

  for (const part of parts) handle = await handle.getDirectoryHandle(part, {create: true})

  const file = await handle.getFileHandle(name, {create: true})
  const writable = await file.createWritable()

  await writable.write(text)
  await writable.close()
}

const writeEvents = async (dir: any, events: any[]) => {
  let count = 0

  for (const event of events) {
    const doc = eventToMarkdown(event)
    const filename = stableFilename(event)

    if (!doc || !filename) continue

    await writeFile(dir, filename, doc.text)
    count++
  }

  return count
}

const ownEvents = () => {
  const $app = app.get()
  const pubkey = $app.user?.pubkey

  return pubkey ? Array.from($app.repository.query([{authors: [pubkey]}])) : []
}

// Must be called from a click: it opens the folder picker.
export const chooseFolder = async () => {
  if (!isSupported()) return mirrorStatus.set("unsupported")

  try {
    const handle = await (window as any).showDirectoryPicker({mode: "readwrite"})

    await saveHandle(handle)
    mirrorFolderName.set(handle.name)
    mirrorStatus.set("on")

    return syncAll()
  } catch (e) {
    if ((e as any)?.name !== "AbortError") {
      mirrorStatus.set("error")
      mirrorMessage.set(String(e))
    }
  }
}

// Write every one of the user's notes/articles. Asking for permission needs a click,
// so the button calls this too.
export const syncAll = async () => {
  const handle = await loadHandle()

  if (!handle) return 0

  mirrorFolderName.set(handle.name)

  if (!(await hasPermission(handle, true))) {
    mirrorStatus.set("needs-permission")

    return 0
  }

  const count = await writeEvents(handle, ownEvents())

  mirrorStatus.set("on")
  mirrorMessage.set(`Wrote ${count} file(s) to ${handle.name}`)

  return count
}

export const initMirror = async () => {
  if (!isSupported()) return mirrorStatus.set("unsupported")

  const handle = await loadHandle()

  if (!handle) return mirrorStatus.set("off")

  mirrorFolderName.set(handle.name)
  mirrorStatus.set((await hasPermission(handle, false)) ? "on" : "needs-permission")
}

// Keep the folder up to date as the user's own events change.
const folderMirrorPolicy: AppPolicy = $app => {
  void initMirror().catch(() => mirrorStatus.set("error"))

  return on($app.repository, "update", async ({added}: RepositoryUpdate) => {
    const $sessions = sessions.get()
    const mine = added.filter(e => $sessions[e.pubkey])

    if (mine.length === 0) return

    try {
      const handle = await loadHandle()

      if (!handle || !(await hasPermission(handle, false))) return

      await writeEvents(handle, mine)
    } catch (e) {
      mirrorStatus.set("error")
      mirrorMessage.set(String(e))
    }
  })
}

appPolicies.push(folderMirrorPolicy)
