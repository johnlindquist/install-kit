import os from "os"
import tar from "tar"
import StreamZip from "node-stream-zip"
import { rm } from "fs/promises"
import { HttpsProxyAgent } from "hpagent"

let knodePath = createPathResolver(process.env.KNODE || home(".knode"))
// cleanup any existing knode directory
if (await isDir(knodePath())) {
  await rm(knodePath(), {
    recursive: true,
    force: true,
  })
}

let osTmpPath = createPathResolver(os.tmpdir())

let getInfo = async () => {
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

  return info
}

let version = process.env.NODE_VERSION || (await getInfo()).node
let extension = process.platform === "win32" ? "zip" : "tar.gz"

// download node v16.7.1 based on the current platform and architecture
// Examples:
// Mac arm64: https://nodejs.org/dist/v18.12.1/node-v18.12.1-darwin-arm64.tar.gz
// Linux x64: https://nodejs.org/dist/v18.12.1/node-v18.12.1-linux-x64.tar.gz
// Windows x64: https://nodejs.org/dist/v18.12.1/node-v18.12.1-win-x64.zip

// Node dist url uses "win", not "win32"
let platform = process.platform === "win32" ? "win" : process.platform
let node = `node-v${version}-${platform}-${process.arch}.${extension}`
let file = osTmpPath(node)
let url = `https://nodejs.org/dist/v${version}/${node}`

console.log(`Downloading node from ${url}`)
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
  // node-18.12.1-win-x64
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
