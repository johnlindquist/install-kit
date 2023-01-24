import os from "os"
import { createPathResolver, knodePath } from "@johnlindquist/kit/core/utils"
import tar from "tar"

let osTmpPath = createPathResolver(os.tmpdir())

let version = `16.17.1`
let extension = process.platform === "win32" ? "zip" : "tar.gz"

// download node v16.7.1 based on the current platform and architecture
// account for .zip on windows
// Examples:
// Mac arm64: https://nodejs.org/dist/v16.17.1/node-v16.17.1-darwin-arm64.tar.gz
// Linux x64: https://nodejs.org/dist/v16.17.1/node-v16.17.1-linux-x64.tar.gz
// Windows x64: https://nodejs.org/dist/v16.17.1/node-v16.17.1-win-x64.zip
let file = osTmpPath(`node-${version}-${process.platform}-${process.arch}.${extension}`)
let url = `https://nodejs.org/dist/v${version}/node-v${version}-${process.platform}-${process.arch}.${extension}`

console.log(`Downloading node from ${url}`)
let buffer = await download(url)

console.log(`Writing node to ${file}`)
await writeFile(file, buffer)

console.log(`Ensuring ${knodePath()} exists`)
await ensureDir(knodePath())
console.log(`Beginning extraction to ${home(`.knode`)}`)

// if mac or linux, extract the tar.gz
if (process.platform === "win32") {
  const zip = new StreamZip.async({ file })

  await zip.extract(null, knodePath("bin"))
  await zip.close()
} else {
  await tar.x({
    file,
    C: knodePath(),
    strip: 1,
  })
}
