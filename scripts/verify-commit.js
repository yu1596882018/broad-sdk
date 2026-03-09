#!/usr/bin/env node

/**
 * Git commit 信息验证脚本
 *
 * 验证 commit 信息是否符合 Conventional Commits 规范
 *
 * 格式: <type>(<scope>): <subject>
 *
 * type: feat, fix, docs, style, refactor, perf, test, chore
 */

const fs = require('fs')
const chalk = require('chalk') || { red: (s) => s, green: (s) => s, yellow: (s) => s }

const msgPath = process.env.GIT_PARAMS || '.git/COMMIT_EDITMSG'
const msg = fs.readFileSync(msgPath, 'utf-8').trim()

const commitRE = /^(feat|fix|docs|style|refactor|perf|test|chore|revert)(\(.+\))?: .{1,50}/

if (!commitRE.test(msg)) {
  console.log()
  console.log(chalk.red('  ❌ Commit 信息不符合规范！'))
  console.log()
  console.log(chalk.yellow('  正确格式: <type>(<scope>): <subject>'))
  console.log()
  console.log(chalk.yellow('  示例:'))
  console.log(chalk.green('    feat(web-sdk): 添加网络速度监控'))
  console.log(chalk.green('    fix(server-sdk): 修复 ES 连接问题'))
  console.log(chalk.green('    docs: 更新 API 文档'))
  console.log()
  console.log(chalk.yellow('  允许的 type:'))
  console.log('    feat:     新功能')
  console.log('    fix:      Bug 修复')
  console.log('    docs:     文档更新')
  console.log('    style:    代码格式调整')
  console.log('    refactor: 重构')
  console.log('    perf:     性能优化')
  console.log('    test:     测试相关')
  console.log('    chore:    构建/工具变动')
  console.log()
  process.exit(1)
}

console.log(chalk.green('✅ Commit 信息验证通过'))













