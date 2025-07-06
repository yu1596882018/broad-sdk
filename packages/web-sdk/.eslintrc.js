module.exports = {
  extends: ['../../.eslintrc.js'],
  env: {
    browser: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    // web-sdk 特定规则
    'no-console': 'off', // 允许 console 用于调试
    'no-debugger': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
  },
  overrides: [
    {
      // 针对样式文件的规则
      files: ['**/*.scss', '**/*.css'],
      rules: {
        'no-unused-vars': 'off',
      },
    },
  ],
};
