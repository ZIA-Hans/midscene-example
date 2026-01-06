# 🚀 MidScene 测试项目新手运行指南

本指南帮助你快速上手运行现有的自动化测试用例。

## 📋 前置条件

在开始之前，确保你已经安装了以下工具：

| 工具 | 说明 | 检查命令 |
|------|------|----------|
| **Node.js** | 推荐 v18+ | `node -v` |
| **npm** | 通常随 Node.js 安装 | `npm -v` |
| **ADB** | Android Debug Bridge（Android 测试必需） | `adb version` |
| **豆包 API Key** | MidScene 需要的 AI 模型密钥 | 在火山引擎控制台获取 |

---

## 📦 第一步：安装依赖

```bash
- 保持当前打开了本项目

# 安装依赖（会自动执行环境配置脚本）
npm install
```

---

## ⚙️ 第二步：配置环境变量

### 2.1 创建 .env 文件

```bash
# 从模板复制
cp env-example .env
```

### 2.2 编辑 .env 文件

打开 `.env` 文件，填入你的配置：

```bash
# MidScene AI 模型配置
MIDSCENE_MODEL_BASE_URL="https://ark.cn-beijing.volces.com/api/v3"
MIDSCENE_MODEL_API_KEY="<替换为你的 API Key>"
MIDSCENE_MODEL_NAME="doubao-seed-1-6-vision-250815"
MIDSCENE_MODEL_FAMILY="doubao-vision"

# Android 设备 ID（运行 Android 测试时必填）
ANDROID_DEVICE_ID="<替换为你的设备ID>"
```

### 2.3 获取 Android 设备 ID

```bash
# 1. 手机连接电脑，开启开发者模式和 USB 调试
# 2. 运行以下命令获取设备 ID
adb devices

# 输出示例：
# List of devices attached
# ABCD12345678    device    <-- 这个就是你的设备 ID
```

---

## ▶️ 第三步：运行测试用例

### 方式一：从根目录运行（推荐）

```bash
# 运行指定包的所有测试
npm run test --workspace=packages/wx-mini-base

# 运行指定包的 Android 测试
npm run test:android --workspace=packages/wx-mini-base
```

### 方式二：进入包目录运行

```bash
# 进入具体的包目录
cd packages/wx-mini-base

# 运行所有测试
npm run test

# 运行 Android 测试
npm run test:android

# 运行指定的单个用例文件
npx midscene cases/android/6_wx-auth-login.yaml
```

## 🔍 常用命令速查

```bash
# 查看某个包下有哪些用例
ls packages/wx-mini-base/cases/android/

# 运行单个用例
npx midscene packages/wx-mini-base/cases/android/6_wx-auth-login.yaml

# 运行整个文件夹的用例
npx midscene packages/wx-mini-base/cases/android/
```

---

## ⚠️ 常见问题

| 问题 | 解决方案 |
|------|----------|
| `MIDSCENE_MODEL_API_KEY not found` | 检查 `.env` 文件是否存在且配置正确 |
| `Device not found` | 运行 `adb devices` 检查设备连接，确保 USB 调试已开启 |
| `adb command not found` | 安装 Android SDK Platform Tools 并添加到 PATH |
| `Permission denied` | 手机上点击"允许 USB 调试" |

---

## 📊 查看测试结果

测试运行后，结果会保存在 `midscene_run/` 目录：

```
midscene_run/
├── report/    # HTML 测试报告（可用浏览器打开）
├── output/    # JSON 格式的测试输出
├── log/       # 详细日志文件
└── cache/     # 缓存文件
```

---

## 💡 TL;DR (快速开始)

```bash
# 1. 安装依赖
npm install

# 2. 配置环境
cp env-example .env
# 编辑 .env，填入 API Key 和设备 ID

# 3. 连接手机，运行测试
npm run test:android --workspace=packages/wx-mini-base
```

---

## 📚 更多信息

- 详细项目说明请查看 [README.md](./README.md)
- 各测试包的详细说明请查看对应目录下的 README.md

