<script lang="ts">
  import {getIdOrAddress} from "@welshman/util"
  import type {TrustedEvent} from "@welshman/util"
  import {router} from "src/app/util"
  import {readingMinutes, summarize} from "src/true/blog"

  export let event: TrustedEvent

  const tag = (name: string) => event.tags.find(t => t[0] === name)?.[1]

  const title = tag("title") || "(untitled)"
  const summary = summarize(tag("summary"), event.content)
  const minutes = readingMinutes(event.content)
  const date = new Date(event.created_at * 1000).toLocaleDateString()

  const open = () => router.at("notes").of(getIdOrAddress(event)).open()
</script>

<!-- A blog is for reading: big title, a short summary, and how long the post takes -->
<button
  type="button"
  class="flex w-full cursor-pointer flex-col gap-2 border-b border-solid border-neutral-700 px-2 py-6 text-left hover:bg-neutral-800"
  on:click={open}>
  <span class="text-sm text-neutral-400">{date} · {`${minutes} min read`}</span>
  <span class="text-3xl font-bold">{title}</span>
  {#if summary}
    <span class="text-neutral-300">{summary}</span>
  {/if}
</button>
