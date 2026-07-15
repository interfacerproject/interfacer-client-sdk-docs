<template>
  <div class="playground">
    <div class="playground-header">
      <span class="playground-label">
        {{ label }}
        <span v-if="wcReady" class="badge-wc">WebContainers</span>
      </span>
      <div class="playground-actions">
        <button @click="run" :disabled="running" class="btn-run">
          {{ running ? 'Running...' : '▶ Run' }}
        </button>
        <button @click="copy" class="btn-copy">📋 Copy</button>
        <button @click="reset" class="btn-reset">↺ Reset</button>
      </div>
    </div>
    <div class="playground-editor">
      <textarea
        ref="editorRef"
        v-model="currentCode"
        :readonly="running"
        spellcheck="false"
        class="code-editor"
        @input="autoResize"
      ></textarea>
    </div>
    <div class="playground-output" v-if="output.length">
      <div class="output-header">Output</div>
      <pre class="output-content"><code v-for="(line, i) in output" :key="i" :class="line.type">{{ line.text }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const props = defineProps<{
  code: string;
  label?: string;
}>();

const currentCode = ref(props.code);
const output = ref<Array<{ type: string; text: string }>>([]);
const running = ref(false);
const wcReady = ref(false);
const editorRef = ref<HTMLTextAreaElement>();

let wcInstance: any = null;

function reset() {
  currentCode.value = props.code;
  output.value = [];
}

function copy() {
  navigator.clipboard.writeText(currentCode.value);
}

async function bootWebContainer() {
  try {
    const { WebContainer } = await import("@webcontainer/api");
    wcInstance = await WebContainer.boot();
    wcReady.value = true;
  } catch {
    // WebContainers unavailable — fall back to iframe sandbox
  }
}

async function runWithWebContainer() {
  const logs: Array<{ type: string; text: string }> = [];

  await wcInstance.mount({
    "index.js": {
      file: {
        contents: [
          "const _log = console.log;",
          "const _err = console.error;",
          "const _warn = console.warn;",
          'console.log = (...a) => _log("LOG:", ...a);',
          'console.error = (...a) => _err("ERR:", ...a);',
          'console.warn = (...a) => _warn("WARN:", ...a);',
          "try {",
          currentCode.value,
          "} catch (err) {",
          "  console.error(err.message);",
          "}",
        ].join("\n"),
      },
    },
  });

  const process = await wcInstance.spawn("node", ["index.js"]);

  process.output.pipeTo(
    new WritableStream({
      write(data: string) {
        const lines = data.trim().split("\n");
        for (const line of lines) {
          if (line.startsWith("LOG:"))
            logs.push({ type: "log", text: line.slice(4) });
          else if (line.startsWith("ERR:"))
            logs.push({ type: "error", text: line.slice(4) });
          else if (line.startsWith("WARN:"))
            logs.push({ type: "warn", text: line.slice(5) });
          else if (line)
            logs.push({ type: "log", text: line });
        }
        output.value = [...logs];
      },
    })
  );

  await process.exit;
  running.value = false;
}

function runWithIframe() {
  const logs: Array<{ type: string; text: string }> = [];

  const handler = (event: MessageEvent) => {
    if (!event.data || !event.data.type) return;
    if (event.data.type === "done") {
      window.removeEventListener("message", handler);
      document.body.removeChild(iframe);
      clearTimeout(timeout);
      running.value = false;
      return;
    }
    logs.push({ type: event.data.type, text: event.data.text });
    output.value = [...logs];
  };

  window.addEventListener("message", handler);

  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.sandbox.add("allow-scripts");

  const safeCode = currentCode.value.replace(/<\/script>/g, "<\\/script>");

  iframe.srcdoc =
    "<script>" +
    "console.log=function(){window.parent.postMessage({type:'log',text:Array.from(arguments).map(function(a){return typeof a==='object'?JSON.stringify(a,null,2):String(a)}).join(' ')},'*')};" +
    "console.error=function(){window.parent.postMessage({type:'error',text:Array.from(arguments).map(function(a){return a instanceof Error?a.message:String(a)}).join(' ')},'*')};" +
    "console.warn=function(){window.parent.postMessage({type:'warn',text:Array.from(arguments).map(String).join(' ')},'*')};" +
    "<\/script>" +
    "<script>" +
    "try{" +
    safeCode +
    "}catch(err){console.error(err.message)}" +
    "window.parent.postMessage({type:'done'},'*')" +
    "<\/script>";

  document.body.appendChild(iframe);

  const timeout = setTimeout(() => {
    if (running.value) {
      window.removeEventListener("message", handler);
      document.body.removeChild(iframe);
      logs.push({ type: "error", text: "Execution timed out (10s)" });
      output.value = [...logs];
      running.value = false;
    }
  }, 10000);
}

function run() {
  running.value = true;
  output.value = [];
  if (wcInstance) runWithWebContainer();
  else runWithIframe();
}

function autoResize() {
  const el = editorRef.value;
  if (!el) return;
  el.style.height = "auto";
  el.style.height = Math.max(el.scrollHeight, 120) + "px";
}

onMounted(() => {
  autoResize();
  bootWebContainer();
});
</script>

<style scoped>
.playground {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  margin: 16px 0;
}
.playground-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}
.playground-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.badge-wc {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 3px;
  background: var(--vp-c-brand);
  color: #fff;
  text-transform: none;
  letter-spacing: 0;
}
.playground-actions { display: flex; gap: 6px; }
.playground-actions button {
  padding: 4px 12px;
  font-size: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  cursor: pointer;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  transition: background 0.2s;
}
.playground-actions button:hover:not(:disabled) { background: var(--vp-c-bg-soft); }
.playground-actions button:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-run { color: var(--vp-c-brand) !important; border-color: var(--vp-c-brand) !important; font-weight: 600; }
.code-editor {
  width: 100%;
  min-height: 120px;
  padding: 16px;
  font-family: var(--vp-font-mono);
  font-size: 13px;
  line-height: 1.6;
  border: none;
  outline: none;
  resize: vertical;
  background: var(--vp-code-block-bg);
  color: var(--vp-code-block-color);
  tab-size: 2;
}
.playground-output { border-top: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); }
.output-header {
  padding: 6px 16px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--vp-c-text-3);
  border-bottom: 1px solid var(--vp-c-divider);
}
.output-content {
  padding: 12px 16px;
  margin: 0;
  font-family: var(--vp-font-mono);
  font-size: 13px;
  line-height: 1.5;
  max-height: 300px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-all;
}
.output-content code { display: block; color: var(--vp-c-text-1); }
.output-content code.error { color: var(--vp-c-danger-1); }
.output-content code.warn { color: var(--vp-c-warning-1); }
</style>
