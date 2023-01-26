let kitPath = createPathResolver(home(".kit"))
let kenvPath = createPathResolver(home(".kenv"))

console.log(`Set KIT and KENV to ${kitPath()} and ${kenvPath()}`)

process.env.KIT = kitPath()
process.env.KENV = kenvPath()

console.log(`Link ${kitPath()} to ${kenvPath()}`)
await kit(kitPath("setup", "setup.js"))

console.log(`\n\n---- Write Settings ----`)
console.log({
  version: process.env.KIT_APP_VERSION,
})
await kit.writeJson(kitPath("db", "app.json"), {
  version: process.env.KIT_APP_VERSION,
  autoUpdate: true,
  tray: true,
  openAtLogin: true,
  appearance: "auto",
})

console.log(`\n\n---- Examples ----`)
await kit(kitPath("setup", "clone-examples.js"))

console.log(`\n\n---- Sponsors ----`)
await kit(kitPath("setup", "clone-sponsors.js"))
