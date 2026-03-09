# @yu1596882018/server-sdk

> 🛠️ Node.js 服务端工具集，提供日志管理、监控数据处理、实用工具等能力

[![npm version](https://img.shields.io/badge/npm-1.0.8-blue.svg)](https://www.npmjs.com/package/@yu1596882018/server-sdk)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](../../LICENSE.txt)
[![node](https://img.shields.io/badge/node-%3E%3D12.0.0-brightgreen.svg)](https://nodejs.org)

## ✨ 特性

- 📝 **完善的日志系统** - 基于 log4js 的分级日志管理
- 🔍 **全链路追踪** - 请求响应、错误、数据库查询全方位记录
- 📊 **Elasticsearch 集成** - 自动将日志写入 ES，支持 Kibana 可视化
- 🌍 **地理位置解析** - 基于 IP 自动解析用户地理位置
- 🔧 **实用工具** - 二维码生成、用户代理解析等
- ⚡ **高性能** - 异步日志写入，不阻塞主业务

## 📦 安装

```bash
# npm
npm install @yu1596882018/server-sdk

# yarn
yarn add @yu1596882018/server-sdk

# pnpm
pnpm add @yu1596882018/server-sdk
```

### 依赖包

```bash
# 日志相关依赖
npm install log4js @elastic/elasticsearch

# 工具依赖
npm install useragent uuid

# 二维码功能依赖（可选）
npm install qrcode
```

## 🚀 快速开始

### LogUtil - 日志管理

```javascript
const LogUtil = require('@yu1596882018/server-sdk/utils/logUtil')
const { Client } = require('@elastic/elasticsearch')

// 初始化 Elasticsearch 客户端
const esClient = new Client({
  node: 'http://localhost:9200'
})

// log4js 配置
const logConfig = {
  appenders: {
    errorLogger: {
      type: 'dateFile',
      filename: 'logs/error/error',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      encoding: 'utf-8',
      maxLogSize: 10 * 1024 * 1024,  // 10MB
      numBackups: 3,
      layout: {
        type: 'basic'
      }
    },
    resLogger: {
      type: 'dateFile',
      filename: 'logs/response/response',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      encoding: 'utf-8',
      maxLogSize: 10 * 1024 * 1024,
      numBackups: 3,
      layout: {
        type: 'basic'
      }
    }
  },
  categories: {
    errorLogger: { appenders: ['errorLogger'], level: 'error' },
    resLogger: { appenders: ['resLogger'], level: 'info' },
    default: { appenders: ['resLogger'], level: 'info' }
  }
}

// 初始化日志工具
const logUtil = new LogUtil(logConfig, esClient)

module.exports = logUtil
```

### Koa 框架集成

```javascript
const Koa = require('koa')
const logUtil = require('./utils/logUtil')

const app = new Koa()

// 日志中间件
app.use(async (ctx, next) => {
  const start = Date.now()
  
  try {
    await next()
    
    // 记录响应日志
    const ms = Date.now() - start
    logUtil.logResponse(ctx, ms)
    
  } catch (error) {
    // 记录错误日志
    const ms = Date.now() - start
    logUtil.logError(ctx, error, ms)
    
    // 返回错误响应
    ctx.status = error.status || 500
    ctx.body = {
      success: false,
      message: error.message
    }
  }
})

// 路由配置
const router = require('koa-router')()

// 前端监控数据接收接口
router.post('/api/monitor/error', async (ctx) => {
  logUtil.webError(ctx)
  ctx.body = { success: true }
})

router.post('/api/monitor/performance', async (ctx) => {
  logUtil.webPerformance(ctx)
  ctx.body = { success: true }
})

router.post('/api/monitor/network-speed', async (ctx) => {
  logUtil.webNetworkSpeed(ctx)
  ctx.body = { success: true }
})

app.use(router.routes())
```

### Express 框架集成

```javascript
const express = require('express')
const logUtil = require('./utils/logUtil')

const app = express()

// 日志中间件
app.use((req, res, next) => {
  const start = Date.now()
  
  // 保存原始 json 方法
  const originalJson = res.json.bind(res)
  
  // 重写 json 方法
  res.json = function(body) {
    const ms = Date.now() - start
    
    // 构造 ctx 对象（兼容 Koa 格式）
    const ctx = {
      request: { 
        method: req.method,
        originalUrl: req.originalUrl,
        query: req.query,
        body: req.body,
        headers: req.headers
      },
      response: {
        status: res.statusCode,
        body: body
      },
      host: req.get('host'),
      params: req.params,
      status: res.statusCode,
      body: body,
      _matchedRoute: req.route?.path
    }
    
    logUtil.logResponse(ctx, ms)
    
    return originalJson(body)
  }
  
  next()
})

// 错误处理中间件
app.use((err, req, res, next) => {
  const ms = Date.now() - req._startTime
  
  const ctx = {
    request: req,
    // ... 构造 ctx 对象
  }
  
  logUtil.logError(ctx, err, ms)
  
  res.status(500).json({
    success: false,
    message: err.message
  })
})
```

## 📖 API 文档

### LogUtil 类

#### 构造函数

```javascript
new LogUtil(logConfig, esClient)
```

**参数：**

- `logConfig` - log4js 配置对象
- `esClient` - Elasticsearch 客户端实例

#### `logResponse(ctx, resTime)`

记录请求响应日志。

**参数：**

- `ctx` - Koa Context 对象
- `resTime` - 响应时间（毫秒）

**写入索引：** `server_res_logs`

**日志内容：**

```javascript
{
  requestMethod: 'GET',
  requestHost: 'example.com',
  requestOriginalUrl: '/api/users',
  requestMatchedRoute: '/api/users',
  ip: '192.168.1.1',
  requestParams: '{}',
  requestQuery: '{"page":1}',
  requestToken: 'xxx',
  requestSign: 'xxx',
  requestTime: 150,
  responseStatus: 200,
  responseBody: '{"success":true}',
  browser: 'Chrome',
  browserVersion: '96.0.4664',
  system: 'Windows',
  systemVersion: '10.0',
  timestamp: '2024-01-01T00:00:00.000Z'
}
```

#### `logError(ctx, error, resTime)`

记录错误日志。

**参数：**

- `ctx` - Koa Context 对象
- `error` - Error 对象
- `resTime` - 响应时间（毫秒）

**写入索引：** `server_err_logs`

**日志内容：**

```javascript
{
  // ... 包含 logResponse 的所有字段
  errName: 'TypeError',
  errMessage: 'Cannot read property of undefined',
  errStack: 'TypeError: Cannot read property...\n at ...'
}
```

#### `webError(ctx)`

处理前端上报的错误日志。

**写入索引：** `web_err_logs`

**请求体格式：**

```javascript
{
  category: 'js-error',
  logType: 'error',
  deviceInfo: {
    userAgent: '...',
    language: 'zh-CN',
    platform: 'Win32'
  },
  logInfo: {
    errorMessage: '...',
    errorStack: '...',
    fileName: '...',
    lineNumber: 100
  }
}
```

#### `webPerformance(ctx)`

处理前端上报的性能数据。

**写入索引：** `web_performance_logs`

**请求体格式：**

```javascript
{
  category: 'performance',
  logType: 'performance',
  deviceInfo: { ... },
  logInfo: {
    pageId: 'home',
    FP: 1000,
    FCP: 1200,
    LCP: 2000,
    // ... 其他性能指标
  }
}
```

#### `webNetworkSpeed(ctx)`

处理前端上报的网络速度数据。

**写入索引：** `web_network_speed_logs`

#### `logMysql(sql, ext_ts)`

记录 MySQL 查询日志。

**参数：**

- `sql` - SQL 语句
- `ext_ts` - 执行时间（毫秒）

**示例：**

```javascript
// 在 Sequelize 中使用
const sequelize = new Sequelize({
  // ...其他配置
  logging: (sql, timing) => {
    logUtil.logMysql(sql, timing)
  }
})
```

#### `debugLog(text, file_name)`

记录调试日志。

**参数：**

- `text` - 日志内容
- `file_name` - 文件名（可选）

### CodeToQR - 代码转二维码

```javascript
const codeToQR = require('@yu1596882018/server-sdk/utils/codeToQR')

// 配置要转换的源目录和输出目录
// 然后运行脚本即可批量转换
```

**功能说明：**

- 支持 `.html`、`.ts`、`.js`、`.scss`、`.json`、`.less`、`.css` 文件
- 自动处理大文件分片（每 2000 字符一个二维码）
- 保持目录结构，自动创建输出目录
- 适用于代码审查、快速分享等场景

**使用场景：**

1. 代码评审时快速扫码查看
2. 技术分享时展示代码片段
3. 离线环境下的代码传输

## 🗄️ Elasticsearch 索引设计

### 索引列表

| 索引名称 | 说明 | 主要字段 |
| --- | --- | --- |
| `server_res_logs` | 服务端响应日志 | 请求参数、响应数据、耗时、IP、UA 等 |
| `server_err_logs` | 服务端错误日志 | 错误堆栈、上下文信息 |
| `web_err_logs` | 前端错误日志 | 错误信息、设备信息、页面 URL |
| `web_performance_logs` | 前端性能日志 | 各项性能指标、页面标识 |
| `web_network_speed_logs` | 前端网络速度日志 | 网络速度、页面标识 |

### GeoIP Pipeline 配置

需要在 Elasticsearch 中配置 geoip pipeline 以解析 IP 地理位置：

```json
PUT _ingest/pipeline/geoip
{
  "description": "Add geoip info",
  "processors": [
    {
      "geoip": {
        "field": "ip",
        "target_field": "geoip",
        "ignore_missing": true
      }
    }
  ]
}
```

### Kibana 可视化示例

**1. 请求量趋势图**
```
索引：server_res_logs
时间字段：timestamp
Y 轴：Count
X 轴：Date Histogram (timestamp)
```

**2. 错误率统计**
```
索引：server_err_logs
Metric: Count
Group by: Terms (errName)
```

**3. 性能指标分布**
```
索引：web_performance_logs
Metric: Average (FCP, LCP, FID 等)
Group by: Terms (pageId)
```

**4. 地理位置分布**
```
索引：server_res_logs
Map: Geohash (geoip.location)
```

## 🔧 配置示例

### 完整的 log4js 配置

```javascript
module.exports = {
  appenders: {
    // 错误日志
    errorLogger: {
      type: 'dateFile',
      filename: 'logs/error/error',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      encoding: 'utf-8',
      maxLogSize: 10 * 1024 * 1024,
      numBackups: 3,
      layout: {
        type: 'pattern',
        pattern: '[%d{yyyy-MM-dd hh:mm:ss}] [%p] %m'
      }
    },
    
    // 响应日志
    resLogger: {
      type: 'dateFile',
      filename: 'logs/response/response',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      encoding: 'utf-8',
      maxLogSize: 10 * 1024 * 1024,
      numBackups: 3,
      layout: {
        type: 'pattern',
        pattern: '[%d{yyyy-MM-dd hh:mm:ss}] [%p] %m'
      }
    },
    
    // MySQL 日志
    mysqlLogger: {
      type: 'dateFile',
      filename: 'logs/mysql/mysql',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      encoding: 'utf-8',
      maxLogSize: 10 * 1024 * 1024,
      numBackups: 3,
      layout: {
        type: 'basic'
      }
    },
    
    // 调试日志
    debugLogger: {
      type: 'dateFile',
      filename: 'logs/debug/debug',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      encoding: 'utf-8',
      maxLogSize: 10 * 1024 * 1024,
      numBackups: 3,
      layout: {
        type: 'basic'
      }
    },
    
    // 控制台输出（开发环境）
    console: {
      type: 'console'
    }
  },
  
  categories: {
    errorLogger: { 
      appenders: ['errorLogger', 'console'], 
      level: 'error' 
    },
    resLogger: { 
      appenders: ['resLogger'], 
      level: 'info' 
    },
    mysqlLogger: { 
      appenders: ['mysqlLogger'], 
      level: 'info' 
    },
    debugLogger: { 
      appenders: ['debugLogger', 'console'], 
      level: 'debug' 
    },
    default: { 
      appenders: ['resLogger', 'console'], 
      level: 'info' 
    }
  }
}
```

## 🎯 最佳实践

### 1. 日志分级策略

- **Error**: 系统错误、业务异常、未捕获异常
- **Warn**: 业务警告、性能警告
- **Info**: 普通业务日志、API 调用
- **Debug**: 调试信息（仅开发环境）

### 2. 性能优化

```javascript
// 生产环境关闭 SQL 日志
const shouldLogSql = process.env.NODE_ENV !== 'production'

if (shouldLogSql) {
  logUtil.logMysql(sql, timing)
}
```

### 3. 敏感信息脱敏

```javascript
// 在 LogUtil 中添加脱敏逻辑
function desensitize(data) {
  const sensitive = ['password', 'token', 'secretKey']
  const copy = { ...data }
  
  sensitive.forEach(key => {
    if (copy[key]) {
      copy[key] = '******'
    }
  })
  
  return copy
}
```

### 4. 日志清理策略

```javascript
// 使用 numBackups 控制日志文件数量
// 使用 maxLogSize 控制单个文件大小
// 定期清理过期日志
const cronJob = require('node-cron')

cronJob.schedule('0 0 * * *', () => {
  // 清理 30 天前的日志
  cleanOldLogs(30)
})
```

## 📝 更新日志

查看 [CHANGELOG.md](../../CHANGELOG.md) 了解版本变更详情。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

[MIT](../../LICENSE.txt)



