let kitPath = createPathResolver(process.env.KIT || home(".kit"))
let kenvPath = createPathResolver(process.env.KENV || home(".kenv"))

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
try {
  await kit(kitPath("setup", "clone-examples.js"))
} catch (error) {
  console.log(error)
}

console.log(`\n\n---- Sponsors ----`)
try {
  await kit(kitPath("setup", "clone-sponsors.js"))
} catch (error) {
  console.log(error)
}
