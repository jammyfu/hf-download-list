const form = document.querySelector("#download-form");
const input = document.querySelector("#input");
const revisionInput = document.querySelector("#revision");
const tokenInput = document.querySelector("#token");
const statusEl = document.querySelector("#status");
const countEl = document.querySelector("#count");
const repoIdEl = document.querySelector("#repo-id");
const requestHealthEl = document.querySelector("#request-health");
const outputEl = document.querySelector("#output");
const metaEl = document.querySelector("#meta");
const searchEl = document.querySelector("#search");
const groupByModelEl = document.querySelector("#group-by-model");
const dedupeLinksEl = document.querySelector("#dedupe-links");
const copyAllButton = document.querySelector("#copy-all");
const downloadFileButton = document.querySelector("#download-file");
const downloadJsonButton = document.querySelector("#download-json");
const loadExampleButton = document.querySelector("#load-example");
const langToggleButton = document.querySelector("#lang-toggle");
const typeFiltersEl = document.querySelector("#type-filters");
const groupSummaryEl = document.querySelector("#group-summary");
const summaryTotalFilesEl = document.querySelector("#summary-total-files");
const summaryWeightFilesEl = document.querySelector("#summary-weight-files");
const summaryConfigFilesEl = document.querySelector("#summary-config-files");
const summaryCurrentFilterEl = document.querySelector("#summary-current-filter");

const state = {
  models: [],
  activeFilter: "all",
  language: "zh"
};

