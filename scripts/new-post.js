/* This is a script to create a new post markdown file with front-matter */

import fs from "fs"
import path from "path"

function getDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

const args = process.argv.slice(2)

if (args.length === 0) {
  console.error(`Error: No filename argument provided
Usage: npm run new-post -- <filename>`)
  process.exit(1) // Terminate the script and return error code 1
}

let fileName = args[0]

// Add .md extension if not present
const fileExtensionRegex = /\.(md|mdx)$/i
if (!fileExtensionRegex.test(fileName)) {
  fileName += ".md"
}

const targetDir = "./src/content/posts/"
const fullPath = path.join(targetDir, fileName)

if (fs.existsSync(fullPath)) {
  console.error(`Error: File ${fullPath} already exists `)
  process.exit(1)
}

// recursive mode creates multi-level directories
const dirPath = path.dirname(fullPath)
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
}

// 默认带上本站的标签/分类体系，省得每次手填
// 标签只能是：题目 / 算法 / 数论
// 分类只能是：题解 / 算法笔记 / 数学 / 游记 / 模板 / 随笔
const content = `---
title: ${args[0]}
published: ${getDate()}
description: ''
image: ''
tags: ["题目"]
category: "题解"
draft: false
lang: ''
---
`

fs.writeFileSync(path.join(targetDir, fileName), content)

console.log(`Post ${fullPath} created`)
