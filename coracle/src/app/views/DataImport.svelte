<script lang="ts">
  import type {TrustedEvent} from "@welshman/util"
  import {isSignedEvent} from "@welshman/util"
  import {error} from "src/util/logger"
  import {appName} from "src/partials/state"
  import {showInfo, showWarning} from "src/partials/Toast.svelte"
  import Field from "src/partials/Field.svelte"
  import Button from "src/partials/Button.svelte"
  import FlexColumn from "src/partials/FlexColumn.svelte"
  import Heading from "src/partials/Heading.svelte"
  import {router} from "src/app/util/router"
  import {app} from "src/engine/core"
  import {sign} from "src/engine"
  import {markdownToTemplate} from "src/true/markdown"

  const setFiles = e => {
    files = Array.from(e.target.files || [])
  }

  const isMarkdown = (f: File) => f.name.toLowerCase().endsWith(".md")

  // Markdown files are signed with the current user's key and saved locally (not broadcast)
  const importMarkdown = async (mdFiles: File[]) => {
    if (!$app.user) {
      showWarning("Log in to import Markdown (notes are signed with your key).")

      return 0
    }

    let count = 0

    for (const f of mdFiles) {
      const template = markdownToTemplate(await f.text(), f.name.replace(/\.md$/i, ""))

      if (!template.content) continue

      $app.repository.publish(await sign(template))
      count++
    }

    return count
  }

  const importJsonl = (file: File) => {
    const reader = new FileReader()

    reader.onload = async loadEvent => {
      try {
        const data = new Uint8Array(loadEvent.target.result as ArrayBuffer)
        const jsonl = new TextDecoder().decode(data).split("\n")
        const newEvents: TrustedEvent[] = []

        for (let i = 0; i < jsonl.length; i++) {
          const l = jsonl[i]

          if (l) {
            try {
              newEvents.push(JSON.parse(l))
            } catch (e) {
              showInfo(`Failed to parse row #${i}`)
              loading = false
              return
            }
          }
        }

        for (const event of newEvents) {
          if (isSignedEvent(event)) {
            $app.repository.publish(event)
          }
        }

        showInfo("Import complete!")

        setTimeout(() => router.clearModals(), 2000)
      } catch (e) {
        error(e)

        showWarning("Something went wrong!")
      }

      loading = false
    }

    reader.readAsArrayBuffer(file)
  }

  const submit = () => {
    if (files.length === 0) {
      showWarning("Please select a file to import.")

      return
    }

    loading = true

    showInfo("Processing your import...", {timeout: 60_000})

    const jsonlFile = files.find(f => !isMarkdown(f))

    if (jsonlFile) {
      importJsonl(jsonlFile)

      return
    }

    importMarkdown(files)
      .then(count => {
        showInfo(`Imported ${count} Markdown file(s).`)

        setTimeout(() => router.clearModals(), 2000)
      })
      .catch(e => {
        error(e)

        showWarning("Something went wrong!")
      })
      .finally(() => {
        loading = false
      })
  }

  let loading
  let files: File[] = []
</script>

<form on:submit|preventDefault={submit}>
  <FlexColumn>
    <div class="mb-4 flex flex-col items-center justify-center">
      <Heading>Import Data</Heading>
      <p>Populate {appName}'s database with a nostr export file or Markdown notes</p>
    </div>
    <div class="flex w-full flex-col gap-8">
      <Field label="">
        <input type="file" on:change={setFiles} accept=".jsonl,.md" multiple />
        <p slot="info">
          Nostr exports are .jsonl files. Some software may compress exports, be sure to upload an
          uncompressed version. Markdown (.md) files are signed with your key and saved locally.
        </p>
      </Field>
      <Button {loading} class="btn text-center" type="submit">Import</Button>
    </div>
  </FlexColumn>
</form>
