# @yu1596882018/web-sdk

> 🎯 面向生产环境的前端监控与工具集，提供完整的错误监控、性能分析、用户行为追踪能力

[![npm version](https://img.shields.io/badge/npm-1.0.15-blue.svg)](https://www.npmjs.com/package/@yu1596882018/web-sdk)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](../../LICENSE.txt)

## ✨ 特性

- 🔍 **全方位错误监控** - JS 错误、Promise 异常、资源加载、Ajax 请求、框架错误
- 📊 **性能监控** - Web Vitals 指标、资源加载分析、网络速度测试
- 🎯 **精准定位** - 详细的错误堆栈、用户环境信息、行为轨迹
- ⚡ **高性能** - 任务队列异步上报，不影响主业务
- 🔌 **框架无关** - 支持 Vue、React 等任意框架
- 📱 **移动端优化** - 包含 flexible 适配方案

## 📦 安装

```bash
# npm
npm install @yu1596882018/web-sdk

# yarn
yarn add @yu1596882018/web-sdk

# pnpm
pnpm add @yu1596882018/web-sdk
```

## 🚀 快速开始

### 基础使用

```javascript
import { MonitorJS } from '@yu1596882018/web-sdk'

const monitor = new MonitorJS()

// 初始化错误监控
monitor.init({
  url: 'https://api.example.com/monitor/error',
  extendsInfo: {
    projectName: 'my-project',
    version: '1.0.0'
  }
})

// 初始化性能监控
monitor.monitorPerformance({
  pageId: 'home',
  url: 'https://api.example.com/monitor/performance'
})
```

### Vue 项目集成

```javascript
// main.js
import Vue from 'vue'
import { MonitorJS } from '@yu1596882018/web-sdk'

const monitor = new MonitorJS()

monitor.init({
  url: '/api/monitor/error',
  jsError: true,
  promiseError: true,
  resourceError: true,
  ajaxError: true,
  vueError: true,        // 开启 Vue 错误监控
  vue: Vue,              // 传入 Vue 构造函数
  extendsInfo: {
    projectName: process.env.VUE_APP_NAME,
    version: process.env.VUE_APP_VERSION,
    environment: process.env.NODE_ENV
  }
})

monitor.monitorPerformance({
  pageId: location.pathname,
  url: '/api/monitor/performance'
})
```

### React 项目集成

```javascript
// App.js
import React, { useEffect } from 'react'
import { MonitorJS } from '@yu1596882018/web-sdk'

function App() {
  useEffect(() => {
    const monitor = new MonitorJS()
    
    monitor.init({
      url: '/api/monitor/error',
      jsError: true,
      promiseError: true,
      resourceError: true,
      ajaxError: true,
      extendsInfo: {
        projectName: 'react-app',
        userId: localStorage.getItem('userId')
      }
    })
    
    monitor.monitorPerformance({
      pageId: window.location.pathname,
      url: '/api/monitor/performance'
    })
  }, [])
  
  return <div>Your App</div>
}
```

## 📖 API 文档

### MonitorJS 类

#### `init(options)`

初始化错误监控。

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| url | `string` | - | **必填**，错误上报接口地址 |
| jsError | `boolean` | `true` | 是否监控 JS 运行时错误 |
| promiseError | `boolean` | `true` | 是否监控 Promise 未捕获异常 |
| resourceError | `boolean` | `true` | 是否监控资源加载错误 |
| ajaxError | `boolean` | `true` | 是否监控 Ajax 请求错误 |
| consoleError | `boolean` | `false` | 是否监控 console.error |
| vueError | `boolean` | `false` | 是否监控 Vue 错误 |
| vue | `Object` | - | Vue 构造函数（开启 vueError 时必填） |
| extendsInfo | `Object` | `{}` | 自定义扩展信息 |

**示例：**

```javascript
monitor.init({
  url: '/api/monitor/error',
  jsError: true,
  promiseError: true,
  resourceError: true,
  ajaxError: true,
  consoleError: true,
  extendsInfo: {
    projectName: 'my-app',
    version: '1.0.0',
    userId: '12345',
    environment: 'production'
  }
})
```

**上报数据格式：**

```javascript
{
  category: 'js-error',        // 错误类型
  logType: 'error',            // 日志类型
  deviceInfo: {                // 设备信息
    userAgent: '...',
    language: 'zh-CN',
    platform: 'Win32',
    screenWidth: 1920,
    screenHeight: 1080
  },
  logInfo: {                   // 错误详情
    errorMessage: '...',       // 错误信息
    errorStack: '...',         // 错误堆栈
    fileName: '...',           // 文件名
    lineNumber: 100,           // 行号
    columnNumber: 20,          // 列号
    errorType: 'TypeError',    // 错误类型
    pageUrl: '...',            // 页面 URL
    timestamp: 1234567890      // 时间戳
  },
  extendsInfo: {               // 自定义扩展信息
    projectName: 'my-app',
    version: '1.0.0'
  }
}
```

#### `monitorPerformance(options)`

初始化性能监控。

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| pageId | `string` | - | **必填**，页面标识 |
| url | `string` | - | **必填**，性能数据上报接口地址 |

**示例：**

```javascript
monitor.monitorPerformance({
  pageId: 'home-page',
  url: '/api/monitor/performance'
})
```

**上报数据格式：**

```javascript
{
  category: 'performance',     // 类型
  logType: 'performance',      // 日志类型
  deviceInfo: { ... },         // 设备信息
  logInfo: {
    pageId: 'home-page',       // 页面标识
    
    // 核心性能指标
    FP: 1000,                  // First Paint
    FCP: 1200,                 // First Contentful Paint
    LCP: 2000,                 // Largest Contentful Paint
    FID: 50,                   // First Input Delay
    CLS: 0.1,                  // Cumulative Layout Shift
    TTFB: 300,                 // Time to First Byte
    
    // 页面加载时序
    DNS: 20,                   // DNS 查询耗时
    TCP: 30,                   // TCP 连接耗时
    SSL: 40,                   // SSL 握手耗时
    request: 200,              // 请求耗时
    response: 100,             // 响应耗时
    domParse: 500,             // DOM 解析耗时
    domContentLoaded: 1500,    // DOMContentLoaded 耗时
    loadComplete: 2000,        // 页面完全加载耗时
    
    // 网络速度
    networkSpeed: 1.5          // 网络速度（MB/s）
  }
}
```

### 其他工具模块

#### EventBus - 事件总线

```javascript
import Vue from 'vue'
import EventBus from '@yu1596882018/web-sdk/lib/eventBus'

Vue.use(EventBus)

// 发送事件
this.$EventBus.$emit('custom-event', data)

// 监听事件
this.$EventBus.$on('custom-event', (data) => {
  console.log(data)
})

// 移除监听
this.$EventBus.$off('custom-event')
```

#### Flexible - 移动端适配

```javascript
import '@yu1596882018/web-sdk/lib/flexible'

// 自动根据屏幕宽度设置 rem 基准值
// 默认设计稿宽度 750px，1rem = 75px
```

#### LoadingManage - Loading 管理

```javascript
import LoadingManage from '@yu1596882018/web-sdk/lib/loadingManage'

// 显示 loading
LoadingManage.show()

// 隐藏 loading
LoadingManage.hide()

// 判断 loading 状态
const isLoading = LoadingManage.isLoading()
```

#### HistoryTrack - 历史记录追踪

```javascript
import HistoryTrack from '@yu1596882018/web-sdk/lib/historyTrack'

// 初始化
const tracker = new HistoryTrack({
  maxLength: 20,  // 最大记录数
  onTrack: (url, state) => {
    console.log('页面变化:', url)
  }
})

// 获取历史记录
const history = tracker.getHistory()
```

## 🏗️ 错误监控原理

### 1. JS 运行时错误

通过 `window.onerror` 捕获全局 JavaScript 错误：

```javascript
window.addEventListener('error', (event) => {
  if (event.target !== window) return
  
  // 采集错误信息
  const errorInfo = {
    errorMessage: event.message,
    fileName: event.filename,
    lineNumber: event.lineno,
    columnNumber: event.colno,
    errorStack: event.error?.stack
  }
  
  // 上报错误
  report(errorInfo)
})
```

### 2. Promise 未捕获异常

通过 `unhandledrejection` 事件捕获：

```javascript
window.addEventListener('unhandledrejection', (event) => {
  const errorInfo = {
    errorMessage: event.reason?.message || event.reason,
    errorStack: event.reason?.stack,
    errorType: 'UnhandledPromiseRejection'
  }
  
  report(errorInfo)
})
```

### 3. 资源加载错误

通过捕获阶段的 `error` 事件监听：

```javascript
window.addEventListener('error', (event) => {
  const target = event.target
  
  if (target instanceof HTMLScriptElement ||
      target instanceof HTMLLinkElement ||
      target instanceof HTMLImageElement) {
    
    const errorInfo = {
      errorType: 'ResourceError',
      resourceUrl: target.src || target.href,
      tagName: target.tagName,
      pageUrl: location.href
    }
    
    report(errorInfo)
  }
}, true)  // 捕获阶段
```

### 4. Ajax 请求错误

通过劫持 `XMLHttpRequest` 和 `fetch`：

```javascript
// 劫持 XMLHttpRequest
const originalOpen = XMLHttpRequest.prototype.open
XMLHttpRequest.prototype.open = function(...args) {
  this.addEventListener('error', () => {
    // 上报请求错误
  })
  return originalOpen.apply(this, args)
}

// 劫持 fetch
const originalFetch = window.fetch
window.fetch = function(...args) {
  return originalFetch.apply(this, args)
    .catch(error => {
      // 上报请求错误
      throw error
    })
}
```

### 5. Vue 框架错误

通过 Vue 的 `errorHandler`：

```javascript
Vue.config.errorHandler = (error, vm, info) => {
  const errorInfo = {
    errorMessage: error.message,
    errorStack: error.stack,
    componentName: vm?.$options?.name,
    errorInfo: info
  }
  
  report(errorInfo)
}
```

## 📊 性能监控指标说明

### Web Vitals 核心指标

- **FP (First Paint)**: 首次绘制时间，页面首次绘制像素的时间
- **FCP (First Contentful Paint)**: 首次内容绘制时间，首次绘制文本、图片等内容的时间
- **LCP (Largest Contentful Paint)**: 最大内容绘制时间，页面最大内容元素的渲染时间
- **FID (First Input Delay)**: 首次输入延迟，用户首次交互到浏览器响应的时间
- **CLS (Cumulative Layout Shift)**: 累积布局偏移，页面视觉稳定性指标
- **TTFB (Time to First Byte)**: 首字节时间，浏览器接收第一个字节的时间

### 性能优化建议

- **FCP < 1.8s** 为优秀
- **LCP < 2.5s** 为优秀
- **FID < 100ms** 为优秀
- **CLS < 0.1** 为优秀

## 🔧 构建产物

本包使用 [father-build](https://github.com/umijs/father) 构建，提供两种模块格式：

- **CommonJS**: `lib/index.js` - 适用于 Node.js 和构建工具
- **ES Module**: `es/index.js` - 适用于现代浏览器和 Tree Shaking

## 📝 更新日志

查看 [CHANGELOG.md](../../CHANGELOG.md) 了解版本变更详情。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

[MIT](../../LICENSE.txt)



