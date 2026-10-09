<script lang="ts">
  import {getIdOrAddress} from "@welshman/util"
  import type {TrustedEvent} from "@welshman/util"
  import {Profiles} from "@welshman/app"
  import {fromApp} from "src/engine/core"
  import {router} from "src/app/util"

  export let event: TrustedEvent

  const author = fromApp($app => $app.use(Profiles).display(event.pubkey).$)

  const title = () =>
    event.tags.find(t => t[0] === "title")?.[1] ||
    event.content.split("\n").find(l => l.trim())?.slice(0, 120) ||
    "(untitled)"

  const date = new Date(event.created_at * 1000).toLocaleDateString()

  const open = () => router.at("notes").of(getIdOrAddress(event)).open()
</script>

<button
  type="button"
  class="flex w-full cursor-pointer items-baseline justify-between gap-4 border-b border-solid border-neutral-700 px-2 py-3 text-left hover:bg-neutral-800"
  on:click={open}>
  <span class="overflow-hidden text-ellipsis whitespace-nowrap text-lg">{title()}</span>
  <span class="shrink-0 text-sm text-neutral-400">{$author} · {date}</span>
</button>