const messages = {
  en: {
    eyebrow: "Hugging Face Download Workbench",
    title: "Build direct download lists from model pages.",
    lede: "Paste links, filter files, export clean manifests.",
    input_section: "Input",
    status_section: "Status",
    input_label: "Model URLs / Repo IDs",
    input_placeholder: "One per line\nhttps://huggingface.co/mistralai/Mistral-Small-4-119B-2603-NVFP4/tree/main\nmistralai/Mistral-7B-Instruct-v0.2",
    revision_label: "Revision Override",
    revision_placeholder: "Optional, example: main",
    token_label: "HF Token",
    token_placeholder: "Optional, for gated/private repos",
    generate: "Generate",
    load_example: "Load Example",
    copy_current: "Copy Current View",
    export_txt: "Export TXT",
    export_json: "Export JSON",
    status_label: "Status",
    visible_links_label: "Visible Links",
    models_loaded_label: "Models Loaded",
    request_health_label: "Request Health",
    filters_label: "Filters",
    filters_title: "Shape the list before export.",
    search_label: "Filename Search",
    search_placeholder: "Find tokenizer, safetensors, config, gguf...",
    filter_all: "All Files",
    filter_weights: "Weights",
    filter_configs: "Configs",
    filter_tokenizers: "Tokenizers",
    filter_docs: "Docs",
    filter_other: "Other",
    group_by_model: "Group by model",
    dedupe_links: "Deduplicate links",
    summary_total_files: "Total files",
    summary_weight_files: "Weight files",
    summary_config_files: "Config files",
    summary_current_filter: "Current filter",
    output_placeholder: "Generated direct links will appear here, one URL per line.",
    status_idle: "Idle",
    status_missing_input: "Missing input",
    status_resolving: "Resolving",
    status_ready: "Ready",
    status_failed: "Failed",
    request_running: "Running",
    request_clean: "Clean",
    request_partial: "Partial",
    request_error: "Error",
    meta_missing_input: "Add at least one model URL or repo id.",
    meta_all_done: "All model requests completed.",
    meta_partial_failed: "{count} model requests failed. Successful results are still shown.",
    meta_links_visible: "{count} links visible",
    meta_search: "search: {value}",
    meta_dedupe: "dedupe enabled",
    meta_copied: "copied to clipboard",
    loaded_example: "Loaded one direct URL example and one repo id example.",
    visible_ratio: "{visible} / {total} visible",
    models_suffix: "{count} models"
  },
  zh: {
    eyebrow: "Hugging Face 下载工作台",
    title: "从模型页面生成可直接使用的下载清单。",
    lede: "粘贴链接，筛选文件，导出干净的直链结果。",
    input_section: "输入",
    status_section: "状态",
    input_label: "模型链接 / Repo ID",
    input_placeholder: "每行一个\nhttps://huggingface.co/mistralai/Mistral-Small-4-119B-2603-NVFP4/tree/main\nmistralai/Mistral-7B-Instruct-v0.2",
    revision_label: "Revision 覆盖",
    revision_placeholder: "可选，例如：main",
    token_label: "HF Token",
    token_placeholder: "可选，用于私有或受限仓库",
    generate: "生成",
    load_example: "示例",
    copy_current: "复制当前视图",
    export_txt: "导出 TXT",
    export_json: "导出 JSON",
    status_label: "状态",
    visible_links_label: "可见链接",
    models_loaded_label: "已加载模型",
    request_health_label: "请求结果",
    filters_label: "筛选",
    filters_title: "导出前整理结果。",
    search_label: "文件名搜索",
    search_placeholder: "搜索 tokenizer、safetensors、config、gguf ...",
    filter_all: "全部",
    filter_weights: "权重",
    filter_configs: "配置",
    filter_tokenizers: "分词器",
    filter_docs: "文档",
    filter_other: "其他",
    group_by_model: "按模型分组",
    dedupe_links: "去重链接",
    summary_total_files: "总文件数",
    summary_weight_files: "权重文件",
    summary_config_files: "配置文件",
    summary_current_filter: "当前筛选",
    output_placeholder: "生成后的直链会显示在这里，每行一个。",
    status_idle: "空闲",
    status_missing_input: "缺少输入",
    status_resolving: "解析中",
    status_ready: "已完成",
    status_failed: "失败",
    request_running: "进行中",
    request_clean: "正常",
    request_partial: "部分成功",
    request_error: "错误",
    meta_missing_input: "至少输入一个模型链接或 repo id。",
    meta_all_done: "所有模型请求已完成。",
    meta_partial_failed: "有 {count} 个模型请求失败，成功结果仍已保留。",
    meta_links_visible: "当前显示 {count} 条链接",
    meta_search: "搜索：{value}",
    meta_dedupe: "已开启去重",
    meta_copied: "已复制到剪贴板",
    loaded_example: "已填入一个 URL 示例和一个 repo id 示例。",
    visible_ratio: "显示 {visible} / {total}",
    models_suffix: "{count} 个模型"
  }
};

const filterLabelKeys = {
  all: "filter_all",
  weights: "filter_weights",
  configs: "filter_configs",
  tokenizers: "filter_tokenizers",
  docs: "filter_docs",
  other: "filter_other"
};

function t(key, vars = {}) {
  const template = messages[state.language][key] || messages.en[key] || key;
  return Object.entries(vars).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    template
  );
}

function detectInitialLanguage() {
  const browserLanguage = (navigator.language || navigator.userLanguage || "en").toLowerCase();
  return browserLanguage.startsWith("zh") ? "zh" : "en";
}

function applyTranslations() {
  document.documentElement.lang = state.language === "zh" ? "zh-CN" : "en";
  document.title = state.language === "zh" ? "HF 下载工作台" : "HF Download Workbench";
  langToggleButton.textContent = state.language === "zh" ? "EN" : "中文";

  for (const node of document.querySelectorAll("[data-i18n]")) {
    node.textContent = t(node.dataset.i18n);
  }

  for (const node of document.querySelectorAll("[data-i18n-placeholder]")) {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  }
}

