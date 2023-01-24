#! /usr/bin/env node

import kit from "@johnlindquist/kit"
import { createPathResolver } from "@johnlindquist/kit/core/utils"

import * as path from "path"

let currentDir = createPathResolver(path.dirname(new URL(import.meta.url).pathname))

await kit(currentDir("download-node.js"))
