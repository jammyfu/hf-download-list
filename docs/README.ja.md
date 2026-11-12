# hf-download-list

![hf-download-list](../.github/social-preview.png)

[English](README.en.md) · [简体中文](README.zh-CN.md) · [繁體中文（臺灣）](README.zh-TW.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

## Hugging Face モデルのファイルをリンク一覧にする

単一モデルは CLI、複数モデルは Web 画面で扱えます。公式 resolve URL を TXT または JSON で出力します。モデルの重みはダウンロードしません。

### 軽量なモデルファイルリンク作成ツール

| → | |
| --- | --- |
| [CLI とサーバーのソース](../src/) | JSON / source |
| [Web 画面のソース](../public/) | Browse |

画面は英語・中国語対応です。5言語ガイドは画面の多言語化ではありません。モデルのみ対応し、datasets と Spaces は非対応です。制限付きファイルの利用には権限が必要で、URL はアクセス権を与えません。

### テスト実行

```bash
npm test
npm start
```

package.json は MIT を宣言していますが、LICENSE ファイルがありません。再配布の許諾に依拠する前に管理者へ確認してください。

[Repository README](../README.md)