function parseInputs(rawInput) {
  return rawInput
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function classifyFile(filename) {
  const lower = filename.toLowerCase();

  if (/\.(safetensors|bin|gguf|pt|pth|onnx)$/.test(lower)) {
    return "weights";
  }
  if (/(tokenizer|vocab|merges|tekken)/.test(lower) || /\.(model|sentencepiece)$/.test(lower)) {
    return "tokenizers";
  }
  if (/(readme|license|notice|prompt)/.test(lower) || /\.(md|txt)$/.test(lower)) {
    return "docs";
  }
  if (/\.(json|yaml|yml|ini|cfg|toml)$/.test(lower) || /(config|params|generation)/.test(lower)) {
    return "configs";
  }

  return "other";
}

function flattenItems() {
  return state.models.flatMap((model) =>
    model.items.map((item) => ({
      ...item,
      repoId: model.repoId,
      revision: model.revision,
      type: classifyFile(item.filename)
    }))
  );
}

function getFilteredItems() {
  const query = searchEl.value.trim().toLowerCase();
  let items = flattenItems();

  if (state.activeFilter !== "all") {
    items = items.filter((item) => item.type === state.activeFilter);
  }

  if (query) {
    items = items.filter(
      (item) =>
        item.filename.toLowerCase().includes(query) ||
        item.repoId.toLowerCase().includes(query)
    );
  }

  if (dedupeLinksEl.checked) {
    const seen = new Set();
    items = items.filter((item) => {
      if (seen.has(item.url)) {
        return false;
      }
      seen.add(item.url);
      return true;
    });
  }

  return items;
}

function buildOutput(items) {
  if (!groupByModelEl.checked) {
    return items.map((item) => item.url).join("\n");
  }

  const byRepo = new Map();
  for (const item of items) {
    if (!byRepo.has(item.repoId)) {
      byRepo.set(item.repoId, []);
    }
    byRepo.get(item.repoId).push(item);
  }

  const chunks = [];
  for (const [repoId, repoItems] of byRepo) {
    chunks.push(`# ${repoId} (${repoItems[0].revision})`);
    chunks.push(...repoItems.map((item) => item.url));
    chunks.push("");
  }

  return chunks.join("\n").trim();
}

function renderGroupSummary(items) {
  if (state.models.length === 0) {
    groupSummaryEl.innerHTML = "";
    return;
  }

  const fragments = state.models.map((model) => {
    const visible = items.filter((item) => item.repoId === model.repoId).length;
    return `
      <article class="repo-card">
        <div>
          <p>${model.repoId}</p>
          <strong>${t("visible_ratio", { visible, total: model.items.length })}</strong>
        </div>
        <span>${model.revision}</span>
      </article>
    `;
  });

  groupSummaryEl.innerHTML = fragments.join("");
}

function renderSummary(items) {
  const allItems = flattenItems();
  summaryTotalFilesEl.textContent = String(allItems.length);
  summaryWeightFilesEl.textContent = String(
    allItems.filter((item) => item.type === "weights").length
  );
  summaryConfigFilesEl.textContent = String(
    allItems.filter((item) => item.type === "configs").length
  );
  summaryCurrentFilterEl.textContent = t(filterLabelKeys[state.activeFilter]);
  countEl.textContent = String(items.length);
  repoIdEl.textContent =
    state.models.length === 0
      ? "-"
      : state.models.length === 1
        ? state.models[0].repoId
        : t("models_suffix", { count: state.models.length });
}

function renderOutput() {
  const items = getFilteredItems();
  outputEl.value = buildOutput(items);
  renderSummary(items);
  renderGroupSummary(items);

  copyAllButton.disabled = items.length === 0;
  downloadFileButton.disabled = items.length === 0;
  downloadJsonButton.disabled = items.length === 0;

  if (state.models.length === 0) {
    metaEl.textContent = "";
    return;
  }

  const query = searchEl.value.trim();
  metaEl.textContent = [
    t("meta_links_visible", { count: items.length }),
    query ? t("meta_search", { value: query }) : null,
    dedupeLinksEl.checked ? t("meta_dedupe") : null
  ]
    .filter(Boolean)
    .join(" · ");
}

async function copyAll() {
  if (!outputEl.value.trim()) {
    return;
  }

  await navigator.clipboard.writeText(outputEl.value);
  metaEl.textContent = `${metaEl.textContent} · ${t("meta_copied")}`;
}

function downloadBlob(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function getExportBaseName() {
  return state.models.length === 1
    ? state.models[0].repoId.replace(/[\\/]/g, "__")
    : `hf-downloads-${state.models.length}-models`;
}

function downloadTextFile() {
  if (!outputEl.value.trim()) {
    return;
  }

  downloadBlob(`${getExportBaseName()}.txt`, `${outputEl.value}\n`, "text/plain;charset=utf-8");
}

function downloadJsonFile() {
  const items = getFilteredItems();
  if (items.length === 0) {
    return;
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    filter: state.activeFilter,
    search: searchEl.value.trim(),
    grouped: groupByModelEl.checked,
    models: state.models,
    visibleItems: items
  };

  downloadBlob(
    `${getExportBaseName()}.json`,
    `${JSON.stringify(payload, null, 2)}\n`,
    "application/json;charset=utf-8"
  );
}

async function submitForm(event) {
  event.preventDefault();

  const inputs = parseInputs(input.value);
  if (inputs.length === 0) {
    statusEl.textContent = t("status_missing_input");
    metaEl.textContent = t("meta_missing_input");
    return;
  }

  statusEl.textContent = t("status_resolving");
  requestHealthEl.textContent = t("request_running");
  metaEl.textContent = "";
  copyAllButton.disabled = true;
  downloadFileButton.disabled = true;
  downloadJsonButton.disabled = true;

  try {
    const response = await fetch("/api/downloads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs,
        revision: revisionInput.value.trim(),
        token: tokenInput.value.trim()
      })
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Request failed");
    }

    state.models = data.models;
    statusEl.textContent = t("status_ready");
    requestHealthEl.textContent = data.errors.length === 0 ? t("request_clean") : t("request_partial");
    metaEl.textContent =
      data.errors.length === 0
        ? t("meta_all_done")
        : t("meta_partial_failed", { count: data.errors.length });
    renderOutput();
  } catch (error) {
    state.models = [];
    outputEl.value = "";
    countEl.textContent = "0";
    repoIdEl.textContent = "-";
    statusEl.textContent = t("status_failed");
    requestHealthEl.textContent = t("request_error");
    metaEl.textContent = error instanceof Error ? error.message : "Unknown error";
    renderGroupSummary([]);
  }
}

