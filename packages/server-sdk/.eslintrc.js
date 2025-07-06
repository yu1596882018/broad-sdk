module.exports = {
  extends: ['../../.eslintrc.js'],
  env: {
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    // server-sdk 特定规则
    'no-console': 'off', // 服务端允许使用 console
    'no-debugger': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    'no-process-exit': 'error',
    'no-sync': 'warn',
  },
  overrides: [
    {
      // 针对工具脚本的规则
      files: ['utils/*.js'],
      rules: {
        'no-console': 'off',
        'no-process-exit': 'off',
      },
    },
  ],
}; 