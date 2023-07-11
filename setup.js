import os from "os"

let home = createPathResolver(os.homedir())

process.env.KIT ||= home(".kit")
process.env.KENV ||= home(".kenv")

let kitPath = createPathResolver(process.env.KIT)
let kenvPath = createPathResolver(process.env.KENV)

console.log(`Set KIT and KENV to ${kitPath()} and ${kenvPath()}`)

console.log(`Link ${kitPath()} to ${kenvPath()}`)
await kit(kitPath("setup", "setup.js"))

await kit.exec(`${knodePath("bin", "npm")} i ${kitPath()} --save-exact --prefix ${kitTargetPath()}`, {
  stdio: "inherit",
  cwd: kenvPath(),
  env: {
    ...process.env,
    PATH: `${knodePath("bin")}${path.delimiter}${process.env.PATH}`,
  },
})

// console.log(`\n\n---- Write Settings ----`)
// console.log({
//   version: process.env.KIT_APP_VERSION,
// })
// await kit.writeJson(kitPath("db", "app.json"), {
//   version: process.env.KIT_APP_VERSION,
//   autoUpdate: true,
//   tray: true,
//   openAtLogin: true,
//   appearance: "auto",
// })

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
