import {derived, writable} from "svelte/store"
import {synced, localStorageProvider} from "@welshman/store"
import {DEFAULT_HOST, getSpace, parseHostConfig, resolveMode} from "src/true/spaceConfig"
import {startTranslator} from "src/true/i18n"
import type {HostConfig, SpaceMode} from "src/true/spaceConfig"

// What the host (server operator) configured, loaded from /true-host.json at startup.
export const hostConfig = writable<HostConfig>(DEFAULT_HOST)

export const loadHostConfig = async (url = "/true-host.json") => {
  try {
    const res = await fetch(url, {cache: "no-cache"})

    if (res.ok) hostConfig.set(parseHostConfig(await res.json()))
  } catch (e) {
    // No host file (or offline): keep the defaults
  }
}

// The user's own choice, only honoured when the host allows it. null = follow the host.
export const userMode = synced<SpaceMode | null>({
  key: "true/space",
  defaultValue: null,
  storage: localStorageProvider,
})

export const spaceMode = derived([hostConfig, userMode], ([$host, $user]) =>
  resolveMode($host, $user),
)

export const space = derived(spaceMode, $mode => getSpace($mode))

if (typeof window !== "undefined") {
  // Re-run the translator when the host's language is known
  hostConfig.subscribe($host => startTranslator($host.lang))

  void loadHostConfig()
}
