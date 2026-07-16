<template>
  <div class="playground" :class="{ expanded }">
    <div class="pg-header" @click="toggle">
      <span class="pg-label">
        <span class="pg-chevron" :class="{ open: expanded }">▸</span>
        {{ label }}
      </span>
      <div class="pg-actions" @click.stop>
        <button @click="handleRun" :disabled="running" class="pg-btn pg-btn-run">
          {{ running ? 'Running...' : 'Run' }}
        </button>
        <button @click="handleCopy" class="pg-btn pg-btn-copy">
          <span v-if="copied" class="copied-feedback">Copied!</span>
          <span v-else>Copy</span>
        </button>
        <button @click="handleReset" class="pg-btn pg-btn-reset">Reset</button>
      </div>
    </div>
    <transition name="pg-expand">
      <div v-if="expanded" class="pg-body">
        <div class="pg-editor">
          <textarea
            ref="editorRef"
            v-model="currentCode"
            :readonly="running"
            spellcheck="false"
            class="pg-code"
            @input="autoResize"
          ></textarea>
        </div>
        <transition name="pg-output">
          <div v-if="output.length" class="pg-output">
            <pre class="pg-output-text"><code v-for="(line, i) in output" :key="i" :class="line.type">{{ line.text }}</code></pre>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";

const props = defineProps<{
  code: string;
  label?: string;
}>();

const currentCode = ref(props.code);
const output = ref<Array<{ type: string; text: string }>>([]);
const running = ref(false);
const expanded = ref(false);
const copied = ref(false);
const editorRef = ref<HTMLTextAreaElement>();

let copiedTimer: ReturnType<typeof setTimeout> | undefined;

function toggle() {
  expanded.value = !expanded.value;
  if (expanded.value) nextTick(() => autoResize());
}

function handleRun() {
  if (!expanded.value) expanded.value = true;
  nextTick(() => run());
}

function handleCopy() {
  navigator.clipboard.writeText(currentCode.value);
  copied.value = true;
  clearTimeout(copiedTimer);
  copiedTimer = setTimeout(() => (copied.value = false), 1500);
}

function handleReset() {
  currentCode.value = props.code;
  output.value = [];
}

function run() {
  running.value = true;
  output.value = [];

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
    "window.onerror=function(m){console.error(m)};" +
    "<\/script>" +
    "<script type=module>" +
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

function autoResize() {
  const el = editorRef.value;
  if (!el) return;
  el.style.height = "auto";
  el.style.height = Math.max(el.scrollHeight, 100) + "px";
}

onMounted(() => {
  if (expanded.value) autoResize();
});
</script>

<style scoped>
.playground {
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  margin: 20px 0;
  overflow: hidden;
}

/* ── Header bar ────────────────────────────────────────────────── */

.pg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  user-select: none;
  transition: background 0.12s;
}

.pg-header:hover {
  background: var(--vp-c-bg-mute);
}

.pg-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.pg-chevron {
  display: inline-block;
  font-size: 10px;
  transition: transform 0.18s ease;
  color: var(--vp-c-text-3);
}

.pg-chevron.open {
  transform: rotate(90deg);
}

/* ── Buttons ───────────────────────────────────────────────────── */

.pg-actions {
  display: flex;
  gap: 6px;
}

.pg-btn {
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  cursor: pointer;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  transition: border-color 0.12s, background 0.12s, color 0.12s;
}

.pg-btn:hover:not(:disabled) {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.pg-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pg-btn-run {
  color: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
  font-weight: 600;
}

.pg-btn-run:hover:not(:disabled) {
  background: var(--vp-c-brand);
  color: #fff;
}

/* ── Copy feedback ─────────────────────────────────────────────── */

.pg-btn-copy {
  position: relative;
  min-width: 44px;
  text-align: center;
}

.copied-feedback {
  color: var(--vp-c-brand);
  font-weight: 600;
}

/* ── Expand/collapse transitions ───────────────────────────────── */

.pg-expand-enter-active,
.pg-expand-leave-active {
  transition: max-height 0.25s ease, opacity 0.2s ease;
  overflow: hidden;
}

.pg-expand-enter-from,
.pg-expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.pg-expand-enter-to,
.pg-expand-leave-from {
  max-height: 1200px;
  opacity: 1;
}

/* ── Body ──────────────────────────────────────────────────────── */

.pg-body {
  border-top: 1px solid var(--vp-c-divider);
}

/* ── Editor ────────────────────────────────────────────────────── */

.pg-editor {
  background: var(--vp-code-block-bg);
}

.pg-code {
  width: 100%;
  min-height: 100px;
  padding: 14px;
  font-family: var(--vp-font-mono);
  font-size: 13px;
  line-height: 1.6;
  border: none;
  outline: none;
  resize: vertical;
  background: transparent;
  color: var(--vp-code-block-color);
  tab-size: 2;
}

/* ── Output ────────────────────────────────────────────────────── */

.pg-output-enter-active,
.pg-output-leave-active {
  transition: max-height 0.2s ease, opacity 0.15s ease;
  overflow: hidden;
}

.pg-output-enter-from,
.pg-output-leave-to {
  max-height: 0;
  opacity: 0;
}

.pg-output-enter-to,
.pg-output-leave-from {
  max-height: 400px;
  opacity: 1;
}

.pg-output {
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.pg-output-text {
  padding: 12px 14px;
  margin: 0;
  font-family: var(--vp-font-mono);
  font-size: 13px;
  line-height: 1.5;
  max-height: 280px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

.pg-output-text code {
  display: block;
  color: var(--vp-c-text-1);
}

.pg-output-text code.error {
  color: var(--vp-c-danger-1);
}

.pg-output-text code.warn {
  color: var(--vp-c-warning-1);
}
</style>
