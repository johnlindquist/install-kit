import kit from "@johnlindquist/kit"
import { createPathResolver } from "@johnlindquist/kit/core/utils"
import { fileURLToPath } from "url"
import * as path from "path"

if (!process.env.NODE_VERSION) {
  console.error("NODE_VERSION is not set")
  process.exit(1)
}

if (!process.env.KIT_APP_VERSION) {
  console.error("KIT_APP_VERSION is not set")
  process.exit(1)
}

console.log(`Setting up Kit SDK for Kit app version: ${process.env.KIT_APP_VERSION}`)

let scriptParentPath = createPathResolver(path.dirname(fileURLToPath(new URL(import.meta.url))))

export let downloadKit = async () => {
  await kit(scriptParentPath("download-node.js"))
}

export let downloadKenv = async () => {
  await kit(scriptParentPath("download-kenv.js"))
}

export let downloadNode = async () => {
  await kit(scriptParentPath("download-kit.js"))
}

export let installEsbuild = async () => {
  await kit(scriptParentPath("install-esbuild.js"))
}

export let setup = async () => {
  await kit(scriptParentPath("setup.js"))
}
