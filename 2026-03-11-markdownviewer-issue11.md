# 2026-03-11 MarkdownViewer Issue #11 完成

## 今日完成

### Issue #11: 支持 Markdown 文件内部链接跳转

**问题描述：** 用户点击 MD 文件中的相对链接（如 `[链接](other.md)`）无法跳转预览

**解决方案：**

1. **前端拦截** (`markdown_tmpl.txt`)
   - 监听点击事件，识别 `.md`/`.markdown`/`.mk` 链接
   - 基于原文件目录解析相对路径
   - 通过 `postMessage` 通知宿主应用

2. **后端处理** (`ViewerControl.cs`)
   - 接收 `WebMessageReceived` 事件
   - 解析 JSON 消息获取目标路径
   - 调用 `FileLoad` 在当前预览窗口加载

3. **关键修复：**
   - **路径转义** - C# 模板替换时 `\` 需转义为 `\\`
   - **盘符格式** - Windows 路径必须是 `d:\` 不是 `d:`
   - **相对路径解析** - 正确处理 `..` 和 `.`
   - **初始化时序** - WebView2 未就绪时缓存待加载文件

## 技术教训

### 1. 异步初始化的坑
```csharp
// ❌ 错误：假设 InitializeWebView2() 后立即可用
InitializeWebView2(); // async void
FileLoad(fileName);   // 此时 CoreWebView2 可能还是 null

// ✅ 正确：使用标志跟踪状态
if (!isWebViewInitialized) {
    pendingFileToLoad = fileName;
    return;
}
```

### 2. C# → JS 字符串转义
```csharp
// ❌ 错误：直接替换
template.Replace("{0}", @"d:\path");
// JS 中变成：d:path（反斜杠被当成转义字符）

// ✅ 正确：双重转义
template.Replace("{0}", @"d:\path".Replace("\\", "\\\\"));
// JS 中收到：d:\\path
```

### 3. Windows 路径在 JS 中的处理
```javascript
// ❌ 错误：直接拼接
var path = baseDir + '\\' + relativePath;
// 结果：d:markdowntest\file.md（盘符后缺少反斜杠）

// ✅ 正确：单独处理盘符
if (parts[0].match(/^[a-zA-Z]:$/)) {
    driveLetter = parts[0];
    parts.shift();
}
resolvedPath = driveLetter + '\\' + parts.join('\\');
```

### 4. 调试方法论
**错误路径：** 一上来就加复杂逻辑（等待、重置、重新创建）

**正确路径：**
1. 先验证基本假设（对象是否为 null？）
2. 检查异步时序（初始化完成了吗？）
3. 添加简单日志追踪
4. 最后才考虑复杂方案

## 代码质量反思

### 这次做得好的：
- 最终方案简洁（~200 行核心代码）
- 记录了详细的调试日志
- 把教训写进 memory 文件避免重蹈覆辙

### 需要改进的：
- **先思考再行动** - 花了太多时间试错
- **基本验证要前置** - null 检查、时序检查应该最先做
- **简化优于复杂** - 多次添加复杂逻辑反而掩盖了真正问题

## 下一步

- [ ] 测试更多路径场景（UNC 路径、中文路径）
- [ ] 考虑支持 HTTP 链接跳转
- [ ] 优化错误提示（文件不存在时）
- [ ] 发布新版本 v0.5

---
*今日总结：Issue #11 完成，但调试过程暴露了"先行动后思考"的问题。下次遇到类似问题，先花 5 分钟分析可能的原因，列出验证步骤，再动手改代码。*
