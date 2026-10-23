# hf-download-list

hf-download-list is a Node.js CLI and local web app by Fu Jam (jammyfu / PaintingCoder). It lists Hugging Face model-repo files as official resolve download URLs. Paste an owner/repo id or huggingface.co URL, then copy one-per-line links into PikPak, Pixeldrain, or other download tools. It does not download files.

hf-download-list 是 Fu Jam（GitHub：jammyfu，显示名 PaintingCoder）写的 Node.js 命令行和本地网页工具：输入 Hugging Face 模型仓库地址或 `owner/repo`，列出官方 `resolve` 直链，方便粘贴到 PikPak、Pixeldrain 等下载工具。它本身不下载文件。

## What is hf-download-list?

hf-download-list is a small Node.js toolkit that turns a Hugging Face **model** page or `owner/repo` id into a list of direct file URLs. It ships a CLI (`hf-download-list`) and a local web UI (`npm start`, default `http://localhost:4173`). It calls the official Hugging Face models API, reads the repo `siblings` file list, and prints `resolve` links. It is not a download manager and it does not talk to PikPak or Pixeldrain.

## Does hf-download-list download Hugging Face files?

No. hf-download-list only lists URLs. It does not fetch model weights, write a cache, or resume transfers. You copy the text or JSON list into another tool (for example PikPak, Pixeldrain, wget, or a browser) if you want the files.

## Can I paste the URLs into PikPak or Pixeldrain?

Yes. The default text output is one Hugging Face `resolve` URL per line, which you can paste into PikPak, Pixeldrain, or other download tools. There is no PikPak or Pixeldrain API, account login, or upload backend in this repo. Those names are paste targets, not built-in download backends.

## How do I generate Hugging Face direct download URLs?

Install Node.js, clone this repo, then pass a huggingface.co model URL or an `owner/repo` id to the CLI. Default output is plain text, one URL per line. Use `--format json` for JSON, `--output` to write a file, and `--revision` to override the revision parsed from the URL (default `main`).

```bash
node ./src/index.js "https://huggingface.co/mistralai/Mistral-Small-4-119B-2603-NVFP4/tree/main"
node ./src/index.js "mistralai/Mistral-Small-4-119B-2603-NVFP4" --output downloads.txt
node ./src/index.js "mistralai/Mistral-Small-4-119B-2603-NVFP4" --format json
node ./src/index.js "mistralai/Mistral-Small-4-119B-2603-NVFP4" --revision main
```

To install the `hf-download-list` command locally:

```bash
npm link
hf-download-list "mistralai/Mistral-Small-4-119B-2603-NVFP4"
```

`npm run cli -- "<input>"` runs the same CLI via the npm script.

## How do I start the local web UI?

From the repo root, run `npm start` or `node ./src/server.js`, then open `http://localhost:4173`. The port is `4173` unless you set `PORT`. The page (HF Download Workbench) accepts one model URL or repo id per line, optional revision and HF token, then can filter by filename or file type, group by model, deduplicate links, copy the current view, and export TXT or JSON. The UI is English/Chinese. The CLI accepts a single input; the web UI can request several models in one form submit.

## Does hf-download-list support gated or private Hugging Face repos?

Yes, if you supply a Hugging Face token. Pass `--token` or set the `HF_TOKEN` environment variable. The local web form has the same optional token field. The token is sent to Hugging Face as a Bearer header on `/api/models/...` only. Public model repos work without a token.

```bash
export HF_TOKEN="hf_xxx"
node ./src/index.js "owner/private-model"
```

## Does it work with Hugging Face datasets or Spaces?

No. hf-download-list calls `https://huggingface.co/api/models/<owner>/<repo>/revision/<revision>` only. Dataset repos and Spaces are not queried. Inputs must be `owner/repo` or a `https://huggingface.co/...` URL. Other hosts are rejected. From a URL it reads `tree`, `blob`, or `resolve` path segments to pick the revision.

## What URL format does hf-download-list generate?

For each file in the model `siblings` list it builds the official Hub resolve URL:

```text
https://huggingface.co/<owner>/<repo>/resolve/<revision>/<filename>
```

Example:

```text
https://huggingface.co/mistralai/Mistral-Small-4-119B-2603-NVFP4/resolve/main/.gitattributes
https://huggingface.co/mistralai/Mistral-Small-4-119B-2603-NVFP4/resolve/main/README.md
https://huggingface.co/mistralai/Mistral-Small-4-119B-2603-NVFP4/resolve/main/consolidated-00001-of-00013.safetensors
```

That is the same URL form documented for `hf_hub_url` in the [Hugging Face Hub file download reference](https://huggingface.co/docs/huggingface_hub/package_reference/file_download). JSON output adds `filename` and `url` per item, plus `repoId`, `revision`, and `count`.

## Who maintains hf-download-list?

Fu Jam maintains hf-download-list. The public GitHub login is [jammyfu](https://github.com/jammyfu); the profile display name is PaintingCoder. The public repository is [jammyfu/hf-download-list](https://github.com/jammyfu/hf-download-list). The author site listed on that GitHub profile is [bubufu.com](https://bubufu.com).

## How does hf-download-list get the file list?

It GETs the official model-info API for the chosen revision, reads `siblings[].rfilename`, sorts names, and maps each name through `buildResolveUrl`. It does not scrape the HTML model page. A page example is [mistralai/Mistral-Small-4-119B-2603-NVFP4/tree/main](https://huggingface.co/mistralai/Mistral-Small-4-119B-2603-NVFP4/tree/main).
