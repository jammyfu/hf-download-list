# hf-download-list

一个简单的 Node.js 工具集。现在同时提供：

- 命令行工具
- 本地前端页面

输入 Hugging Face 模型页面地址或 `owner/repo`，它会调用 Hugging Face 官方 API 列出仓库文件，并输出可直接粘贴到 PikPak、Pixeldrain 或其他下载工具中的直链列表。

## 功能

- 支持 `https://huggingface.co/<owner>/<repo>/tree/<revision>` 这类页面地址
- 支持直接输入 `owner/repo`
- 默认输出纯文本下载链接，一行一个
- 支持输出 JSON
- 支持通过 `HF_TOKEN` 或 `--token` 访问需要鉴权的仓库

## 启动前端页面

```powershell
cd C:\Users\DELL\Works\hf-download-list
node .\src\server.js
```

然后打开：

```text
http://localhost:4173
```

## 使用命令行

```powershell
cd C:\Users\DELL\Works\hf-download-list
node .\src\index.js "https://huggingface.co/mistralai/Mistral-Small-4-119B-2603-NVFP4/tree/main"
```

也可以先全局链接：

```powershell
cd C:\Users\DELL\Works\hf-download-list
cmd /c npm.cmd link
hf-download-list "mistralai/Mistral-Small-4-119B-2603-NVFP4"
```

## 常用命令

输出文本列表：

```powershell
node .\src\index.js "mistralai/Mistral-Small-4-119B-2603-NVFP4"
```

输出到文件：

```powershell
node .\src\index.js "mistralai/Mistral-Small-4-119B-2603-NVFP4" --output .\downloads.txt
```

输出 JSON：

```powershell
node .\src\index.js "mistralai/Mistral-Small-4-119B-2603-NVFP4" --format json
```

指定 revision：

```powershell
node .\src\index.js "mistralai/Mistral-Small-4-119B-2603-NVFP4" --revision main
```

私有仓库：

```powershell
$env:HF_TOKEN="hf_xxx"
node .\src\index.js "owner/private-model"
```

## 输出示例

```text
https://huggingface.co/mistralai/Mistral-Small-4-119B-2603-NVFP4/resolve/main/.gitattributes
https://huggingface.co/mistralai/Mistral-Small-4-119B-2603-NVFP4/resolve/main/README.md
https://huggingface.co/mistralai/Mistral-Small-4-119B-2603-NVFP4/resolve/main/consolidated-00001-of-00013.safetensors
...
```

## 原理

项目使用 Hugging Face 官方模型信息接口获取 `siblings` 文件列表，再为每个文件生成：

```text
https://huggingface.co/<owner>/<repo>/resolve/<revision>/<filename>
```

参考：

- Hugging Face 模型页面示例: https://huggingface.co/mistralai/Mistral-Small-4-119B-2603-NVFP4/tree/main
- Hugging Face Hub 文档中 `hf_hub_url` 对应的 URL 形式: https://huggingface.co/docs/huggingface_hub/package_reference/file_download
