module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    '@vue/eslint-config-standard',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    // 基础规则
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    
    // 变量规则
    'no-var': 'error',
    'prefer-const': 'error',
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    
    // 函数规则
    'arrow-spacing': 'error',
    'prefer-arrow-callback': 'error',
    'func-style': ['error', 'expression'],
    
    // 对象规则
    'object-curly-spacing': ['error', 'always'],
    'object-shorthand': 'error',
    
    // 数组规则
    'array-bracket-spacing': ['error', 'never'],
    'array-callback-return': 'error',
    
    // 字符串规则
    'template-curly-spacing': 'error',
    'prefer-template': 'error',
    
    // 其他规则
    'no-trailing-spaces': 'error',
    'eol-last': 'error',
    'no-multiple-empty-lines': ['error', { 'max': 2, 'maxEOF': 1 }],
    'padded-blocks': ['error', 'never'],
    'space-before-blocks': 'error',
    'keyword-spacing': 'error',
    'space-infix-ops': 'error',
    'space-before-function-paren': ['error', {
      'anonymous': 'always',
      'named': 'never',
      'asyncArrow': 'always'
    }],
  },
  overrides: [
    {
      // 针对 Node.js 文件的规则
      files: ['packages/server-sdk/**/*.js'],
      env: {
        node: true,
        es2021: true,
      },
      rules: {
        'no-console': 'off', // 服务端允许使用 console
      },
    },
    {
      // 针对 Vue 文件的规则
      files: ['**/*.vue'],
      extends: [
        'plugin:vue/vue3-essential',
        '@vue/eslint-config-standard',
      ],
      rules: {
        'vue/multi-word-component-names': 'off',
        'vue/no-v-html': 'off',
      },
    },
  ],
}; 