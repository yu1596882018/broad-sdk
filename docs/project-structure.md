# 项目结构

```
broad-sdk/
├── .github/                    # GitHub 配置
│   └── workflows/
│       └── ci.yml             # CI/CD 配置
├── docs/                       # 文档目录
│   └── project-structure.md   # 项目结构说明
├── examples/                   # 使用示例
│   ├── web-sdk-demo.html     # Web SDK 演示页面
│   └── vue-demo.js           # Vue.js 使用示例
├── packages/                   # 包目录
│   ├── web-sdk/              # Web SDK
│   │   ├── src/
│   │   │   ├── lib/          # 核心库文件
│   │   │   │   ├── monitor/  # 监控相关
│   │   │   │   │   ├── error/        # 错误监控
│   │   │   │   │   ├── performance/  # 性能监控
│   │   │   │   │   ├── base/         # 基础配置
│   │   │   │   │   ├── device/       # 设备信息
│   │   │   │   │   └── utils/        # 工具函数
│   │   │   │   ├── historyTrack.js   # 路由追踪
│   │   │   │   ├── loadingManage.js  # 加载管理
│   │   │   │   ├── flexible.js       # 响应式布局
│   │   │   │   └── eventBus.js       # 事件总线
│   │   │   ├── utils/
│   │   │   │   └── servicesDecorator.js # 接口缓存装饰器
│   │   │   ├── style/        # 样式文件
│   │   │   │   ├── resetMobile.scss  # 移动端重置样式
│   │   │   │   ├── resetPc.scss      # PC端重置样式
│   │   │   │   └── mixins.scss       # 样式混入
│   │   │   └── index.js      # 主入口文件
│   │   ├── package.json      # 包配置
│   │   ├── .fatherrc.js      # 构建配置
│   │   └── LICENSE.txt       # 许可证
│   └── server-sdk/           # Server SDK
│       ├── utils/            # 工具函数
│       ├── package.json      # 包配置
│       └── LICENSE.txt       # 许可证
├── .gitignore                # Git 忽略文件
├── CHANGELOG.md              # 更新日志
├── CONTRIBUTING.md           # 贡献指南
├── LICENSE                   # 项目许可证
├── README.md                 # 项目说明
├── lerna.json               # Lerna 配置
├── package.json             # 根包配置
└── yarn.lock                # Yarn 锁定文件
```

## 核心功能模块

### Web SDK (`@yu1596882018/web-sdk`)

#### 1. 监控系统 (MonitorJS)

- **错误监控**: JS 错误、Promise 错误、资源加载错误、Ajax 错误、Vue 错误、Console 错误
- **性能监控**: 页面性能指标收集、网络速度监控
- **设备信息**: 浏览器、操作系统、设备类型等

#### 2. 路由追踪 (historyTrack)

- 完整的浏览器历史记录追踪
- 支持 Vue Router
- 前进、后退、跳转、刷新等场景处理

#### 3. 加载管理 (loadingManage)

- 智能的请求加载状态管理
- 防抖处理，避免频繁显示/隐藏
- 支持多个并发请求

#### 4. 响应式布局 (flexible)

- 移动端适配解决方案
- 自动设置 rem 基准值
- 支持最大/最小宽度限制

#### 5. 接口缓存 (CacheData)

- 装饰器模式的接口数据缓存
- 支持 Promise 和同步函数
- 自动错误处理和缓存清理

#### 6. 样式工具

- 移动端和 PC 端样式重置
- 常用样式混入
- 响应式布局辅助

### Server SDK (`@yu1596882018/server-sdk`)

- 服务端工具函数
- Node.js 环境下的实用工具

## 技术栈

- **构建工具**: Father (UmiJS)
- **包管理**: Lerna + Yarn Workspaces
- **语言**: JavaScript (ES6+)
- **样式**: SCSS
- **框架支持**: Vue 2.x
- **类型支持**: TypeScript 声明文件

## 开发流程

1. **安装依赖**: `yarn install`
2. **开发模式**: `yarn dev`
3. **构建**: `yarn build`
4. **发布**: `yarn publish`

## 包发布

项目使用 Lerna 进行多包管理，支持独立版本控制：

- `@yu1596882018/web-sdk`: 当前版本 1.0.15
- `@yu1596882018/server-sdk`: 当前版本 1.0.8
