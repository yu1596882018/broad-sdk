# @yu1596882018/server-sdk

Node.js 应用程序的服务器端工具和实用程序

## 📦 安装

```bash
npm install @yu1596882018/server-sdk
# 或者
yarn add @yu1596882018/server-sdk
```

## 🚀 功能特性

- **二维码生成**: 从文本或 URL 生成二维码
- **日志工具**: 支持不同级别和格式的高级日志记录
- **服务器工具**: 常用的服务器端辅助函数

## 📖 API 参考

### 二维码生成

```javascript
const { generateQRCode } = require('@yu1596882018/server-sdk');

// 从文本生成二维码
const qrCode = await generateQRCode('https://example.com');

// 使用自定义选项生成二维码
const qrCodeWithOptions = await generateQRCode('Hello World', {
  width: 300,
  height: 300,
  color: '#000000',
  backgroundColor: '#ffffff',
});
```

### 日志工具

```javascript
const { Logger } = require('@yu1596882018/server-sdk');

const logger = new Logger({
  level: 'info',
  format: 'json',
  output: 'file', // 或 'console'
});

logger.info('应用程序已启动');
logger.error('发生错误', { error: '详细信息' });
logger.warn('警告信息');
logger.debug('调试信息');
```

### 服务器工具

```javascript
const { ServerUtils } = require('@yu1596882018/server-sdk');

// 获取服务器信息
const serverInfo = ServerUtils.getServerInfo();

// 验证配置
const isValid = ServerUtils.validateConfig(config);
```

## 🔧 配置

### 日志配置

```javascript
{
  level: 'info',           // 日志级别: error, warn, info, debug
  format: 'json',          // 输出格式: json, text
  output: 'console',       // 输出目标: console, file
  filePath: './logs',      // 日志文件路径 (当 output 为 'file' 时)
  maxSize: '10m',          // 最大日志文件大小
  maxFiles: 5              // 最大日志文件数量
}
```

### 二维码配置

```javascript
{
  width: 200,              // 二维码宽度
  height: 200,             // 二维码高度
  color: '#000000',        // 二维码颜色
  backgroundColor: '#ffffff', // 背景颜色
  margin: 4,               // 二维码周围边距
  errorCorrectionLevel: 'M' // 纠错级别: L, M, Q, H
}
```

## 📝 使用示例

### Express.js 集成

```javascript
const express = require('express');
const { generateQRCode, Logger } = require('@yu1596882018/server-sdk');

const app = express();
const logger = new Logger();

app.get('/qr/:text', async (req, res) => {
  try {
    const qrCode = await generateQRCode(req.params.text);
    res.type('image/png').send(qrCode);
    logger.info('二维码已生成', { text: req.params.text });
  } catch (error) {
    logger.error('生成二维码失败', { error: error.message });
    res.status(500).json({ error: '生成二维码失败' });
  }
});

app.listen(3000, () => {
  logger.info('服务器已启动，端口 3000');
});
```

### Koa.js 集成

```javascript
const Koa = require('koa');
const { generateQRCode, Logger } = require('@yu1596882018/server-sdk');

const app = new Koa();
const logger = new Logger();

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

app.use(async ctx => {
  if (ctx.path.startsWith('/qr/')) {
    const text = ctx.path.slice(4);
    const qrCode = await generateQRCode(text);
    ctx.type = 'image/png';
    ctx.body = qrCode;
  } else {
    ctx.body = 'Hello World';
  }
});

app.listen(3000);
```

## 🛠️ 开发

### 构建

```bash
# 安装依赖
yarn install

# 构建包
yarn build

# 运行测试
yarn test
```

### 项目结构

```
server-sdk/
├── index.js          # 主入口文件
├── index.d.ts        # TypeScript 定义
├── utils/            # 工具函数
│   ├── codeToQR.js   # 二维码生成
│   └── logUtil.js    # 日志工具
└── README.md         # 本文档
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

### v1.0.8

- 初始版本发布
- 二维码生成功能
- 高级日志工具
- 服务器工具函数

---

由 [yu1596882018](https://github.com/yu1596882018) 用 ❤️ 制作
