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

### 安装依赖

```bash
npm install
```

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

## 工具

### Excel 转 YAML

位于 `tools/excel-to-yaml/`，用于将 Excel 格式的测试用例转换为 MidScene YAML 格式。

## 注意事项

1. 所有包都是私有包（`"private": true`），不会发布到 npm
2. 使用 npm workspaces 管理依赖
3. 测试用例文件命名需遵循规范：`<用例名>-<platform>.yaml`
4. 运行测试前请确保已配置好对应的设备环境
