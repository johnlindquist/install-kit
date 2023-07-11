import os from "os"

let home = createPathResolver(os.homedir())

console.log(`\n\n Home detected as ${home()}`)

process.env.KIT ||= home(".kit")
process.env.KENV ||= home(".kenv")

let kitTargetPath = createPathResolver(process.env.KIT)
let kenvTargetPath = createPathResolver(process.env.KENV)

console.log(`Set KIT and KENV to ${kitTargetPath()} and ${kenvTargetPath()}`)

console.log(`\n\n---- Installing esbuild into ${kitTargetPath()} ----`)
await kit.exec(`${knodePath("bin", "npm")} i esbuild --save-exact --prefix ${kitTargetPath()}`, {
  stdio: "inherit",
  cwd: kitTargetPath(),
  env: {
    ...process.env,
    PATH: `${knodePath("bin")}${path.delimiter}${process.env.PATH}`,
  },
})
