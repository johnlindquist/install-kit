import os from "os"
import { createPathResolver, knodePath } from "@johnlindquist/kit/core/utils"
import tar from "tar"
import StreamZip from "node-stream-zip"
import { rm } from "fs/promises"

// cleanup any existing knode directory
if (await isDir(knodePath())) {
  await rm(knodePath(), {
    recursive: true,
    force: true,
  })
}

let osTmpPath = createPathResolver(os.tmpdir())

let version = `16.17.1`
let extension = process.platform === "win32" ? "zip" : "tar.gz"

// download node v16.7.1 based on the current platform and architecture
// Examples:
// Mac arm64: https://nodejs.org/dist/v16.17.1/node-v16.17.1-darwin-arm64.tar.gz
// Linux x64: https://nodejs.org/dist/v16.17.1/node-v16.17.1-linux-x64.tar.gz
// Windows x64: https://nodejs.org/dist/v16.17.1/node-v16.17.1-win-x64.zip

// Node dist url uses "win", not "win32"
let platform = process.platform === "win32" ? "win" : process.platform
let node = `node-v${version}-${platform}-${process.arch}.${extension}`
let file = osTmpPath(node)
let url = `https://nodejs.org/dist/v${version}/${node}`

console.log(`Downloading node from ${url}`)
let buffer = await download(url)

console.log(`Writing node to ${file}`)
await writeFile(file, buffer)

console.log(`Ensuring ${knodePath()} exists`)
await ensureDir(knodePath())
console.log(`Beginning extraction to ${home(`.knode`)}`)

// if mac or linux, extract the tar.gz
if (platform === "win") {
  const zip = new StreamZip.async({ file })

  let fileName = path.parse(node).name
  console.log(`Extacting ${fileName} to ${knodePath("bin")}`)
  // node-16.17.1-win-x64
  await zip.extract(fileName, knodePath("bin"))
  await zip.close()
} else {
  await tar.x({
    file,
    C: knodePath(),
    strip: 1,
  })
}

console.log(`Removing ${file}`)

await rm(file)
