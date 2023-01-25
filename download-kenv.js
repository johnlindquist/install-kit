import os from "os"
import { kenvPath } from "@johnlindquist/kit/core/utils"
import StreamZip from "node-stream-zip"
import { rm } from "fs/promises"

// cleanup any existing knode directory
if (await isDir(kenvPath())) {
  console.log(`${kenvPath()} already exists. Skipping download.`)
  process.exit(0)
  // Todo: Maybe prompt to delete?
  // await rm(kenvPath(), {
  //   recursive: true,
  //   force: true,
  // })
}

let osTmpPath = createPathResolver(os.tmpdir())

let fileName = `kenv.zip`
let file = osTmpPath(fileName)
let url = `https://github.com/johnlindquist/kenv/releases/latest/download/${fileName}`

console.log(`Downloading node from ${url}`)
let buffer = await download(url)

console.log(`Writing node to ${file}`)
await writeFile(file, buffer)

const zip = new StreamZip.async({ file })

console.log(`Extacting ${fileName} to ${kenvPath()}`)

await ensureDir(kenvPath())
await zip.extract("kenv", kenvPath())
await zip.close()

console.log(`Removing ${file}`)

await rm(file)
