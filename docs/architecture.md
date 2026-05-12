<div align="center">

![Architecture Diagram](assets/architecture_diagram.png)

# 🏛️ Aether — Architecture Guide

*How the neural workstation is built and why.*

</div>

---

## Table of Contents

1. [System Overview](#-system-overview)
2. [Layer Breakdown](#-layer-breakdown)
3. [Data Flow Diagram](#-data-flow-diagram)
4. [Agent Core Modules](#-agent-core-modules)
5. [Frontend Design System](#-frontend-design-system)
6. [Tauri Backend Commands](#-tauri-backend-commands)
7. [Configuration & State](#-configuration--state)
8. [Security Model](#-security-model)

---

## 🌌 System Overview

Aether is a **three-layer system**:

```
┌────────────────────────────────────────────────────────────────┐
│                     LAYER 1: PRESENTATION                      │
│            Tauri WebView (TypeScript + xterm.js)               │
│     index.html · src/main.ts · src/styles/app.css              │
└────────────────────────────┬───────────────────────────────────┘
                             │  Tauri invoke() / event stream
┌────────────────────────────▼───────────────────────────────────┐
│                      LAYER 2: NATIVE BRIDGE                    │
│                   Rust / Tauri Backend                         │
│        get_system_info · start_agent · send_to_agent           │
│        run_benchmark · run_nexus_optimization                  │
└────────────────────────────┬───────────────────────────────────┘
                             │  subprocess / stdin-stdout pipe
┌────────────────────────────▼───────────────────────────────────┐
│                      LAYER 3: AGENT CORE                       │
│                   Python 3.10+ Runtime                         │
│   aether_agent.py → OpenClaw CLI → Ollama → MCP Servers        │
│   AetherVault · AetherLink · AetherFS · Nexus Shield           │
└────────────────────────────────────────────────────────────────┘
```

This separation means:
- **The frontend never talks directly to Ollama.** All inference is mediated by the Rust bridge and Python agent.
- **The agent is fully standalone.** `aether.sh` launches the same Python agent that the Tauri backend spawns — useful for headless operation.
- **The bridge is pluggable.** Switching inference backends (Ollama, LM Studio, llama.cpp) only requires changes in `generate_completion_stream()`.

---

## 🗂️ Layer Breakdown

### Layer 1 — Presentation (TypeScript + xterm.js)

| File | Responsibility |
| :--- | :--- |
| `index.html` | Application shell: header, pathway selector, xterm container, system panel, Nexus overlay |
| `src/main.ts` | Event handling, Tauri IPC calls, xterm.js terminal lifecycle, tier selection |
| `src/styles/app.css` | Full design system: CSS custom properties, component styles, animations |

**Key design decisions:**
- **xterm.js** is used for terminal rendering to support ANSI escape sequences from the Rich-powered Python agent. Do not replace it with a plain `<textarea>`.
- **Pathway cards** are purely cosmetic at the frontend level. The actual model routing is controlled by the Python config (`active_model` in `config.json`). The card selection only gates the terminal session.
- The frontend streams output from `agent-stdout` and `agent-stderr` Tauri events line-by-line, avoiding buffering artifacts.

### Layer 2 — Native Bridge (Rust / Tauri)

The Tauri backend in `src-tauri/` exposes these commands to the frontend:

| Command | Signature | Description |
| :--- | :--- | :--- |
| `get_system_info` | `() → SystemInfo` | Platform, OS, arch, RAM, dependency detection |
| `start_agent` | `() → ()` | Spawns `aether_agent.py` as a child process, wires stdout/stderr to events |
| `send_to_agent` | `(input: string) → ()` | Writes to the agent's stdin pipe |
| `run_benchmark` | `(args: BenchmarkArgs) → BenchmarkResult` | Runs llama-cli benchmark on a specified model |
| `run_nexus_optimization` | `(opt_type: string, enabled: bool) → string` | Invokes system optimization scripts |
| `path_home_dir` | `() → string` | Returns the OS home directory path |

Events emitted by the backend:
- `agent-stdout` — normal agent output (text chunks)
- `agent-stderr` — error output (rendered in red by the frontend)

### Layer 3 — Agent Core (Python)

The agent is an **event-driven, multi-modal command handler** built around a `chat_loop()` that:
1. Accepts input from either an interactive TTY or from the Tauri stdin pipe (non-TTY mode).
2. Routes slash commands (`/settings`, `/health`, etc.) to local handlers without invoking the LLM.
3. Forwards all other input to `generate_completion_stream()`, which pipes it to the **OpenClaw CLI**.
4. Streams every stdout line back to the terminal in real time.
5. Kicks off a **background shadow monitor** thread after every exchange to distill facts into AetherVault.

---

## 🔄 Data Flow Diagram

### Standard Inference Request

```
User types message in xterm.js
        │
        ▼ (xterm onKey → input buffer)
Enter keypress → invoke('send_to_agent', { input })
        │
        ▼ (Tauri Rust command)
Writes to Python agent's stdin pipe
        │
        ▼ (chat_loop reads stdin.readline())
Input dispatched:
  ┌─────────────────────────────────────┐
  │  Slash command?  →  Local handler   │
  │  Otherwise?      →  OpenClaw bridge │
  └─────────────────────────────────────┘
        │ (non-slash path)
        ▼
subprocess.Popen("openclaw agent --message ...")
        │
        ▼ (OpenClaw resolves MCP tools + Ollama)
stdout lines streamed back to Python
        │
        ▼
Tauri emits 'agent-stdout' event per line
        │
        ▼
xterm.js renders line with ANSI codes
        │
        ▼ (background thread, non-blocking)
Shadow Monitor → Ollama TURBO model → save fragment to AetherVault
```

### RAG Context Injection (on startup)

```
aether_agent.py starts
        │
        ▼
AetherRAG.index_vault()
  Scans all *.md files in vault_path/
  Builds TF-IDF / embedding index
        │
        ▼
Vault size count → rendered in header
        │
        ▼ (when rag_enabled = true)
Relevant fragments injected into system prompt
at the start of each generate_completion_stream() call
```

---

## 🐍 Agent Core Modules

### `aether_agent.py` — Main Entry Point

The orchestration layer. Owns:
- `AetherUI` — Rich-based TUI header, footer, and stats rendering
- `NeuralMemory` — Fragment CRUD and shadow distillation
- `SkillManifest` — Reads `toolbox/manifest.json` and resolves tool calls
- `HardwareMonitor` — CPU/RAM metrics via `psutil`
- `chat_loop()` — Primary interaction loop
- All slash command handlers: `handle_help`, `handle_settings`, `handle_memory`, `handle_health`, `handle_auto_fix`

### `mcp_client.py` — MCP Server Manager

Manages the lifecycle of Model Context Protocol servers defined in `config.json`. On startup (if `mcp_enabled`), it spawns each server via `npx` and makes their tools available for injection into the OpenClaw system prompt.

### `p2p_sync.py` — AetherLink

Implements a lightweight peer-to-peer listener on **port 8888** to synchronize memory fragments between Aether nodes. Uses encrypted transfer for vault fragment sync between Desktop and Droid workstations.

### `rag_engine.py` — AetherFS RAG

Semantic search engine over your vault directory. Indexes all `.md` files and provides context retrieval for the system prompt. Keeps a lightweight in-memory index to avoid re-scanning on every query.

### `skill_loader.py` — Universal Skill Engine

Discovers and loads skills from:
1. `toolbox/manifest.json` — built-in cross-platform tools
2. `CLAUDE.md` files dropped in the working directory — skill imports from the OpenClaw ecosystem

### `system_scanner.py` — Dependency Detection

Scans the host for required binaries (`llama-cli`, `ollama`, `openclaw`, etc.) and reports their presence to the Tauri `get_system_info` command.

### `core_tools.py` — Native Python Tools

Python implementations of common tools that don't require external scripts (e.g., file I/O, system commands). Called directly if a tool name matches a function in this module; falls back to the `toolbox/` scripts otherwise.

---

## 🎨 Frontend Design System

The entire UI is driven by CSS custom properties defined in `src/styles/app.css`.

### Color Palette

| Token | Value | Usage |
| :--- | :--- | :--- |
| `--bg` | `#0d1117` | Application background |
| `--surface` | `#161b22` | Header, sidebars, overlay backgrounds |
| `--card` | `#1c2333` | Pathway cards, Nexus cards |
| `--border` | `#30363d` | All borders and dividers |
| `--teal` | `#58a6ff` | Primary accent, active states, xterm cursor |
| `--green` | `#3fb950` | Success states, throughput indicators |
| `--orange` | `#ffa657` | Warning states |
| `--purple` | `#bc8cff` | Nexus Shield accent |
| `--red` | `#ff7b72` | Error states |
| `--text` | `#e6edf3` | Primary text |
| `--text-dim` | `#8b949e` | Secondary/label text |
| `--text-muted` | `#484f58` | Placeholder / decorative text |

This palette mirrors the GitHub Dark high-contrast theme for familiarity and accessibility.

### Key Components

- **`.pathway-card`** — Hover lift (`translateY(-4px)`) + gradient top-border reveal animation
- **`.btn`** — Baseline button with `--card` background, teal border on hover
- **`.nexus-panel`** — Fixed, centered modal overlay with `z-index: 100`
- **`.switch` / `.slider`** — Pure CSS toggle switch (40×20px pill)
- **xterm.js theme** — Matched to the same CSS palette for a seamless look

### Typography

The UI uses the system font stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`) for chrome, and `'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace` for the terminal.

---

## ⚙️ Configuration & State

### Runtime Config (`~/.aether/config.json`)

```json
{
  "vault_path": "~/Documents/Vault",
  "threads": 6,
  "uncensored": false,
  "auto_memory": true,
  "rag_enabled": true,
  "active_model": "hermes3:8b",
  "turbo_model": "llama3.2:3b",
  "logic_model": "deepseek-r1:8b",
  "theme": "cyan",
  "log_level": "INFO",
  "browser_type": "firefox",
  "mcp_enabled": false,
  "mcp_servers": {}
}
```

Config is loaded at startup, merged with `DEFAULT_CONFIG` for forward-compatibility, and written back by `/settings`.

### Directory Layout

```
~/.aether/
├── config.json
├── logs/
│   └── aether.log
└── sessions/            ← (planned)

~/<vault_path>/
├── SYSTEM_PROFILE.md
└── fragments/
    ├── shadow_*.md
    ├── auto_*.md
    └── *.md
```

---

## 🔒 Security Model

| Concern | Mitigation |
| :--- | :--- |
| **Destructive shell commands** | `run_tool()` blocks any `shell_exec` call containing `rm -rf` |
| **No API keys** | All inference is local; no secrets are stored or transmitted |
| **P2P encryption** | AetherLink uses encrypted transfer for vault sync |
| **No telemetry** | Zero outbound connections from Aether itself; OpenClaw's telemetry must be disabled separately via `openclaw config` |
| **Tauri security** | CSP is enforced via Tauri's default allowlist; only explicitly declared commands are callable from the frontend |
| **Uncensored mode** | Off by default. When enabled, safety system prompts are removed. User-controlled via `/settings`. |
