#!/usr/bin/env node

import { writeFile } from "node:fs/promises";
import {
  extractDownloadItems,
  fetchModelInfo,
  parseModelInput,
  renderTextList
} from "./lib.js";

function printHelp() {
  console.log(`hf-download-list

Usage:
  hf-download-list <huggingface-url-or-repo> [--revision <name>] [--format text|json] [--output <file>]

Examples:
  hf-download-list https://huggingface.co/mistralai/Mistral-Small-4-119B-2603-NVFP4/tree/main
  hf-download-list mistralai/Mistral-Small-4-119B-2603-NVFP4 --output downloads.txt

Options:
  --revision <name>  Override revision parsed from the URL.
  --format <type>    Output "text" or "json". Default: text.
  --output <file>    Save the result to a file instead of stdout.
  --token <token>    Hugging Face token. Falls back to HF_TOKEN env var.
  --help             Show this help text.
`);
}

function parseArgs(argv) {
  const args = [...argv];
  const options = {
    format: "text"
  };
  let input;

  while (args.length > 0) {
    const arg = args.shift();
    if (!arg) {
      continue;
    }

    if (!arg.startsWith("--") && !input) {
      input = arg;
      continue;
    }

    switch (arg) {
      case "--help":
        options.help = true;
        break;
      case "--revision":
        options.revision = args.shift();
        break;
      case "--format":
        options.format = args.shift();
        break;
      case "--output":
        options.output = args.shift();
        break;
      case "--token":
        options.token = args.shift();
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return { input, options };
}

async function main() {
  const { input, options } = parseArgs(process.argv.slice(2));

  if (options.help || !input) {
    printHelp();
    process.exit(options.help ? 0 : 1);
  }

  if (!["text", "json"].includes(options.format)) {
    throw new Error('Invalid --format. Use "text" or "json".');
  }

  const parsed = parseModelInput(input);
  const revision = options.revision || parsed.revision;
  const token = options.token || process.env.HF_TOKEN;

  const modelInfo = await fetchModelInfo({
    repoId: parsed.repoId,
    revision,
    token
  });

  const items = extractDownloadItems(modelInfo, revision);
  const output =
    options.format === "json"
      ? JSON.stringify(
          {
            repoId: parsed.repoId,
            revision,
            count: items.length,
            items
          },
          null,
          2
        )
      : renderTextList(items);

  if (options.output) {
    await writeFile(options.output, `${output}\n`, "utf8");
    console.error(`Saved ${items.length} download URLs to ${options.output}`);
    return;
  }

  process.stdout.write(`${output}\n`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
