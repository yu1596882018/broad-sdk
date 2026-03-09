#!/usr/bin/env node

/**
 * 清理构建产物和依赖
 *
 * 使用方式:
 *   node scripts/clean.js
 *   node scripts/clean.js --all  (包括 node_modules)
 */

const fs = require('fs')
const path = require('path')

const shouldCleanAll = process.argv.includes('--all')

// 要清理的目录
const dirsToClean = [
  'packages/web-sdk/lib',
  'packages/web-sdk/es',
  'packages/server-sdk/lib',
]

// 包括 node_modules
if (shouldCleanAll) {
  dirsToClean.push(
    'node_modules',
    'packages/web-sdk/node_modules',
    'packages/server-sdk/node_modules'
  )
}

/**
 * 递归删除目录
 */
function removeDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return
  }

  console.log(`🗑️  删除: ${dirPath}`)

  try {
    fs.rmSync(dirPath, { recursive: true, force: true })
    console.log(`✅  已删除: ${dirPath}`)
  } catch (error) {
    console.error(`❌  删除失败: ${dirPath}`, error.message)
  }
}

console.log('🧹 开始清理...\n')

dirsToClean.forEach(dir => {
  const fullPath = path.resolve(__dirname, '..', dir)
  removeDir(fullPath)
})

console.log('\n✨ 清理完成！')

if (shouldCleanAll) {
  console.log('\n💡 提示: 请运行 yarn install 重新安装依赖')
}













