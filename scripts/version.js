#!/usr/bin/env node

/**
 * 版本信息脚本
 *
 * 显示当前项目的版本信息
 *
 * 使用方式:
 *   node scripts/version.js
 */

const fs = require('fs')
const path = require('path')

// 读取 package.json
function readPackageJson(packagePath) {
  const fullPath = path.resolve(__dirname, '..', packagePath)
  try {
    const content = fs.readFileSync(fullPath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error(`❌ 读取失败: ${packagePath}`)
    return null
  }
}

console.log('\n📦 Broad SDK 版本信息\n')
console.log('=' .repeat(50))

// 根 package.json
const rootPkg = readPackageJson('package.json')
if (rootPkg) {
  console.log(`\n项目名称: ${rootPkg.name}`)
  console.log(`项目版本: ${rootPkg.version || 'N/A'}`)
}

// Web SDK
console.log('\n📱 Web SDK')
console.log('-'.repeat(50))
const webPkg = readPackageJson('packages/web-sdk/package.json')
if (webPkg) {
  console.log(`名称: ${webPkg.name}`)
  console.log(`版本: ${webPkg.version}`)
  console.log(`描述: ${webPkg.description}`)
}

// Server SDK
console.log('\n🖥️  Server SDK')
console.log('-'.repeat(50))
const serverPkg = readPackageJson('packages/server-sdk/package.json')
if (serverPkg) {
  console.log(`名称: ${serverPkg.name}`)
  console.log(`版本: ${serverPkg.version}`)
  console.log(`描述: ${serverPkg.description}`)
}

console.log('\n' + '='.repeat(50))
console.log('\n💡 提示: 使用 lerna version 统一更新版本\n')













