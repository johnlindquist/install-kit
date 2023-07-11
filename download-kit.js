import os from "os"
import tar from "tar"
import { rm } from "fs/promises"
import { HttpsProxyAgent } from "hpagent"

let home = createPathResolver(os.homedir())
process.env.KIT = process.argv?.["--kitPath"] || home(".kit")
let kitTargetPath = createPathResolver(process.env.KIT)

// cleanup any existing .kit directory
if (await isDir(kitTargetPath())) {
  await rm(kitTargetPath(), {
    recursive: true,
    force: true,
  })
}

let osTmpPath = createPathResolver(os.tmpdir())

// Download Kit SDK based on the current platform and architecture
// Examples:
// Mac arm64: https://github.com/johnlindquist/kitapp/releases/download/v1.40.62/Kit-SDK-macOS-1.40.62-arm64.tar.gz
// Linux x64: https://github.com/johnlindquist/kitapp/releases/download/v1.40.62/Kit-SDK-Linux-1.40.62-x64.tar.gz
// Windows x64: https://github.com/johnlindquist/kitapp/releases/download/v1.40.62/Kit-SDK-Windows-1.40.62-x64.tar.gz
// Mac arm64: https://github.com/johnlindquist/kitapp/releases/download/v1.40.62/Kit-SDK-macOS-1.40.62-arm64.tar.gz

let getTag = async () => {
  let kitappRepoLatestUrl = `https://github.com/johnlindquist/kitapp/releases/latest`
  let githubLatestResponse = await get(kitappRepoLatestUrl)
  let resolvedUrl = githubLatestResponse.request.path
  let tag = resolvedUrl.split("/").at(-1)

  return tag.replace("v", "")
}

let version = process.env.KIT_APP_VERSION || (await getTag())
let extension = "tar.gz"
let platform = process.platform === "win32" ? "Windows" : process.platform === "linux" ? "Linux" : "macOS"
let kitSDK = `Kit-SDK-${platform}-${version}-${process.arch}.${extension}`
let file = osTmpPath(kitSDK)
let url = `https://github.com/johnlindquist/kitapp/releases/latest/download/${kitSDK}`

console.log(`Downloading Kit SDK from ${url}`)
let options = { insecure: true, rejectUnauthorized: false }

let proxy = process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy
if (proxy) {
  console.log(`Using proxy: ${proxy}`)
  options.agent = new HttpsProxyAgent({
    keepAlive: true,
    keepAliveMsecs: 1000,
    maxSockets: 256,
    maxFreeSockets: 256,
    scheduling: "lifo",
    proxy,
  })
}

let buffer = await download(url, undefined, options)

console.log(`Writing kit to ${file}`)
await writeFile(file, buffer)

console.log(`Ensuring ${kitTargetPath()} exists`)
await ensureDir(kitTargetPath())

console.log(`Beginning extraction to ${kitTargetPath()}`)
await tar.x({
  file,
  C: kitTargetPath(),
  strip: 1,
})

console.log(`Removing ${file}`)

await rm(file)
