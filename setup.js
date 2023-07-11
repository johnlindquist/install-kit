import os from "os"
import { stat } from "fs/promises"

let home = createPathResolver(os.homedir())

process.env.KIT = process.argv?.["--kitPath"] || home(".kit")
process.env.KENV = process.argv?.["--kenvPath"] || home(".kenv")

let kitPath = createPathResolver(process.env.KIT)
let kenvPath = createPathResolver(process.env.KENV)
let isFile = async filePath => {
  let exists = false
  try {
    exists = (await stat(filePath)).isFile()
  } catch (e) {
    exists = false
  }

  return exists
}

console.log(`Set KIT and KENV to ${kitPath()} and ${kenvPath()}`)

// Check if kenvPath(".env") exists and if not, create it using setup/create-env.js
let envExists = await isFile(kenvPath(".env"))
if (!envExists) {
  console.log(`\n\n---- Creating ${kenvPath(".env")} ----`)
  await kit(kenvPath("setup", "create-env.js"))
}

console.log(`Link ${kitPath()} to ${kenvPath()}`)
await kit(kitPath("setup", "chmod-helpers.js"))

await kit.exec(`${knodePath("bin", "npm")} i ${kitPath()} --save-exact --prefix ${kenvPath()}`, {
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
