# 自动雨量站巡检报告填写工具

一个用于填写自动雨量站巡检报告的网页版工具，支持导出PDF格式报告，可在电脑和手机上使用。

## 功能特性

- 填写站点基本信息（名称、地址、编码、经纬度等）
- 填写检查结果
- 上传巡检照片（最多3张）
- 自动获取当前位置和日期
- 查看已添加的站点信息
- 选择多个站点批量导出PDF报告（合并为单个PDF文件）
- 支持多种报告类型（雨量站、水位站、图像站）
- 支持汛期选择（汛前、汛中、汛后）
- 响应式设计，适配电脑和手机
- PWA支持，可添加到主屏幕

## 项目结构

```
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # 核心功能脚本
├── manifest.json       # PWA配置文件
├── service-worker.js   # 服务 worker 文件
├── icon-192x192.png    # 192x192 图标
└── icon-512x512.png    # 512x512 图标
```

## 如何部署到GitHub Pages

### 步骤1：准备项目文件

确保项目包含以下文件：
- `index.html`
- `style.css`
- `script.js`
- `manifest.json`
- `service-worker.js`
- `icon-192x192.png`（需要创建）
- `icon-512x512.png`（需要创建）

### 步骤2：创建GitHub仓库

1. 登录 [GitHub](https://github.com/)
2. 点击右上角 "+" → 新建仓库
3. 仓库名称：例如 `inspection-report-tool`
4. 选择 "公开" → 点击 "创建仓库"

### 步骤3：上传项目文件

1. 进入仓库 → 点击 "Add file" → "Upload files"
2. 拖拽所有项目文件到上传区域
3. 填写提交信息 → 点击 "Commit changes"

### 步骤4：启用GitHub Pages

1. 进入仓库 → 点击 "Settings" → 左侧菜单 "Pages"
2. 在 "Build and deployment" 部分：
   - Source：选择 "Deploy from a branch"
   - Branch：选择 "main" → 点击 "Save"
3. 等待几分钟，GitHub会生成访问网址（例如：`https://your-username.github.io/inspection-report-tool/`）

### 步骤5：在手机上访问和使用

1. 在手机浏览器中输入部署后的网址
2. **添加到主屏幕**：
   - **iOS (Safari)**：点击分享按钮 → 添加到主屏幕
   - **Android (Chrome)**：点击菜单按钮 → 添加到主屏幕
3. 开始使用应用填写和导出巡检报告

## 如何使用

1. 打开应用
2. 选择报告类型和汛期
3. 填写站点基本信息
4. 点击"自动定位"按钮获取当前位置（需要授权）
5. 点击"获取当日时间"按钮自动填写日期
6. 填写检查结果
7. 上传巡检照片（最多3张）
8. 点击"添加站点"按钮保存信息
9. 在"已添加站点"列表中选择要导出的站点
10. 点击"导出PDF"按钮生成并下载PDF报告

## 技术实现

- HTML5 + CSS3 + JavaScript
- jsPDF + html2canvas 用于生成PDF
- FileReader API 用于照片上传和预览
- Geolocation API 用于获取当前位置
- PWA 支持，可添加到主屏幕
- 响应式设计，适配不同屏幕尺寸

## 注意事项

- 照片上传会转换为base64格式存储在浏览器中，请确保浏览器有足够的内存
- PDF生成可能需要一些时间，特别是当上传了多张照片时
- 为了获得最佳效果，建议使用Chrome或Firefox浏览器
- 首次访问时可能需要加载PDF生成库，速度会稍慢

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 故障排除

### 无法获取位置
- 确保浏览器已授权位置访问权限
- 确保设备开启了定位服务
- 确保网络连接正常

### PDF生成失败
- 检查浏览器控制台是否有错误信息
- 确保网络连接正常（需要加载PDF生成库）
- 减少照片数量或大小后重试

### 照片不显示
- 确保照片格式正确（支持JPG、PNG等常见格式）
- 确保浏览器支持FileReader API

## 许可证

MIT License