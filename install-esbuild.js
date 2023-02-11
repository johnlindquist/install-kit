process.env.KIT ||= home(".kit")
process.env.KENV ||= home(".kenv")

let kitPath = createPathResolver(process.env.KIT)
let kenvPath = createPathResolver(process.env.KENV)

console.log(`Set KIT and KENV to ${kitPath()} and ${kenvPath()}`)

console.log(`\n\n---- Installing esbuild into ${kitPath()} ----`)
await kit.exec(`npm i esbuild --save-exact --prefix ${kitPath()}`, {
  stdio: "inherit",
  cwd: kitPath(),
  env: {
    ...process.env,
    PATH: `${knodePath("bin")}${path.delimiter}${process.env.PATH}`,
  },
})
