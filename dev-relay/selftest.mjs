import WebSocket from "ws"
import {generateSecretKey, finalizeEvent} from "nostr-tools/pure"

const sk = generateSecretKey()
const mk = (kind, content, tags = []) => finalizeEvent({kind, created_at: Math.floor(Date.now() / 1000), tags, content}, sk)
const ws = new WebSocket("ws://localhost:7777")
const got = []

const wait = ms => new Promise(r => setTimeout(r, ms))

ws.on("message", m => got.push(JSON.parse(m.toString())))
await new Promise(r => ws.on("open", r))

const a1 = mk(30023, "v1", [["d", "x"], ["title", "t"]])
ws.send(JSON.stringify(["EVENT", a1]))
await wait(100)
const bad = {...mk(1, "hi"), content: "tampered"}
ws.send(JSON.stringify(["EVENT", bad]))
await wait(1100)
const a2 = mk(30023, "v2", [["d", "x"], ["title", "t2"]])
ws.send(JSON.stringify(["EVENT", a2]))
await wait(100)
ws.send(JSON.stringify(["REQ", "s", {kinds: [30023]}]))
await wait(200)

const evs = got.filter(m => m[0] === "EVENT").map(m => m[2].content)
const oks = got.filter(m => m[0] === "OK").map(m => m[2])
console.log(JSON.stringify({oks, evs, eose: got.some(m => m[0] === "EOSE")}))
ws.close()
