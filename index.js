#! /usr/bin/env node

import kit from "@johnlindquist/kit"
import { createPathResolver } from "@johnlindquist/kit/core/utils"
import { fileURLToPath } from "url"
import * as path from "path"

let thisDir = path.dirname(fileURLToPath(new URL(import.meta.url)))
let currentDir = createPathResolver(thisDir)
let scriptPath = currentDir("download-node.js")

await kit(scriptPath)
