#!/usr/bin/env node

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  extractDownloadItems,
  fetchModelInfo,
  parseModelInput
} from "./lib.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "..", "public");
const port = Number(process.env.PORT || 4173);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload));
}

async function serveStatic(response, pathname) {
  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const normalizedPath = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
  const fullPath = path.join(publicDir, normalizedPath);
  const extension = path.extname(fullPath);

  try {
    const file = await readFile(fullPath);
    response.writeHead(200, {
      "Content-Type": contentTypes[extension] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    response.end(file);
  } catch {
    sendJson(response, 404, { error: "Not found" });
  }
}

async function readJsonBody(request) {
  let raw = "";
  for await (const chunk of request) {
    raw += chunk;
  }

  if (!raw) {
    return {};
  }

  return JSON.parse(raw);
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === "POST" && url.pathname === "/api/downloads") {
    try {
      const body = await readJsonBody(request);
      const rawInputs = Array.isArray(body.inputs) ? body.inputs : [body.input || ""];
      const uniqueInputs = [...new Set(rawInputs.map((item) => String(item).trim()).filter(Boolean))];

      if (uniqueInputs.length === 0) {
        throw new Error("At least one model URL or repo id is required.");
      }

      const results = await Promise.allSettled(
        uniqueInputs.map(async (entry) => {
          const parsed = parseModelInput(entry);
          const revision = body.revision?.trim() || parsed.revision;
          const modelInfo = await fetchModelInfo({
            repoId: parsed.repoId,
            revision,
            token: body.token?.trim() || process.env.HF_TOKEN
          });
          const items = extractDownloadItems(modelInfo, revision);

          return {
            input: entry,
            repoId: parsed.repoId,
            revision,
            count: items.length,
            items
          };
        })
      );

      const models = [];
      const errors = [];

      for (const result of results) {
        if (result.status === "fulfilled") {
          models.push(result.value);
        } else {
          errors.push(result.reason instanceof Error ? result.reason.message : "Unknown error");
        }
      }

      if (models.length === 0) {
        throw new Error(errors[0] || "All model requests failed.");
      }

      sendJson(response, 200, {
        count: models.reduce((sum, model) => sum + model.count, 0),
        modelCount: models.length,
        models,
        errors
      });
    } catch (error) {
      sendJson(response, 400, {
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
    return;
  }

  if (request.method === "GET") {
    await serveStatic(response, url.pathname);
    return;
  }

  sendJson(response, 405, { error: "Method not allowed" });
});

server.listen(port, () => {
  console.log(`hf-download-list UI running at http://localhost:${port}`);
});
