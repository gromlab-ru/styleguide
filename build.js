const fs = require('node:fs')
const path = require('node:path')

const rootDir = __dirname
const sourceDir = path.join(rootDir, 'src')
const sourcePath = path.join(sourceDir, 'SKILL.md')
const outputDir = path.join(rootDir, 'skills', 'style-guide')
const outputPath = path.join(outputDir, 'SKILL.md')

fs.rmSync(outputDir, { recursive: true, force: true })
fs.mkdirSync(outputDir, { recursive: true })
fs.copyFileSync(sourcePath, outputPath)
fs.cpSync(path.join(sourceDir, 'references'), path.join(outputDir, 'references'), { recursive: true })

console.log(path.relative(rootDir, outputPath))
