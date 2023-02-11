#! /usr/bin/env node

import { get } from "@johnlindquist/globals"
import kit from "@johnlindquist/kit"
import { createPathResolver } from "@johnlindquist/kit/core/utils"
import { fileURLToPath } from "url"
import * as path from "path"

let kitappRepoLatestUrl = `https://github.com/johnlindquist/kitapp/releases/latest`
let githubLatestResponse = await get(kitappRepoLatestUrl)
let resolvedUrl = githubLatestResponse.request.path
let tag = resolvedUrl.split("/").at(-1)

let rawPackageJsonUrl = `https://raw.githubusercontent.com/johnlindquist/kitapp/${tag}/package.json`

let packageJsonResponse = await get(rawPackageJsonUrl)
let packageJson = packageJsonResponse.data

let electronVersion = packageJson.devDependencies.electron

let electronReleasesUrl = `https://releases.electronjs.org/releases.json`
let electronReleasesResponse = await get(electronReleasesUrl)
let electronReleases = electronReleasesResponse.data

let info = electronReleases.find(release => release.version === electronVersion)

process.env.NODE_VERSION ||= info.node
process.env.KIT_APP_VERSION ||= tag.replace("v", "")

// read package.json to get version
let pkg = await readFile(new URL("./package.json", import.meta.url), "utf-8").then(res => JSON.parse(res))

console.log(`Using @johnlindquist/install-kit version: ${pkg.version}`)
console.log(
  `Setting up Kit SDK for Kit app version: ${process.env.KIT_APP_VERSION} using Node version: ${process.env.NODE_VERSION}`
)

let scriptParentPath = createPathResolver(path.dirname(fileURLToPath(new URL(import.meta.url))))

console.log(`\n\n---- Installing Node ----`)
await kit(scriptParentPath("download-node.js"))

console.log(`\n\n---- Installing Kit ----`)
await kit(scriptParentPath("download-kit.js"))

console.log(`\n\n---- Installing Kenv ----`)
await kit(scriptParentPath("download-kenv.js"))

console.log(`\n\n---- Installing esbuild ----`)
await kit(scriptParentPath("install-esbuild.js"))

console.log(`\n\n---- Setup Scripts ----`)
await kit(scriptParentPath("setup.js"))
