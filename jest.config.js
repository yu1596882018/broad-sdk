/**
 * Jest 配置文件
 *
 * 如果要添加单元测试，可以使用此配置
 *
 * 安装依赖:
 *   yarn add -D jest @types/jest
 *
 * 运行测试:
 *   yarn test
 */

module.exports = {
  // 测试环境
  testEnvironment: 'jsdom',

  // 测试文件匹配规则
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],

  // 覆盖率收集
  collectCoverageFrom: [
    'packages/*/src/**/*.js',
    'packages/*/utils/**/*.js',
    '!**/node_modules/**',
    '!**/lib/**',
    '!**/es/**',
    '!**/*.config.js'
  ],

  // 覆盖率阈值
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  },

  // 模块路径映射
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/packages/web-sdk/src/$1'
  },

  // 转换规则
  transform: {
    '^.+\\.js$': 'babel-jest'
  },

  // 忽略转换
  transformIgnorePatterns: [
    'node_modules/(?!(module-that-needs-to-be-transformed)/)'
  ],

  // 设置超时
  testTimeout: 10000
}













