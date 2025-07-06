# Broad SDK

[![npm version](https://img.shields.io/npm/v/@yu1596882018/web-sdk.svg)](https://www.npmjs.com/package/@yu1596882018/web-sdk)
[![npm version](https://img.shields.io/npm/v/@yu1596882018/server-sdk.svg)](https://www.npmjs.com/package/@yu1596882018/server-sdk)
[![license](https://img.shields.io/npm/l/@yu1596882018/web-sdk.svg)](https://github.com/yu1596882018/broad-sdk/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/yu1596882018/broad-sdk.svg)](https://github.com/yu1596882018/broad-sdk)

> 🚀 一个功能强大的前端监控和工具库，提供完整的错误监控、性能监控、路由追踪等功能

## ✨ 特性

- 🔍 **全面的错误监控** - 支持JS错误、Promise错误、资源加载错误、Ajax错误、Vue错误等
- 📊 **性能监控** - 页面性能指标收集和网络速度监控
- 🛤️ **路由追踪** - 完整的浏览器历史记录追踪，支持Vue Router
- 📱 **响应式布局** - 移动端适配解决方案
- ⚡ **加载管理** - 智能的请求加载状态管理
- 🎯 **接口缓存** - 装饰器模式的接口数据缓存
- 🎨 **样式工具** - 移动端和PC端样式重置及混入

## 📦 安装

### Web SDK

```bash
npm install @yu1596882018/web-sdk
# 或
yarn add @yu1596882018/web-sdk
```

### Server SDK

```bash
npm install @yu1596882018/server-sdk
# 或
yarn add @yu1596882018/server-sdk
```

## 🚀 快速开始

### 错误监控

```javascript
import { MonitorJS } from '@yu1596882018/web-sdk'

// 初始化监控
MonitorJS.init({
  url: 'https://your-api.com/error-report', // 错误上报地址
  jsError: true,        // JS错误监控
  promiseError: true,   // Promise错误监控
  resourceError: true,  // 资源加载错误监控
  ajaxError: true,      // Ajax错误监控
  consoleError: false,  // Console错误监控
  vueError: true,       // Vue错误监控
  vue: Vue,             // Vue实例（如果启用Vue错误监控）
  extendsInfo: {        // 扩展信息
    userId: 'user123',
    version: '1.0.0'
  }
})

// 性能监控
MonitorJS.monitorPerformance({
  pageId: 'homepage',
  url: 'https://your-api.com/performance-report'
})
```

### 路由追踪

```javascript
import Vue from 'vue'
import Router from 'vue-router'
import historyTrack from '@yu1596882018/web-sdk/lib/historyTrack'

Vue.use(Router)
const router = new Router({
  // 路由配置
})

// 安装历史记录追踪插件
Vue.use(historyTrack, { router })

// 使用追踪数据
console.log(router.currentHistoryTrack) // 当前历史记录
console.log(router.fullHistoryTrack)    // 完整历史记录
```

### 加载管理

```javascript
import loadingManage from '@yu1596882018/web-sdk/lib/loadingManage'

// 在请求中使用
const hideLoading = loadingManage({
  openLoading: true,
  showLoading: () => {
    // 显示loading
    console.log('显示loading')
  },
  hideLoading: () => {
    // 隐藏loading
    console.log('隐藏loading')
  }
})

// 请求完成后调用
hideLoading()
```

### 响应式布局

```javascript
import '@yu1596882018/web-sdk/src/lib/flexible'

// 自动设置rem基准值，适配移动端
// 最大宽度750px，最小宽度320px
```

### 接口缓存装饰器

```javascript
import { CacheData } from '@yu1596882018/web-sdk/utils/servicesDecorator'

class ApiService {
  @CacheData
  async getUserInfo(userId) {
    // 接口调用逻辑
    return await fetch(`/api/user/${userId}`)
  }
}

const api = new ApiService()
const userInfo = await api.getUserInfo(123) // 第一次调用，会缓存结果
const cachedUserInfo = await api.getUserInfo(123) // 第二次调用，返回缓存数据

// 清除缓存
api.getUserInfo.clearCache()
```

## 📚 API 文档

### MonitorJS

#### 初始化配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| url | string | - | 错误上报地址 |
| jsError | boolean | true | 是否监控JS错误 |
| promiseError | boolean | true | 是否监控Promise错误 |
| resourceError | boolean | true | 是否监控资源加载错误 |
| ajaxError | boolean | true | 是否监控Ajax错误 |
| consoleError | boolean | false | 是否监控Console错误 |
| vueError | boolean | false | 是否监控Vue错误 |
| vue | Vue | - | Vue实例（启用vueError时必需） |
| extendsInfo | object | {} | 扩展信息 |

#### 性能监控配置

| 参数 | 类型 | 说明 |
|------|------|------|
| pageId | string | 页面标识 |
| url | string | 性能数据上报地址 |

### historyTrack

#### 路由对象属性

| 属性 | 类型 | 说明 |
|------|------|------|
| currentHistoryTrack | array | 当前历史记录 |
| fullHistoryTrack | array | 完整历史记录 |

### loadingManage

#### 配置参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| openLoading | boolean | true | 是否开启loading |
| showLoading | function | - | 显示loading回调 |
| hideLoading | function | - | 隐藏loading回调 |

## 🛠️ 开发

```bash
# 克隆项目
git clone https://github.com/yu1596882018/broad-sdk.git

# 安装依赖
yarn install

# 构建Web SDK
yarn build:web-sdk

# 发布
yarn publish
```

## 📄 许可证

[MIT License](LICENSE)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系

- 邮箱：1596882018@qq.com
- GitHub：[@yu1596882018](https://github.com/yu1596882018)

---

⭐ 如果这个项目对您有帮助，请给它一个星标！
