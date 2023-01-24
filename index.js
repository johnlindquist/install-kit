#! /usr/bin/env node

import kit from "@johnlindquist/kit"
import { createPathResolver } from "@johnlindquist/kit/core/utils"

import * as path from "path"
const currentScriptUrl = import.meta.url
const currentScriptPath = path.dirname(currentScriptUrl.replace("file://", ""))

let currentDir = createPathResolver(currentScriptPath)

await kit(currentDir("download-node.js"))
