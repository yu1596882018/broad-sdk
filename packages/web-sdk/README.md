# @yu1596882018/web-sdk

强大的前端监控和工具库，提供错误追踪、性能监控和路由功能

## 📦 安装

```bash
npm install @yu1596882018/web-sdk
# 或者
yarn add @yu1596882018/web-sdk
```

## 🚀 功能特性

- **错误监控**: 自动捕获 JavaScript 错误、Promise 错误、资源加载错误
- **性能监控**: 页面加载性能、网络速度、用户行为分析
- **设备信息**: 自动收集浏览器、设备、网络等环境信息
- **路由追踪**: 单页应用路由变化监控
- **Vue 集成**: 原生支持 Vue.js 错误监控
- **灵活配置**: 支持自定义上报地址、采样率、过滤规则

## 📖 API 参考

### 基础使用

```javascript
import { Monitor } from '@yu1596882018/web-sdk';

// 初始化监控
const monitor = new Monitor({
  appId: 'your-app-id',
  userId: 'user-123',
  reportUrl: 'https://your-api.com/report',
  // 可选配置
  sampleRate: 1.0, // 采样率 0-1
  ignoreErrors: [/^Script error\.?$/], // 忽略的错误
  maxCache: 10, // 最大缓存数量
  delay: 1000, // 上报延迟(ms)
  repeat: 5, // 重复上报次数
  autoTrack: true, // 自动埋点
  hashPage: false, // 是否开启hash路由
  errorReport: true, // 是否开启错误上报
  performanceReport: true, // 是否开启性能上报
  outTime: 300000, // 页面卸载时上报时间
  sdkVersion: '1.0.0', // SDK版本
  debug: false, // 是否开启调试模式
});

// 手动上报错误
monitor.reportError(new Error('手动错误'));

// 手动上报性能数据
monitor.reportPerformance({
  name: 'custom-metric',
  value: 100,
  category: 'custom',
});
```

### Vue.js 集成

```javascript
import Vue from 'vue';
import { Monitor } from '@yu1596882018/web-sdk';

const monitor = new Monitor({
  appId: 'vue-app',
  reportUrl: 'https://your-api.com/report',
});

// Vue 插件方式
Vue.use(monitor);

// 或在 main.js 中
new Vue({
  // ... 其他配置
  mounted() {
    // 监控已自动启动
  },
});
```

### 路由监控

```javascript
import { Monitor } from '@yu1596882018/web-sdk';

const monitor = new Monitor({
  appId: 'spa-app',
  hashPage: true, // 开启 hash 路由监控
  autoTrack: true, // 开启自动埋点
});

// 手动上报页面访问
monitor.reportPageView({
  page: '/home',
  title: '首页',
  referrer: '/login',
});
```

### 自定义事件

```javascript
// 上报自定义事件
monitor.reportEvent({
  name: 'button_click',
  category: 'user_action',
  data: {
    buttonId: 'submit-btn',
    page: '/checkout',
  },
});

// 上报用户行为
monitor.reportBehavior({
  type: 'click',
  element: 'button',
  page: '/home',
  timestamp: Date.now(),
});
```

## 🔧 配置选项

### 基础配置

```javascript
{
  appId: 'your-app-id',           // 应用ID (必填)
  userId: 'user-123',             // 用户ID (可选)
  reportUrl: 'https://api.com',   // 上报地址 (必填)
  sampleRate: 1.0,                // 采样率 0-1 (默认 1.0)
  maxCache: 10,                   // 最大缓存数量 (默认 10)
  delay: 1000,                    // 上报延迟 (默认 1000ms)
  repeat: 5,                      // 重复上报次数 (默认 5)
  autoTrack: true,                // 自动埋点 (默认 true)
  hashPage: false,                // hash路由 (默认 false)
  errorReport: true,              // 错误上报 (默认 true)
  performanceReport: true,        // 性能上报 (默认 true)
  outTime: 300000,                // 页面卸载上报时间 (默认 300000ms)
  sdkVersion: '1.0.0',            // SDK版本 (默认 '1.0.0')
  debug: false                    // 调试模式 (默认 false)
}
```

### 错误过滤配置

