# Meow Agent 桌面界面

🐱 一个可爱的、交互式的虚拟桌面界面，用于展示 Agent Meow 的任务执行状态。这个项目使用 Next.js 构建，为用户提供了一个萌系的虚拟电脑界面，让您可以看到 Meow Agent 如何在其"小电脑"上工作。

## 🖥️ 功能特点

- **拟物化的电脑界面**：包含开机动画、桌面和应用窗口
- **多应用窗口**：支持多个应用程序同时运行，包括：
  - 🖥️ 终端 (Terminal)：显示命令行操作
  - 🌐 浏览器 (Browser)：展示网页内容
  - 📁 文件浏览器 (File)：查看和管理文件
  - 📊 图表工具 (DrawIO)：可视化图表
  - 📔 日记 (Diary)：记录信息和错误
- **实时状态更新**：通过 SSE (Server-Sent Events) 实时展示 Agent 的工作状态
- **萌系界面**：可爱的设计和动画增强用户体验

## 🚀 快速开始

首先，安装依赖项：

```bash
pnpm install
```

然后，运行开发服务器：

```bash
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 即可看到结果。

## 🔧 使用方法

1. 打开应用后，点击电源按钮启动 Meow Agent 的电脑
2. 输入要处理的仓库或任务 URL
3. 等待启动完成后，观察 Meow Agent 如何在不同的应用窗口中执行任务
4. 您可以打开/关闭不同的应用窗口，重新排列窗口位置，以便更好地观察 Agent 的工作情况

## 🛠️ 技术栈

- Next.js 
- React
- TypeScript
- Styled Components
- Server-Sent Events (SSE) 用于实时通信

## 📝 开发计划

- 添加更多可爱的交互动画
- 支持更多类型的任务和应用程序
- 改进 UI/UX 设计，增加更多萌系元素
- 提供更多自定义选项

---

🐾 Meow Agent - 您的萌系 AI 助手！
