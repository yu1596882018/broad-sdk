# 贡献指南

感谢您对 Broad SDK 的关注！我们欢迎所有形式的贡献。

## 🚀 快速开始

### 环境准备

1. 确保您的 Node.js 版本 >= 12.0.0
2. 确保您的 Yarn 版本 >= 1.22.0
3. Fork 本仓库
4. 克隆您的 Fork 到本地

```bash
git clone https://github.com/YOUR_USERNAME/broad-sdk.git
cd broad-sdk
```

### 安装依赖

```bash
yarn install
```

### 开发模式

```bash
# 启动所有包的开发模式
yarn dev

# 或者单独启动某个包
yarn build:web-sdk
yarn build:server-sdk
```

## 📝 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建过程或辅助工具的变动

示例：

```bash
git commit -m "feat: add new monitoring feature"
git commit -m "fix: resolve import path issue"
git commit -m "docs: update README with new examples"
```

## 🔧 开发流程

1. **创建分支**

   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-fix-name
   ```

2. **开发代码**

   - 遵循现有的代码风格
   - 添加必要的注释
   - 确保代码通过测试

3. **提交代码**

   ```bash
   git add .
   git commit -m "feat: your commit message"
   ```

4. **推送分支**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **创建 Pull Request**
   - 在 GitHub 上创建 Pull Request
   - 填写详细的描述
   - 关联相关的 Issue

## 📋 Pull Request 检查清单

在提交 Pull Request 之前，请确保：

- [ ] 代码符合项目规范
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] 提交信息符合规范
- [ ] 所有测试通过
- [ ] 构建成功

## 🐛 报告 Bug

如果您发现了 Bug，请：

1. 使用 GitHub Issues 报告
2. 提供详细的复现步骤
3. 包含环境信息（操作系统、Node.js 版本等）
4. 如果可能，提供最小复现示例

## 💡 功能建议

如果您有功能建议：

1. 使用 GitHub Issues 讨论
2. 详细描述功能需求和使用场景
3. 考虑实现的复杂度和影响范围

## 📚 文档贡献

文档贡献同样重要：

- 修复文档中的错误
- 添加缺失的示例
- 改进文档的可读性
- 翻译文档

## 🤝 行为准则

- 尊重所有贡献者
- 保持友好和专业的交流
- 接受建设性的批评
- 帮助新贡献者

## 📞 联系我们

如果您有任何问题：

- 邮箱：1596882018@qq.com
- GitHub Issues：[https://github.com/yu1596882018/broad-sdk/issues](https://github.com/yu1596882018/broad-sdk/issues)

感谢您的贡献！🎉