```javascript
{
  ignoreErrors: [
    /^Script error\.?$/,          // 忽略脚本错误
    /^Javascript error/i,         // 忽略 JavaScript 错误
    /^Uncaught ReferenceError/i   // 忽略未捕获的引用错误
  ],
  ignoreUrls: [
    'chrome-extension://',        // 忽略 Chrome 扩展
    'moz-extension://',           // 忽略 Firefox 扩展
    'safari-extension://'         // 忽略 Safari 扩展
  ]
}
```

## 📝 使用示例

### React 应用集成

```javascript
import React from 'react';
import { Monitor } from '@yu1596882018/web-sdk';

const monitor = new Monitor({
  appId: 'react-app',
  reportUrl: 'https://your-api.com/report',
});

// 在组件中使用
function App() {
  React.useEffect(() => {
    // 监控已启动
    monitor.reportPageView({
      page: window.location.pathname,
      title: document.title,
    });
  }, []);

  const handleError = () => {
    try {
      // 可能出错的代码
      throw new Error('测试错误');
    } catch (error) {
      monitor.reportError(error);
    }
  };

  return (
    <div>
      <button onClick={handleError}>触发错误</button>
    </div>
  );
}
```

### 性能监控

```javascript
// 监控页面加载性能
monitor.on('performance', data => {
  console.log('性能数据:', data);
  // data 包含:
  // - loadTime: 页面加载时间
  // - domReadyTime: DOM 准备时间
  // - firstPaintTime: 首次绘制时间
  // - firstContentfulPaint: 首次内容绘制时间
});

// 监控网络请求
monitor.on('network', data => {
  console.log('网络请求:', data);
  // data 包含:
  // - url: 请求地址
  // - method: 请求方法
  // - status: 响应状态
  // - duration: 请求耗时
});
```

### 错误处理

```javascript
// 监听错误事件
monitor.on('error', error => {
  console.log('捕获到错误:', error);
  // error 包含:
  // - message: 错误信息
  // - stack: 错误堆栈
  // - filename: 文件名
  // - lineno: 行号
  // - colno: 列号
});

// 自定义错误处理
monitor.setErrorHandler(error => {
  // 自定义错误处理逻辑
  if (error.message.includes('Network')) {
    // 网络错误特殊处理
    return false; // 不上报
  }
  return true; // 正常上报
});
```

## 🛠️ 开发

### 构建

```bash
# 安装依赖
yarn install

# 开发模式
yarn dev

# 构建生产版本
yarn build

# 清理构建文件
yarn clean
```

### 项目结构

```
web-sdk/
├── src/                    # 源代码
│   ├── index.js           # 主入口文件
│   ├── lib/               # 核心库
│   │   ├── monitor/       # 监控模块
│   │   │   ├── base/      # 基础功能
│   │   │   ├── device/    # 设备信息
│   │   │   ├── error/     # 错误监控
│   │   │   └── performance/ # 性能监控
│   │   ├── utils/         # 工具函数
│   │   └── flexible.js    # 响应式适配
│   └── index.d.ts         # TypeScript 定义
├── lib/                   # CommonJS 构建输出
├── es/                    # ES Module 构建输出
├── style/                 # 样式文件
└── README.md              # 本文档
```

## 📄 许可证

MIT 许可证 - 详情请查看 [LICENSE](../../LICENSE)

## 🤝 贡献

1. Fork 本仓库
2. 创建你的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m '添加一些很棒的功能'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个 Pull Request

## 📞 支持

- **问题反馈**: [GitHub Issues](https://github.com/yu1596882018/broad-sdk/issues)
- **邮箱**: 1596882018@qq.com
- **作者**: yu1596882018

## 🔄 更新日志

### v1.0.15

- 优化错误监控性能
- 增强 Vue.js 集成
- 改进网络请求监控
- 修复已知问题

### v1.0.14

- 新增性能监控功能
- 支持自定义事件上报
- 优化设备信息收集
- 增强路由监控

### v1.0.13

- 初始版本发布
- 基础错误监控功能
- Vue.js 插件支持
- 设备信息收集

---

由 [yu1596882018](https://github.com/yu1596882018) 用 ❤️ 制作
