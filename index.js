#! /usr/bin/env node

import { get } from "@johnlindquist/globals"
import kit from "@johnlindquist/kit"
import { createPathResolver } from "@johnlindquist/kit/core/utils"
import { fileURLToPath } from "url"
import * as path from "path"

process.env.NODE_VERSION ||= "16.17.1"
process.env.KIT_APP_VERSION ||= await get(`https://api.github.com/repos/johnlindquist/kitapp/releases/latest`).then(
  res => res.data.tag_name.replace("v", "")
)

console.log(`Setting up Kit SDK for Kit app version: ${process.env.KIT_APP_VERSION}`)

let scriptParentPath = createPathResolver(path.dirname(fileURLToPath(new URL(import.meta.url))))

console.log(`\n\n---- Installing Node ----`)
await kit(scriptParentPath("download-node.js"))

console.log(`\n\n---- Installing Kenv ----`)
await kit(scriptParentPath("download-kenv.js"))

console.log(`\n\n---- Installing Kit ----`)
await kit(scriptParentPath("download-kit.js"))

let kitPath = createPathResolver(home(".kit"))
let kenvPath = createPathResolver(home(".kenv"))

process.env.KIT = kitPath()
process.env.KENV = kenvPath()

console.log(`\n\n---- Installing esbuild into ${kitPath()} ----`)
await kit.exec(`npm i esbuild --save-exact --prefix ${kitPath()}`, {
  stdio: "inherit",
  env: {
    ...process.env,
    PATH: `${knodePath("bin")}${path.delimiter}${process.env.PATH}`,
  },
})

console.log(`\n\n---- Setup Scripts ----`)
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
