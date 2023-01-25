#! /usr/bin/env node

import kit from "@johnlindquist/kit"
import { createPathResolver } from "@johnlindquist/kit/core/utils"
import { fileURLToPath } from "url"
import * as path from "path"

let scriptParentPath = createPathResolver(path.dirname(fileURLToPath(new URL(import.meta.url))))

await kit(scriptParentPath("download-node.js"))
await kit(scriptParentPath("download-kenv.js"))
