# 快速开始

## 🚀 5分钟上手 Broad SDK

### 1. 安装

```bash
# 安装 Web SDK
npm install @yu1596882018/web-sdk

# 安装 Server SDK
npm install @yu1596882018/server-sdk
```

### 2. 基础使用

#### 错误监控

```javascript
import { MonitorJS } from '@yu1596882018/web-sdk'

// 初始化监控
MonitorJS.init({
  url: 'https://your-api.com/error-report',
  jsError: true,
  promiseError: true,
  resourceError: true,
  ajaxError: true,
  extendsInfo: {
    userId: 'user123',
    version: '1.0.0'
  }
})
```

#### 性能监控

```javascript
// 监控页面性能
MonitorJS.monitorPerformance({
  pageId: 'homepage',
  url: 'https://your-api.com/performance-report'
})
```

#### 路由追踪

```javascript
import Vue from 'vue'
import Router from 'vue-router'
import { historyTrack } from '@yu1596882018/web-sdk'

Vue.use(Router)
const router = new Router({
  // 路由配置
})

// 安装历史记录追踪
Vue.use(historyTrack, { router })

// 使用追踪数据
console.log(router.currentHistoryTrack) // 当前历史记录
console.log(router.fullHistoryTrack)    // 完整历史记录
```

#### 加载管理

```javascript
import { loadingManage } from '@yu1596882018/web-sdk'

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

#### 接口缓存

```javascript
import { CacheData } from '@yu1596882018/web-sdk'

class ApiService {
  @CacheData
  async getUserInfo(userId) {
    return await fetch(`/api/user/${userId}`)
  }
}

const api = new ApiService()
const userInfo = await api.getUserInfo(123) // 第一次调用，会缓存结果
const cachedUserInfo = await api.getUserInfo(123) // 第二次调用，返回缓存数据

// 清除缓存
api.getUserInfo.clearCache()
```

### 3. Vue.js 集成

```javascript
import Vue from 'vue'
import { MonitorJS, historyTrack, loadingManage } from '@yu1596882018/web-sdk'

// 在 Vue 应用中使用
const app = new Vue({
  mounted() {
    // 初始化监控
    MonitorJS.init({
      url: 'https://your-api.com/error-report',
      vueError: true,
      vue: this,
      extendsInfo: {
        userId: 'vue-user',
        version: '1.0.0'
      }
    })

    // 性能监控
    MonitorJS.monitorPerformance({
      pageId: 'vue-app',
      url: 'https://your-api.com/performance-report'
    })
  },
  methods: {
    async fetchData() {
      const hideLoading = loadingManage({
        openLoading: true,
        showLoading: () => {
          this.loading = true
        },
        hideLoading: () => {
          this.loading = false
        }
      })

      try {
        // 你的异步请求
        await this.apiCall()
      } finally {
        hideLoading()
      }
    }
  }
})
```

### 4. 响应式布局

```javascript
// 自动启用响应式布局
import '@yu1596882018/web-sdk/src/lib/flexible'

// 在 CSS 中使用 rem 单位
.container {
  width: 7.5rem; /* 相当于 750px */
  height: 10rem; /* 相当于 1000px */
}
```

### 5. 样式重置

```scss
// 引入移动端样式重置
@import '@yu1596882018/web-sdk/style/resetMobile.scss';

// 引入 PC 端样式重置
@import '@yu1596882018/web-sdk/style/resetPc.scss';

// 引入样式混入
@import '@yu1596882018/web-sdk/style/mixins.scss';
```

## 📋 配置选项

### MonitorJS 配置

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

### 性能监控配置

| 参数 | 类型 | 说明 |
|------|------|------|
| pageId | string | 页面标识 |
| url | string | 性能数据上报地址 |

### 加载管理配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| openLoading | boolean | true | 是否开启loading |
| showLoading | function | - | 显示loading回调 |
| hideLoading | function | - | 隐藏loading回调 |

## 🔧 高级用法

### 自定义错误处理

```javascript
MonitorJS.init({
  url: 'https://your-api.com/error-report',
  extendsInfo: {
    userId: 'user123',
    version: '1.0.0',
    customField: 'customValue'
  }
})

// 手动上报错误
MonitorJS.reportError({
  type: 'custom',
  message: '自定义错误信息',
  stack: '错误堆栈',
  timestamp: Date.now()
})
```

### 路由追踪高级用法

```javascript
// 获取路由历史统计
const historyStats = {
  totalPages: router.fullHistoryTrack.length,
  currentPage: router.currentHistoryTrack.length,
  uniquePages: new Set(router.fullHistoryTrack.map(route => route.path)).size
}

console.log('路由统计:', historyStats)
```

### 缓存装饰器高级用法

```javascript
class AdvancedApiService {
  @CacheData
  async getData(id, options = {}) {
    // 支持参数的缓存
    const cacheKey = `${id}-${JSON.stringify(options)}`
    return await this.fetchData(cacheKey)
  }

  // 批量清除缓存
  clearAllCache() {
    Object.getOwnPropertyNames(this.constructor.prototype).forEach(method => {
      if (this[method].clearCache) {
        this[method].clearCache()
      }
    })
  }
}
```

## 🚨 注意事项

1. **错误上报地址**: 确保提供有效的错误上报地址
2. **Vue 版本**: 当前支持 Vue 2.x，Vue 3.x 支持正在开发中
3. **浏览器兼容性**: 支持现代浏览器，IE 11+ 需要 polyfill
4. **性能影响**: 监控功能对性能影响很小，但建议在生产环境中合理配置
5. **数据隐私**: 注意收集的数据符合隐私法规要求

## 📞 获取帮助

- 📖 [完整文档](../README.md)
- 🐛 [报告问题](https://github.com/yu1596882018/broad-sdk/issues)
- 💬 [讨论交流](https://github.com/yu1596882018/broad-sdk/discussions)
- 📧 [联系作者](mailto:1596882018@qq.com) 
