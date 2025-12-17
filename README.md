# MidScene Example Monorepo

MidScene 自动化测试用例 Monorepo 项目

## 项目结构

本项目采用 Monorepo 架构，将不同的测试项目组织为独立的包：

```
midscene-example/
├── packages/
│   ├── dy-lite-test/          # 抖音小程序测试用例包
│   │   ├── cases/
│   │   │   ├── android/        # Android 平台测试用例
│   │   │   └── ios/            # iOS 平台测试用例
│   │   ├── package.json
│   │   └── README.md
│   └── xiaoya-demo/            # 喜马拉雅穿戴App测试用例包
│       ├── cases/
│       │   ├── android/        # Android 平台测试用例
│       │   └── ios/            # iOS 平台测试用例
│       ├── package.json
│       └── README.md
├── tools/                      # 工具目录
│   └── excel-to-yaml/          # Excel 转 YAML 工具
├── package.json                # 根 package.json (workspaces 配置)
└── README.md                   # 本文件
```

## 快速开始

### 环境配置

本项目使用**统一的 `.env` 文件管理**，所有 packages 共享根目录的环境变量配置。

#### 首次设置

1. **创建 `.env` 文件**（如果还没有）：
   ```bash
   cp env-example .env
   ```

2. **编辑 `.env` 文件**，填入你的配置：
   ```bash
   # 编辑 .env 文件
   vim .env
   ```

3. **设置符号链接**（自动执行，或手动运行）：
   ```bash
   npm run setup:env
   ```

   这会为所有 packages 创建指向根目录 `.env` 的符号链接，确保每个包都能访问相同的环境变量。

#### 环境变量说明

`.env` 文件包含 MidScene 所需的配置，例如：
- `OPENAI_BASE_URL` - API 基础 URL
- `OPENAI_API_KEY` - API 密钥
- `MIDSCENE_MODEL_NAME` - 模型名称
- `MIDSCENE_USE_DOUBAO_VISION` - 是否使用豆包视觉模型

### 安装依赖

```bash
npm install
```

> 注意：`npm install` 会自动执行 `setup:env` 脚本，确保所有包的 `.env` 符号链接已设置。

### 运行测试

#### 运行特定包的测试

```bash
# 运行 dy-lite-test 包的所有测试
npm run test --workspace=packages/dy-lite-test

# 运行 xiaoya-demo 包的 Android 测试
npm run test:android --workspace=packages/xiaoya-demo
```

#### 在包目录内运行

```bash
# 进入包目录
cd packages/dy-lite-test

# 运行所有测试
npm run test

# 运行 Android 测试
npm run test:android

# 运行 iOS 测试
npm run test:ios

# 运行指定用例
npm run test:case -- cases/android/douyin-ximalaya-miniprogram.yaml
```

## 包说明

### @midscene/dy-lite-test

抖音小程序测试用例包，包含以下测试场景：
- 小程序入口测试
- 免费音频播放测试
- 首页布局检查
- 手机验证码登录测试
- VIP 续费测试
- 小雅穿戴功能测试

详细说明请查看 [packages/dy-lite-test/README.md](./packages/dy-lite-test/README.md)

### @midscene/xiaoya-demo

喜马拉雅穿戴App测试用例包，包含以下测试场景：
- 分类筛选功能测试
- 搜索功能测试
- 小雅初始化测试

详细说明请查看 [packages/xiaoya-demo/README.md](./packages/xiaoya-demo/README.md)

## 平台支持

### Android / iOS 多平台项目

对于支持 Android 和 iOS 的项目（如抖音小程序、喜马拉雅穿戴App），测试用例需要分开两个文件：

- Android 用例：`cases/android/<用例名>-android.yaml`
- iOS 用例：`cases/ios/<用例名>-ios.yaml`

### Web 单平台项目

对于仅支持 Web 的项目（如通用会员SDK），测试用例放在：

- Web 用例：`cases/web/<用例名>.yaml`

## 添加新包

1. 在 `packages/` 目录下创建新包目录
2. 创建 `package.json`，设置包名和脚本
3. 创建 `cases/` 目录，按平台分类（android/ios/web）
4. 添加测试用例文件
5. 创建 `README.md` 说明文档
6. **运行设置脚本**，为新包创建共享配置文件的符号链接：
   ```bash
   npm run setup:env
   ```

## 工具

### Excel 转 YAML

位于 `tools/excel-to-yaml/`，用于将 Excel 格式的测试用例转换为 MidScene YAML 格式。

## 统一配置文件管理

### 共享配置文件

本项目采用**统一的配置文件管理**，所有 packages 共享根目录的配置：

- **`.env`**：环境变量配置（MidScene API 密钥等）
- **`.gitignore`**：Git 忽略规则配置

每个 package 目录下的这些文件都是指向根目录的符号链接，确保配置统一管理。

### 设置共享配置

#### 首次设置

```bash
# 运行设置脚本（自动创建符号链接）
npm run setup:env
```

#### 手动设置

如果需要手动为新的 package 创建符号链接：

```bash
# 方法1: 使用脚本（推荐）
npm run setup:env

# 方法2: 手动创建
cd packages/your-package-name
ln -sf ../../.env .env
ln -sf ../../.gitignore .gitignore
```

### 环境变量配置

#### 创建和编辑 `.env`

1. **创建 `.env` 文件**（如果还没有）：
   ```bash
   cp env-example .env
   ```

2. **编辑 `.env` 文件**，填入你的配置：
   ```bash
   vim .env
   ```

3. **运行设置脚本**：
   ```bash
   npm run setup:env
   ```

#### 环境变量说明

`.env` 文件包含 MidScene 所需的配置，例如：
- `OPENAI_BASE_URL` - API 基础 URL
- `OPENAI_API_KEY` - API 密钥
- `MIDSCENE_MODEL_NAME` - 模型名称
- `MIDSCENE_USE_DOUBAO_VISION` - 是否使用豆包视觉模型

### 为特定包使用独立配置

如果某个包需要独立的配置文件：

```bash
cd packages/your-package-name
# 删除符号链接
rm .env .gitignore
# 创建独立的文件
cp ../../env-example .env
cp ../../.gitignore .gitignore
# 编辑独立配置
vim .env
vim .gitignore
```

## 注意事项

1. 所有包都是私有包（`"private": true"`），不会发布到 npm
2. 使用 npm workspaces 管理依赖
3. 测试用例文件命名需遵循规范：`<用例名>-<platform>.yaml`
4. 运行测试前请确保已配置好对应的设备环境
5. **环境变量管理**：所有 packages 默认共享根目录的 `.env` 文件，通过符号链接实现
