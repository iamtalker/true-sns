<script lang="ts">
  import {pubkey} from "src/engine/core"
  import Button from "src/partials/Button.svelte"
  import Feed from "src/app/shared/Feed.svelte"
  import {router} from "src/app/util/router"
  import {defaultFeed} from "src/engine"
  import {hostConfig, spaceMode, userMode} from "src/true/space"
  import {SPACES, SPACE_MODES} from "src/true/spaceConfig"

  export let feed = null

  const showLogin = () => router.at("login").open()

  const initialFeed = feed || $defaultFeed

  document.title = "Feeds"
</script>

{#if !$pubkey}
  <div class="py-16 text-center">
    <p class="text-xl">Don't have an account?</p>
    <p>
      Click <Button
        class="text-inherit cursor-pointer bg-transparent p-0 underline"
        on:click={showLogin}>here</Button> to join the nostr network.
    </p>
  </div>
{/if}

{#if $hostConfig.allowUserMode}
  <div class="mb-4 flex gap-2 xl:-ml-40 xl:mr-40">
    {#each SPACE_MODES as mode}
      <Button
        class={$spaceMode === mode ? "btn btn-accent" : "btn btn-low"}
        on:click={() => userMode.set(mode)}>
        {SPACES[mode].label}
      </Button>
    {/each}
  </div>
  <p class="mb-4 text-sm text-neutral-400 xl:-ml-40 xl:mr-40">{SPACES[$spaceMode].description}</p>
{/if}

<div class="xl:-ml-40 xl:mr-40">
  <Feed showControls feed={initialFeed} />
</div>
