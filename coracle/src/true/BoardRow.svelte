<script lang="ts">
  import {getIdOrAddress, getReplyFilters, inbox} from "@welshman/util"
  import type {TrustedEvent} from "@welshman/util"
  import {Profiles} from "@welshman/app"
  import {onMount} from "svelte"
  import {derived} from "svelte/store"
  import {noop} from "@welshman/lib"
  import {deriveEvents, fromApp, resolveRelays} from "src/engine/core"
  import {myRequest} from "src/engine"
  import {replyKinds} from "src/util/nostr"
  import {router} from "src/app/util"

  export let event: TrustedEvent

  const author = fromApp($app => $app.use(Profiles).display(event.pubkey).$)

  // A board is about discussion, so each row shows how many replies the post has
  const replyCount = derived(
    deriveEvents(getReplyFilters([event], {kinds: replyKinds})),
    $events => $events.length,
  )

  // Replies live on relays, not necessarily in the local store yet, so ask for them
  onMount(async () => {
    myRequest({
      autoClose: true,
      relays: await resolveRelays([inbox(event.pubkey)]),
      filters: getReplyFilters([event], {kinds: replyKinds}),
    }).catch(noop)
  })

  const title = () =>
    event.tags.find(t => t[0] === "title")?.[1] ||
    event.content.split("\n").find(l => l.trim())?.slice(0, 120) ||
    "(untitled)"

  const date = new Date(event.created_at * 1000).toLocaleDateString()

  const open = () => router.at("notes").of(getIdOrAddress(event)).open()
</script>

<button
  type="button"
  class="flex w-full cursor-pointer items-baseline gap-4 border-b border-solid border-neutral-700 px-2 py-3 text-left hover:bg-neutral-800"
  on:click={open}>
  <span class="flex-grow overflow-hidden text-ellipsis whitespace-nowrap text-lg">{title()}</span>
  {#if $replyCount > 0}
    <span class="shrink-0 rounded bg-neutral-700 px-2 text-sm">{`Replies: ${$replyCount}`}</span>
  {/if}
  <span class="shrink-0 text-sm text-neutral-400">{$author} · {date}</span>
</button>
