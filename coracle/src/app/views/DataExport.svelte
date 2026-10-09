<script lang="ts">
  import {Capacitor} from "@capacitor/core"
  import {Filesystem, Directory, Encoding} from "@capacitor/filesystem"
  import FieldInline from "src/partials/FieldInline.svelte"
  import Toggle from "src/partials/Toggle.svelte"
  import Button from "src/partials/Button.svelte"
  import FlexColumn from "src/partials/FlexColumn.svelte"
  import Heading from "src/partials/Heading.svelte"
  import {showInfo} from "src/partials/Toast.svelte"
  import {app, profiles} from "src/engine/core"
  import {eventToMarkdown} from "src/true/markdown"

  let userOnly = true

  const downloadNative = async (filename, jsonl) => {
    try {
      const permissionStatus = await Filesystem.checkPermissions()

      if (permissionStatus.publicStorage !== "granted") {
        await Filesystem.requestPermissions()
      }

      await Filesystem.writeFile({
        path: `${filename}.jsonl`,
        data: jsonl,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      })

      showInfo(`File saved to your documents folder as ${filename}.jsonl`)
    } catch (error) {
      console.error("Error saving file:", error)
      showInfo("Error saving file. Please try again.")
    }
  }

  const downloadWeb = (filename, jsonl) => {
    const data = new TextEncoder().encode(jsonl)
    const blob = new Blob([data], {type: "application/octet-stream"})
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")

    a.href = url
    a.download = `${filename}.jsonl`
    a.click()

    URL.revokeObjectURL(url)
  }

  const downloadText = (filename, text) => {
    const blob = new Blob([text], {type: "text/markdown;charset=utf-8"})
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")

    a.href = url
    a.download = filename
    a.click()

    URL.revokeObjectURL(url)
  }

  const writeToDirectory = async (dir, path, text) => {
    const parts = path.split("/")
    const name = parts.pop()

    let handle = dir

    for (const part of parts) {
      handle = await handle.getDirectoryHandle(part, {create: true})
    }

    const file = await handle.getFileHandle(name, {create: true})
    const writable = await file.createWritable()

    await writable.write(text)
    await writable.close()
  }

  // Markdown export: one .md file per note/article, in notes/ and articles/ folders
  const exportMarkdown = async () => {
    const userPubkey = $app.user?.pubkey

    if (!userPubkey) return

    const events = Array.from($app.repository.query([{authors: [userPubkey]}]))
    const docs = events.map(eventToMarkdown).filter(Boolean)

    if (docs.length === 0) return showInfo("No notes or articles to export.")

    if (Capacitor.isNativePlatform()) {
      try {
        for (const doc of docs) {
          await Filesystem.writeFile({
            path: `true-sns-export/${doc.filename}`,
            data: doc.text,
            directory: Directory.Documents,
            encoding: Encoding.UTF8,
            recursive: true,
          })
        }

        showInfo(`Saved ${docs.length} files to Documents/true-sns-export`)
      } catch (error) {
        console.error("Error saving files:", error)
        showInfo("Error saving files. Please try again.")
      }
    } else if (typeof (window as any).showDirectoryPicker === "function") {
      try {
        const dir = await (window as any).showDirectoryPicker({mode: "readwrite"})

        for (const doc of docs) {
          await writeToDirectory(dir, doc.filename, doc.text)
        }

        showInfo(`Saved ${docs.length} markdown files.`)
      } catch (error) {
        if ((error as any)?.name !== "AbortError") {
          console.error("Error saving files:", error)
          showInfo("Error saving files. Please try again.")
        }
      }
    } else {
      // No folder access in this browser: fall back to a single combined file
      downloadText(
        "true-sns-export.md",
        docs.map(d => `<!-- ${d.filename} -->\n${d.text}`).join("\n\n"),
      )
    }
  }

  const submit = async () => {
    const userPubkey = $app.user?.pubkey

    if (!userPubkey) return

    const filename = $profiles.get(userPubkey)?.nip05() || userPubkey.slice(0, 16)
    const events = Array.from($app.repository.query([userOnly ? {authors: [userPubkey]} : {}]))
    const jsonl = events
      .filter(e => e.sig)
      .map(e => JSON.stringify(e))
      .join("\n")

    if (Capacitor.isNativePlatform()) {
      downloadNative(filename, jsonl)
    } else {
      downloadWeb(filename, jsonl)
    }
  }
</script>

<form on:submit|preventDefault={submit}>
  <FlexColumn>
    <div class="mb-4 flex flex-col items-center justify-center">
      <Heading>Export Settings</Heading>
      <p>Select which events you'd like to export</p>
    </div>
    <div class="flex w-full flex-col gap-8">
      <FieldInline label="Only export your events">
        <Toggle bind:value={userOnly} />
        <p slot="info">If enabled, only your events will be exported.</p>
      </FieldInline>
      <Button class="btn" type="submit">Export (JSONL, signed events)</Button>
      <Button class="btn" type="button" on:click={exportMarkdown}>Export notes as Markdown</Button>
    </div>
  </FlexColumn>
</form>