typeFiltersEl.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) {
    return;
  }

  state.activeFilter = button.dataset.filter;
  for (const chip of typeFiltersEl.querySelectorAll(".chip")) {
    chip.classList.toggle("active", chip === button);
  }
  renderOutput();
});

form.addEventListener("submit", submitForm);
searchEl.addEventListener("input", renderOutput);
groupByModelEl.addEventListener("change", renderOutput);
dedupeLinksEl.addEventListener("change", renderOutput);
copyAllButton.addEventListener("click", copyAll);
downloadFileButton.addEventListener("click", downloadTextFile);
downloadJsonButton.addEventListener("click", downloadJsonFile);
loadExampleButton.addEventListener("click", () => {
  input.value = [
    "https://huggingface.co/mistralai/Mistral-Small-4-119B-2603-NVFP4/tree/main",
    "mistralai/Mistral-7B-Instruct-v0.2"
  ].join("\n");
  revisionInput.value = "";
  tokenInput.value = "";
  metaEl.textContent = t("loaded_example");
});
langToggleButton.addEventListener("click", () => {
  state.language = state.language === "en" ? "zh" : "en";
  applyTranslations();
  renderOutput();
  if (!state.models.length) {
    statusEl.textContent = t("status_idle");
    requestHealthEl.textContent = "-";
  }
});

state.language = detectInitialLanguage();
applyTranslations();
statusEl.textContent = t("status_idle");
