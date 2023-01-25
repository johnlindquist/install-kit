import os from "os"
import tar from "tar"
import { rm } from "fs/promises"

let kitPath = createPathResolver(home(".kit"))

// cleanup any existing .kit directory
if (await isDir(kitPath())) {
  await rm(kitPath(), {
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

let version = process.env.KIT_APP_VERSION || "1.40.62"
let extension = "tar.gz"
let platform = process.platform === "win32" ? "Windows" : process.platform === "linux" ? "Linux" : "macOS"
let kitSDK = `Kit-SDK-${platform}-${version}-${process.arch}.${extension}`
let file = osTmpPath(kitSDK)
let url = `https://github.com/johnlindquist/kitapp/releases/latest/download/${kitSDK}`

console.log(`Downloading Kit SDK from ${url}`)
let buffer = await download(url)

console.log(`Writing node to ${file}`)
await writeFile(file, buffer)

console.log(`Ensuring ${kitPath()} exists`)
await ensureDir(kitPath())

console.log(`Beginning extraction to ${kitPath()}`)
await tar.x({
  file,
  C: kitPath(),
  strip: 1,
})

console.log(`Removing ${file}`)

await rm(file)
