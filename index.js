#! /usr/bin/env node

import kit from "@johnlindquist/kit"

import * as path from "path"
const currentScriptUrl = import.meta.url
const currentScriptPath = path.dirname(currentScriptUrl.replace("file://", ""))
process.chdir(currentScriptPath)

await kit("download-node")
