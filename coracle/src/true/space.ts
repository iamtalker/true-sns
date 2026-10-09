import {derived} from "svelte/store"
import {synced, localStorageProvider} from "@welshman/store"
import {DEFAULT_SPACE, getSpace} from "src/true/spaceConfig"
import type {SpaceMode} from "src/true/spaceConfig"

// For now the space mode is a per-device setting. A host-level config (shared by everyone
// using a given server) can later replace this store without touching the views.
export const spaceMode = synced<SpaceMode>({
  key: "true/space",
  defaultValue: DEFAULT_SPACE,
  storage: localStorageProvider,
})

export const space = derived(spaceMode, $mode => getSpace($mode))
