import test from "node:test";
import assert from "node:assert/strict";

import {
  buildResolveUrl,
  extractDownloadItems,
  parseModelInput,
  renderTextList
} from "../src/lib.js";

test("parseModelInput accepts a repo id", () => {
  assert.deepEqual(parseModelInput("mistralai/Mistral-7B-Instruct-v0.2"), {
    repoId: "mistralai/Mistral-7B-Instruct-v0.2",
    revision: "main",
    source: "mistralai/Mistral-7B-Instruct-v0.2"
  });
});

test("parseModelInput extracts repo id and revision from tree URL", () => {
  assert.deepEqual(
    parseModelInput("https://huggingface.co/mistralai/Mistral-Small-4-119B-2603-NVFP4/tree/main"),
    {
      repoId: "mistralai/Mistral-Small-4-119B-2603-NVFP4",
      revision: "main",
      source: "https://huggingface.co/mistralai/Mistral-Small-4-119B-2603-NVFP4/tree/main"
    }
  );
});

test("buildResolveUrl generates a direct file URL", () => {
  assert.equal(
    buildResolveUrl("mistralai/Mistral-Small-4-119B-2603-NVFP4", "main", "consolidated-00001-of-00013.safetensors"),
    "https://huggingface.co/mistralai/Mistral-Small-4-119B-2603-NVFP4/resolve/main/consolidated-00001-of-00013.safetensors"
  );
});

test("extractDownloadItems sorts and converts siblings to direct links", () => {
  const items = extractDownloadItems(
    {
      id: "org/model",
      siblings: [
        { rfilename: "b.bin" },
        { rfilename: "a.json" }
      ]
    },
    "main"
  );

  assert.deepEqual(items, [
    {
      filename: "a.json",
      url: "https://huggingface.co/org/model/resolve/main/a.json"
    },
    {
      filename: "b.bin",
      url: "https://huggingface.co/org/model/resolve/main/b.bin"
    }
  ]);
});

test("renderTextList returns newline separated URLs", () => {
  assert.equal(
    renderTextList([
      { url: "https://huggingface.co/org/model/resolve/main/a.json" },
      { url: "https://huggingface.co/org/model/resolve/main/b.bin" }
    ]),
    "https://huggingface.co/org/model/resolve/main/a.json\nhttps://huggingface.co/org/model/resolve/main/b.bin"
  );
});
