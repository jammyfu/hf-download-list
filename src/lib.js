const HF_BASE_URL = "https://huggingface.co";

function stripLeadingSlash(value) {
  return value.replace(/^\/+/, "");
}

function encodePath(pathname) {
  return pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

export function parseModelInput(input) {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("Input is empty.");
  }

  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    const repoId = stripLeadingSlash(trimmed).replace(/\/+$/, "");
    if (!/^[^/\s]+\/[^/\s]+$/.test(repoId)) {
      throw new Error("Expected a Hugging Face URL or repo id like owner/repo.");
    }

    return {
      repoId,
      revision: "main",
      source: trimmed
    };
  }

  const url = new URL(trimmed);
  if (url.hostname !== "huggingface.co") {
    throw new Error("Only huggingface.co URLs are supported.");
  }

  const parts = stripLeadingSlash(url.pathname).split("/").filter(Boolean);
  if (parts.length < 2) {
    throw new Error("Unable to detect repo id from the URL.");
  }

  const repoId = `${parts[0]}/${parts[1]}`;
  let revision = "main";

  if (parts[2] === "tree" || parts[2] === "blob" || parts[2] === "resolve") {
    revision = decodeURIComponent(parts[3] || "main");
  }

  return {
    repoId,
    revision,
    source: trimmed
  };
}

export function buildResolveUrl(repoId, revision, filename) {
  const safeRepoId = repoId
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${HF_BASE_URL}/${safeRepoId}/resolve/${encodeURIComponent(revision)}/${encodePath(filename)}`;
}

export async function fetchModelInfo({ repoId, revision, token, fetchImpl = fetch }) {
  const endpoint = `${HF_BASE_URL}/api/models/${repoId}/revision/${encodeURIComponent(revision)}`;
  const headers = {
    Accept: "application/json"
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetchImpl(endpoint, { headers });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Hugging Face API request failed (${response.status}): ${body || response.statusText}`);
  }

  return response.json();
}

export function extractDownloadItems(modelInfo, revision) {
  const siblings = Array.isArray(modelInfo?.siblings) ? modelInfo.siblings : [];

  return siblings
    .map((item) => item?.rfilename)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))
    .map((filename) => ({
      filename,
      url: buildResolveUrl(modelInfo.id, revision, filename)
    }));
}

export function renderTextList(items) {
  return items.map((item) => item.url).join("\n");
}
