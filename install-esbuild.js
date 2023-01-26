let kitPath = createPathResolver(home(".kit"))
let kenvPath = createPathResolver(home(".kenv"))

process.env.KIT = kitPath()
process.env.KENV = kenvPath()

console.log(`Set KIT and KENV to ${kitPath()} and ${kenvPath()}`)

console.log(`\n\n---- Installing esbuild into ${kitPath()} ----`)
await kit.exec(`npm i esbuild --save-exact --prefix ${kitPath()}`, {
  stdio: "inherit",
  env: {
    ...process.env,
    PATH: `${knodePath("bin")}${path.delimiter}${process.env.PATH}`,
  },
})
