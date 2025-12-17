# @midscene/dy-lite-test

抖音小程序测试用例包

## 项目说明

本包包含抖音小程序相关的自动化测试用例，支持 Android 和 iOS 两个平台。

## 目录结构

```
dy-lite-test/
├── package.json
├── README.md
└── cases/
    ├── android/          # Android 平台测试用例
    │   ├── douyin-ximalaya-miniprogram.yaml
    │   ├── free-audio-play.yaml
    │   ├── homepage-layout-check.yaml
    │   ├── phone-code-login.yaml
    │   ├── vip-renewal.yaml
    │   └── xiaoya-wear.yaml
    └── ios/              # iOS 平台测试用例（待添加）
```

## 使用方法

### 运行所有测试用例

```bash
npm run test
```

### 运行 Android 平台测试用例

```bash
npm run test:android
```

### 运行 iOS 平台测试用例

```bash
npm run test:ios
```

### 运行指定测试用例

```bash
npm run test:case -- cases/android/douyin-ximalaya-miniprogram.yaml
```

### 查看所有测试用例

```bash
npm run list
```

## 测试用例说明

### Android 平台

- `douyin-ximalaya-miniprogram.yaml` - 抖音小程序入口测试
- `free-audio-play.yaml` - 免费音频播放测试
- `homepage-layout-check.yaml` - 首页布局检查
- `phone-code-login.yaml` - 手机验证码登录测试
- `vip-renewal.yaml` - VIP 续费测试
- `xiaoya-wear.yaml` - 小雅穿戴功能测试

### iOS 平台

iOS 平台的测试用例待添加，请参考 Android 用例格式创建对应的 iOS 版本。

## 注意事项

1. 运行测试前请确保已配置好对应的设备环境
2. Android 测试需要配置 `deviceId`
3. iOS 测试需要配置 `deviceId` 和 `bundleId`
4. 测试用例文件命名规范：`<用例名>-android.yaml` 或 `<用例名>-ios.yaml`

