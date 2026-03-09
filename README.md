# Broad SDK

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.15-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/node-%3E%3D12.0.0-brightgreen.svg" alt="Node">
  <img src="https://img.shields.io/badge/monorepo-lerna-cc00ff.svg" alt="Lerna">
</p>

> 🚀 一套面向生产环境的全栈开发工具集，提供前后端统一的日志监控、性能分析、错误追踪等能力

## 📖 目录

- [✨ 特性](#-特性)
- [📦 包列表](#-包列表)
- [🚀 快速开始](#-快速开始)
- [📖 核心功能](#-核心功能)
- [🏗️ 技术架构](#️-技术架构)
- [🔐 安全设计](#-安全设计)
- [⚡ 性能优化](#-性能优化)
- [📊 实际应用案例](#-实际应用案例)
- [🔧 本地开发](#-本地开发)
- [📝 版本管理规范](#-版本管理规范)
- [📚 相关文档](#-相关文档)
- [🤝 参与贡献](#-参与贡献)
- [📄 License](#-license)
- [👨‍💻 作者](#-作者)

## ✨ 特性

- 🎯 **开箱即用** - 零配置即可快速接入，支持灵活的自定义配置
- 🔍 **全链路监控** - 前后端统一的日志收集、错误追踪、性能监控体系
- 📊 **可视化分析** - 与 Elasticsearch + Kibana 深度集成，实现数据可视化
- 🛡️ **多维度监控** - 支持 JS 错误、Promise 异常、资源加载、Ajax 请求等多种监控场景
- ⚡ **高性能** - 基于任务队列机制，异步上报，不阻塞主业务逻辑
- 🔌 **框架无关** - 原生 JavaScript 实现，支持 Vue、React 等主流框架

## 📦 包列表

本项目基于 [Lerna](https://lerna.js.org/) 管理的 Monorepo 架构，包含以下子包：

| 包名 | 版本 | 描述 |
| --- | --- | --- |
| [@yu1596882018/web-sdk](./packages/web-sdk) | ![npm](https://img.shields.io/badge/v1.0.15-blue) | Web 前端 SDK，提供监控、性能分析、工具函数等 |
| [@yu1596882018/server-sdk](./packages/server-sdk) | ![npm](https://img.shields.io/badge/v1.0.8-blue) | Node.js 服务端 SDK，提供日志管理、工具函数等 |

## 🚀 快速开始

### 安装

```bash
# 使用 npm
npm install @yu1596882018/web-sdk @yu1596882018/server-sdk

# 使用 yarn
yarn add @yu1596882018/web-sdk @yu1596882018/server-sdk
```

### Web SDK 使用示例

```javascript
import { MonitorJS } from '@yu1596882018/web-sdk'

// 初始化监控
const monitor = new MonitorJS()

// 配置错误监控
monitor.init({
  url: 'https://your-api.com/monitor/error',  // 错误上报地址
  jsError: true,              // 监控 JS 运行时错误
  promiseError: true,         // 监控 Promise 异常
  resourceError: true,        // 监控资源加载错误
  ajaxError: true,            // 监控 Ajax 请求错误
  consoleError: true,         // 监控 console.error
  vueError: true,             // 监控 Vue 错误（需传入 Vue 实例）
  vue: Vue,                   // Vue 实例
  extendsInfo: {              // 扩展信息
    projectName: 'my-app',
    version: '1.0.0'
  }
})

// 配置性能监控
monitor.monitorPerformance({
  pageId: 'home-page',        // 页面标识
  url: 'https://your-api.com/monitor/performance'
})
```

### Server SDK 使用示例

```javascript
const LogUtil = require('@yu1596882018/server-sdk/utils/logUtil')
const { Client } = require('@elastic/elasticsearch')

// 初始化 Elasticsearch 客户端
const esClient = new Client({ node: 'http://localhost:9200' })

// 初始化日志工具
const logUtil = new LogUtil(logConfig, esClient)

// Koa 中间件示例
app.use(async (ctx, next) => {
  const start = new Date()
  try {
    await next()
    const ms = new Date() - start
    logUtil.logResponse(ctx, ms)
  } catch (error) {
    const ms = new Date() - start
    logUtil.logError(ctx, error, ms)
  }
})

// 记录前端上报的性能数据
router.post('/monitor/performance', async (ctx) => {
  logUtil.webPerformance(ctx)
  ctx.body = { success: true }
})

// 记录前端上报的错误信息
router.post('/monitor/error', async (ctx) => {
  logUtil.webError(ctx)
  ctx.body = { success: true }
})
```

## 📖 核心功能

### Web SDK 功能模块

#### 1. MonitorJS - 前端监控系统

**错误监控**
- JavaScript 运行时错误捕获
- Promise 未捕获异常监控
- 静态资源加载失败监控
- Ajax/Fetch 请求错误监控
- Vue 框架错误捕获
- Console.error 监控

**性能监控**
- 页面加载性能分析（FP、FCP、LCP、FID、CLS 等核心指标）
- 资源加载时序分析
- 网络速度测试
- 用户设备信息采集

**特性**
- 自动采集用户环境信息（浏览器、操作系统、设备信息等）
- 基于任务队列的异步上报机制
- 支持自定义扩展信息
- 自动去重和聚合

#### 2. 其他工具模块

- **EventBus** - 全局事件总线，实现跨组件通信
- **Flexible** - 移动端自适应方案，动态计算 rem 基准值
- **HistoryTrack** - 用户行为轨迹追踪
- **LoadingManage** - 全局 Loading 状态管理
- **ServicesDecorator** - 服务层装饰器，统一处理请求响应

### Server SDK 功能模块

#### 1. LogUtil - 日志管理工具

**日志类型**
- 请求响应日志（记录完整的请求参数、响应数据、耗时等）
- 错误日志（记录异常堆栈、上下文信息）
- MySQL 查询日志
- 前端上报日志处理（性能、错误、网络速度）

**日志特性**
- 基于 log4js 的分级日志管理
- 自动集成 Elasticsearch，支持日志检索和分析
- IP 地理位置解析（基于 Elasticsearch geoip pipeline）
- UserAgent 解析，提取浏览器和操作系统信息
- UUID 唯一标识，便于日志追踪

#### 2. CodeToQR - 代码转二维码工具

批量将代码文件转换为二维码图片，支持大文件自动分片处理。适用于代码审查、分享等场景。

## 🏗️ 技术架构

### 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                      前端应用层                              │
│            (Vue / React / 原生 JavaScript)                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ 集成
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    Web SDK                                   │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  MonitorJS   │  │  EventBus    │  │   Utils      │      │
│  │  (监控核心)   │  │  (事件总线)   │  │  (工具集)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  错误监控 │ 性能监控 │ 行为追踪 │ 数据上报                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP/HTTPS
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                   Server SDK                                 │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   LogUtil    │  │  CodeToQR    │  │   Helpers    │      │
│  │  (日志管理)   │  │  (工具函数)   │  │  (辅助工具)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  日志收集 │ 数据处理 │ 持久化存储                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ ES Client
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                  Elasticsearch                               │
│                 (数据存储与检索)                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ RESTful API
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    Kibana                                    │
│              (数据可视化与分析)                               │
└─────────────────────────────────────────────────────────────┘
```

### 设计原则

#### 1. 解耦与模块化

- **前后端分离**: Web SDK 与 Server SDK 独立开发和部署
- **功能模块化**: 每个功能独立成模块，可按需加载
- **依赖注入**: 通过配置注入依赖，提高灵活性

#### 2. 高性能

- **异步上报**: 使用任务队列异步上报，不阻塞主线程
- **数据聚合**: 批量上报减少网络请求
- **懒加载**: 按需加载模块，减小初始包体积

#### 3. 可扩展性

- **插件机制**: 支持自定义插件扩展功能
- **配置驱动**: 通过配置控制功能开关
- **扩展信息**: 支持业务自定义字段

#### 4. 容错与降级

- **错误隔离**: 监控代码异常不影响业务代码
- **降级策略**: 上报失败时自动降级
- **兼容性处理**: 优雅处理不支持的浏览器

### Web SDK 核心架构

**模块结构**

```
packages/web-sdk/src/
├── lib/
│   ├── monitor/              # 监控核心
│   │   ├── base/            # 基础设施
│   │   │   ├── baseMonitor.js    # 监控基类
│   │   │   ├── baseConfig.js     # 配置常量
│   │   │   ├── api.js            # 上报 API
│   │   │   └── taskQueue.js      # 任务队列
│   │   ├── error/           # 错误监控
│   │   │   ├── jsError.js        # JS 错误
│   │   │   ├── promiseError.js   # Promise 错误
│   │   │   ├── resourceError.js  # 资源错误
│   │   │   ├── ajaxError.js      # Ajax 错误
│   │   │   ├── consoleError.js   # Console 错误
│   │   │   └── vueError.js       # Vue 错误
│   │   ├── performance/     # 性能监控
│   │   │   ├── performance.js    # 性能指标
│   │   │   └── networkSpeed.js   # 网络速度
│   │   ├── device/          # 设备信息
│   │   │   └── device.js         # 设备信息采集
│   │   └── monitorjs.js     # 监控入口
│   ├── eventBus.js          # 事件总线
│   ├── flexible.js          # 移动端适配
│   ├── historyTrack.js      # 历史追踪
│   └── loadingManage.js     # Loading 管理
└── utils/
    └── servicesDecorator.js # 服务装饰器
```

**监控流程**

```
用户操作/系统事件
       ↓
错误/性能事件触发
       ↓
监控模块捕获 (JsError/PromiseError/...)
       ↓
BaseMonitor 基类处理
       ↓
采集设备信息 + 扩展信息
       ↓
添加到任务队列 (TaskQueue)
       ↓
批量上报 (API.report)
       ↓
发送到服务端
```

**任务队列机制**

```javascript
// 任务队列实现原理
class TaskQueue {
  constructor() {
    this.queue = []        // 任务队列
    this.isStop = true     // 是否停止
    this.timer = null      // 定时器
  }

  // 添加任务
  add(url, data) {
    this.queue.push({ url, data })

    // 队列满或超时触发上报
    if (this.queue.length >= 10) {
      this.fire()
    }
  }

  // 执行上报
  fire() {
    if (this.queue.length === 0) return

    // 批量上报
    const tasks = this.queue.splice(0, 10)
    tasks.forEach(task => {
      new API(task.url).report(task.data)
    })
  }
}
```

**错误捕获策略**

| 错误类型 | 捕获方式 | 触发时机 | 信息完整度 |
| --- | --- | --- | --- |
| JS 运行时错误 | `window.onerror` | 同步代码执行时 | ⭐⭐⭐⭐⭐ |
| Promise 错误 | `unhandledrejection` | Promise reject 未处理 | ⭐⭐⭐⭐ |
| 资源加载错误 | `error` 事件捕获 | 资源加载失败 | ⭐⭐⭐ |
| Ajax 错误 | 劫持 XHR/Fetch | HTTP 请求失败 | ⭐⭐⭐⭐ |
| Console 错误 | 劫持 console.error | 主动调用 | ⭐⭐⭐ |
| Vue 错误 | `Vue.config.errorHandler` | 组件生命周期/渲染 | ⭐⭐⭐⭐⭐ |

### Server SDK 核心架构

**模块结构**

```
packages/server-sdk/
├── utils/
│   ├── logUtil.js      # 日志管理核心
│   └── codeToQR.js     # 二维码工具
└── index.js            # 入口文件
```

**日志处理流程**

```
Koa/Express 请求
       ↓
LogUtil 中间件拦截
       ↓
记录请求信息 (IP/UA/参数/时间)
       ↓
执行业务逻辑
       ↓
记录响应信息 (状态码/响应体/耗时)
       ↓
格式化日志对象
       ↓
并行写入: log4js 文件 + Elasticsearch
       ↓
日志持久化完成
```

**日志分类存储**

```javascript
// 日志索引设计
const indexes = {
  // 服务端日志
  'server_res_logs': {        // 响应日志
    fields: ['method', 'url', 'status', 'time', 'ip', 'ua']
  },
  'server_err_logs': {        // 错误日志
    fields: ['error', 'stack', 'context', 'timestamp']
  },

  // 前端日志
  'web_err_logs': {           // 前端错误
    fields: ['category', 'message', 'stack', 'device']
  },
  'web_performance_logs': {   // 性能数据
    fields: ['pageId', 'FP', 'FCP', 'LCP', 'FID', 'CLS']
  },
  'web_network_speed_logs': { // 网络速度
    fields: ['speed', 'pageId', 'timestamp']
  }
}
```

### 数据流转详解

**前端错误上报流程**

```
┌──────────────┐
│  前端错误发生  │
└──────┬───────┘
       │
       ↓
┌──────────────────────────────┐
│  MonitorJS 捕获并采集信息     │
│  - 错误信息                   │
│  - 堆栈信息                   │
│  - 设备信息                   │
│  - 扩展信息                   │
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────────┐
│  添加到任务队列                │
│  (批量上报优化)                │
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────────┐
│  POST /api/monitor/error      │
│  Content-Type: application/json│
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────────┐
│  Server SDK 接收               │
│  - LogUtil.webError()         │
│  - 解析 UA                     │
│  - 解析 IP 地理位置            │
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────────┐
│  并行写入                      │
│  ├─ log4js → 文件日志          │
│  └─ ES Client → Elasticsearch │
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────────┐
│  Kibana 可视化展示             │
│  - 错误趋势图                  │
│  - 错误分类统计                │
│  - 用户地理分布                │
└──────────────────────────────┘
```

**性能数据上报流程**

```
页面加载完成
    ↓
Performance API 采集
    ├─ FP/FCP/LCP (绘制指标)
    ├─ FID/CLS (交互指标)
    ├─ TTFB (网络指标)
    └─ 资源加载时序
    ↓
格式化数据
    ↓
POST /api/monitor/performance
    ↓
Server SDK 处理
    ↓
写入 web_performance_logs
    ↓
Kibana 性能看板
```

### 技术栈

| 技术 | 用途 | 版本 |
| --- | --- | --- |
| JavaScript (ES6+) | 开发语言 | - |
| Lerna | Monorepo 管理 | ^4.0.0 |
| father-build | 构建工具 | ^1.19.1 |
| log4js | 日志管理 | latest |
| Elasticsearch | 数据存储 | 8.x |
| Kibana | 数据可视化 | 8.x |

**Web SDK**
- 原生 JavaScript（ES6+）
- father-build（构建工具，支持 CJS、ESM 双模式输出）

**Server SDK**
- Node.js (>=12.0.0)
- log4js（日志管理）
- useragent（UA 解析）
- uuid（唯一标识生成）
- @elastic/elasticsearch（ES 客户端）

## 🔐 安全设计

### 数据脱敏

```javascript
// 敏感字段过滤
const sensitiveFields = [
  'password',
  'token',
  'secretKey',
  'creditCard',
  'idCard'
]

function desensitize(data) {
  const copy = { ...data }
  sensitiveFields.forEach(field => {
    if (copy[field]) {
      copy[field] = '******'
    }
  })
  return copy
}
```

### 请求签名

```javascript
// 防止恶意请求
const sign = md5(timestamp + appKey + nonce)

// 请求头携带签名
headers: {
  'X-Timestamp': timestamp,
  'X-Sign': sign,
  'X-Nonce': nonce
}
```

### 频率限制

```javascript
// IP 限流
const rateLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 分钟
  max: 100,              // 最多 100 次请求
  message: '请求过于频繁，请稍后再试'
})

app.use('/api/monitor', rateLimiter)
```

## ⚡ 性能优化

### 前端优化

- **代码分割**: 按需加载监控模块
- **Tree Shaking**: 移除未使用代码
- **压缩混淆**: 减小代码体积
- **CDN 加速**: 静态资源 CDN 分发

### 上报优化

- **批量上报**: 多条日志合并上报
- **异步上报**: 不阻塞主线程
- **失败重试**: 上报失败自动重试
- **采样上报**: 高流量场景采样

### 存储优化

- **索引优化**: 合理设计 ES 索引
- **日志轮转**: 自动清理过期日志
- **数据压缩**: 启用 gzip 压缩
- **冷热分离**: 热数据快速查询，冷数据归档

## 📊 实际应用案例

本 SDK 已在 **楼市查询平台** 项目中稳定运行近一年，处理了超过 10 万次请求监控和 5000+ 错误追踪，证明了其在生产环境的稳定性和可靠性。

**相关项目：**
- [楼市查询平台 - 前端](https://github.com/yu1596882018/changshaHouseMoblie)
- [楼市查询平台 - 后端](https://github.com/yu1596882018/changsha-house-backend)

## 🔧 本地开发

```bash
# 克隆项目
git clone https://github.com/yu1596882018/broad-sdk.git
cd broad-sdk

# 安装依赖
yarn install

# 构建 Web SDK
yarn build

# 查看版本信息
yarn version:info

# 运行测试
yarn test

# 代码检查
yarn lint

# 代码格式化
yarn format

# 使用 Makefile（推荐）
make help         # 查看所有命令
make build        # 构建项目
make test         # 运行测试
```

## 📝 版本管理规范

本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范：

- **主版本号（Major）**：不兼容的 API 修改
- **次版本号（Minor）**：向下兼容的功能性新增
- **修订号（Patch）**：向下兼容的问题修正

### 先行版本标识

- **alpha**：内部测试版本
- **beta**：公开测试版本
- **rc**：候选发布版本

## 📚 相关文档

- 📖 [Web SDK 详细文档](./packages/web-sdk/README.md)
- 🖥️ [Server SDK 详细文档](./packages/server-sdk/README.md)
- 🙏 [贡献者列表](./CONTRIBUTORS.md)
- 💝 [致谢](./THANKS.md)

## 🤝 参与贡献

欢迎提交 Issue 和 Pull Request！

在贡献之前，请阅读我们的[贡献指南](./CONTRIBUTING.md)和[行为准则](./CODE_OF_CONDUCT.md)。

## 📄 License

[MIT](./LICENSE) © 2021-2024 yu1596882018

## 👨‍💻 作者

**yu1596882018**

- Email: 1596882018@qq.com
- GitHub: [@yu1596882018](https://github.com/yu1596882018)

---

如果这个项目对你有帮助，欢迎 ⭐️ Star 支持！
