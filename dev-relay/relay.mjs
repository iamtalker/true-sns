// Minimal in-memory nostr relay (NIP-01) for local development and tests.
// Verifies signatures, supports replaceable (0,3,1xxxx) and addressable (3xxxx) events,
// and kind 5 deletions by id. Data is lost on exit. Not for production: use strfry.
import http from "node:http"
import {WebSocketServer} from "ws"
import {verifyEvent} from "nostr-tools/pure"

const PORT = Number(process.env.PORT || 7777)
const events = new Map() // id -> event
const subs = new Map() // ws -> Map(subId -> filters)

const isReplaceable = k => k === 0 || k === 3 || (k >= 10000 && k < 20000)
const isAddressable = k => k >= 30000 && k < 40000
const dTag = e => e.tags.find(t => t[0] === "d")?.[1] ?? ""

const matches = (e, f) => {
  if (f.ids && !f.ids.some(i => e.id.startsWith(i))) return false
  if (f.authors && !f.authors.some(a => e.pubkey.startsWith(a))) return false
  if (f.kinds && !f.kinds.includes(e.kind)) return false
  if (f.since && e.created_at < f.since) return false
  if (f.until && e.created_at > f.until) return false
  for (const [k, v] of Object.entries(f)) {
    if (k[0] === "#" && !e.tags.some(t => t[0] === k.slice(1) && v.includes(t[1]))) return false
  }
  return true
}

const store = e => {
  if (e.kind === 5) {
    for (const t of e.tags) {
      const old = t[0] === "e" && events.get(t[1])
      if (old && old.pubkey === e.pubkey) events.delete(old.id)
    }
  }

  if (isReplaceable(e.kind) || isAddressable(e.kind)) {
    for (const old of events.values()) {
      if (
        old.pubkey === e.pubkey &&
        old.kind === e.kind &&
        (!isAddressable(e.kind) || dTag(old) === dTag(e))
      ) {
        if (old.created_at >= e.created_at) return false
        events.delete(old.id)
      }
    }
  }

  events.set(e.id, e)

  return true
}

const send = (ws, msg) => ws.readyState === 1 && ws.send(JSON.stringify(msg))

// NIP-11 relay information document (browsers fetch it, so it needs CORS headers)
const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "content-type": "application/nostr+json",
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "*",
  })
  res.end(JSON.stringify({name: "true-sns dev relay", supported_nips: [1, 11], software: "dev-relay"}))
})

const wss = new WebSocketServer({server})

server.listen(PORT)

wss.on("connection", ws => {
  if (process.env.VERBOSE) console.log("connection")
  subs.set(ws, new Map())

  ws.on("message", raw => {
    let msg

    try {
      msg = JSON.parse(raw.toString())
    } catch {
      return send(ws, ["NOTICE", "invalid json"])
    }

    const [type, a, ...rest] = msg
    if (process.env.VERBOSE) console.log("<-", type, JSON.stringify(type === "REQ" ? rest : a)?.slice(0, 220))

    if (type === "EVENT") {
      if (!verifyEvent(a)) return send(ws, ["OK", a?.id, false, "invalid: bad signature"])
      if (events.has(a.id)) return send(ws, ["OK", a.id, true, "duplicate:"])

      const ok = store(a)

      send(ws, ["OK", a.id, ok, ok ? "" : "replaced: newer event exists"])

      if (ok) {
        for (const [client, s] of subs) {
          for (const [id, filters] of s) {
            if (filters.some(f => matches(a, f))) send(client, ["EVENT", id, a])
          }
        }
      }
    } else if (type === "REQ") {
      subs.get(ws).set(a, rest)

      for (const e of [...events.values()].sort((x, y) => y.created_at - x.created_at)) {
        for (const f of rest) {
          if (matches(e, f)) {
            send(ws, ["EVENT", a, e])
            break
          }
        }
      }

      send(ws, ["EOSE", a])
    } else if (type === "CLOSE") {
      subs.get(ws).delete(a)
    }
  })

  ws.on("close", () => subs.delete(ws))
})

console.log(`dev relay listening on ws://localhost:${PORT}`)
