<div align="center">

# 🔧 Aether — Troubleshooting Guide

*Quick fixes for common issues.*

</div>

---

## Table of Contents

1. [Build & Installation](#-build--installation)
2. [OpenClaw Bridge](#-openclaw-bridge)
3. [Ollama & Models](#-ollama--models)
4. [AetherVault & Memory](#-aethervault--memory)
5. [MCP Servers](#-mcp-servers)
6. [Permissions & Scripts](#-permissions--scripts)
7. [Performance](#-performance)
8. [Log Locations](#-log-locations)

---

## 🏗️ Build & Installation

### Linux: Missing WebKit2GTK

**Error:** `Could not find libwebkit2gtk-4.1` during `npm run tauri build`

**Fix:**
```bash
sudo apt-get install libwebkit2gtk-4.1-dev build-essential curl wget libssl-dev
```

For Fedora/RHEL:
```bash
sudo dnf install webkit2gtk4.1-devel openssl-devel
```

---

### Windows: PowerShell Execution Policy

**Error:** `Script cannot be loaded because running scripts is disabled`

**Fix:**
```powershell
powershell -ExecutionPolicy Bypass -File .\install-windows.ps1
```

---

### macOS: App Quarantined ("Damaged")

**Error:** `"Aether.app" is damaged and can't be opened`

**Fix:** This is a Gatekeeper issue with unsigned binaries. Remove the quarantine flag:
```bash
xattr -d com.apple.quarantine /Applications/Aether.app
```

---

### Python Dependencies Missing

**Error:** `ModuleNotFoundError: No module named 'rich'` (or `psutil`, `requests`)

**Fix:**
```bash
pip3 install -r requirements.txt
# If using a virtual environment:
python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt
```

---

## 🦾 OpenClaw Bridge

### Connection Refused (Port 18789)

**Error:** `OpenClaw Bridge Error: [Errno 111] Connection refused`

**Cause:** The OpenClaw gateway is not running.

**Fix:** Start it before launching Aether:
```bash
openclaw gateway --port 18789 --force &
# Verify it's listening:
lsof -i :18789
```

---

### Model Not Found in OpenClaw

**Error:** `LLM request failed: model_not_found`

**Fix:** Verify that the model name in your OpenClaw config matches exactly what `ollama list` shows:
```bash
ollama list
# Update OpenClaw to match:
openclaw config set agents.defaults.model.primary "ollama/hermes3:8b"
```

---

### No Tool Response (AI Ignores Tools)

**Symptom:** The AI responds in plain text but never executes tools.

**Fix:** Ensure `supportsTools` is enabled for your model in `~/.openclaw/openclaw.json`:
```json
{
  "models": {
    "hermes3:8b": {
      "supportsTools": true
    }
  }
}
```

---

### OpenClaw Not Found in PATH

**Error:** `FileNotFoundError: [Errno 2] No such file or directory: 'openclaw'`

**Fix:** Ensure OpenClaw is installed and its binary is in your system PATH:
```bash
which openclaw        # Should print a path
# If not found, re-install or add its location to ~/.bashrc / ~/.zshrc:
export PATH="$HOME/.local/bin:$PATH"
```

---

## 🧠 Ollama & Models

### Ollama Not Running

**Check:**
```bash
# macOS / Linux
pgrep -x ollama
curl http://127.0.0.1:11434/api/tags   # Should return JSON
```

**Fix:**
```bash
# macOS
ollama serve &

# Linux (systemd)
sudo systemctl start ollama
sudo systemctl enable ollama   # Auto-start on boot
```

---

### Model Not Pulled

**Error:** `model 'hermes3:8b' not found`

**Fix:** Pull the required models:
```bash
ollama pull hermes3:8b           # AGENT pathway
ollama pull llama3.2:3b          # TURBO pathway
ollama pull qwen2.5-coder:3b     # CODE pathway
ollama pull deepseek-r1:8b       # LOGIC pathway
```

---

### Agent Starts But No Output

**Symptom:** Terminal boots but the agent produces no text after a query.

**Debug steps:**
1. Check if OpenClaw gateway is running: `lsof -i :18789`
2. Run the agent directly to see raw output: `./aether.sh`
3. Check logs: `tail -f ~/.aether/logs/aether.log`

---

## 🗄️ AetherVault & Memory

### Vault Not Found

**Error:** Shadow Monitor and RAG silently fail; vault size shows `0`

**Check:**
```bash
ls ~/Documents/Vault        # Obsidian default
ls ~/aether-vault           # Fallback
cat ~/.aether/config.json   # Check vault_path key
```

**Fix:** Either create the expected directory or update the path:
```bash
mkdir -p ~/aether-vault
# Or run /settings inside Aether and update "Vault Path"
```

---

### RAG Index Is Stale

**Symptom:** Aether doesn't recall recent knowledge you added to the vault.

**Fix:** RAG re-indexes on every launch. Restart the agent to pick up new fragments:
```bash
# Kill and relaunch
./aether.sh
```

---

### AetherLink Can't Connect

**Error:** P2P sync fails silently or port 8888 is blocked.

**Check:**
```bash
lsof -i :8888    # Check if AetherLink listener is active
```

**Fix:** Ensure port 8888 is not blocked by a firewall:
```bash
# macOS
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /path/to/aether
# Linux (ufw)
sudo ufw allow 8888
```

---

## 🛠️ MCP Servers

### MCP Server Fails to Start

**Error:** `MCP Startup Error: ...` in the agent header.

**Debug:**
```bash
# Test the MCP server manually:
npx -y @modelcontextprotocol/server-fetch
```

**Common causes:**
- `npx` not in PATH (Node.js not installed or PATH not updated)
- The specific MCP package doesn't exist or requires `npm` first

---

### MCP Tools Not Appearing

**Symptom:** `mcp_enabled` is `true` but tools aren't available to OpenClaw.

**Fix:** Verify the server names in config match what the MCP package registers. Check the agent log for startup errors:
```bash
grep -i mcp ~/.aether/logs/aether.log
```

---

## 🔐 Permissions & Scripts

### Permission Denied on `aether.sh`

**Error:** `sh: ./aether.sh: Permission denied`

**Fix:**
```bash
chmod +x ./aether.sh
```

---

### Python Import Errors (Agent)

**Error:** `ModuleNotFoundError: No module named 'rag_engine'`

**Cause:** `PYTHONPATH` doesn't include the `agent/` directory.

**Fix:** Always launch via `aether.sh`, which sets the correct `PYTHONPATH`:
```bash
export PYTHONPATH="$PYTHONPATH:$(pwd)/agent"
python3 agent/aether_agent.py
```

---

## ⚡ Performance

### Inference Is Slow

| Cause | Fix |
| :--- | :--- |
| Insufficient RAM/VRAM | Use smaller models: `llama3.2:1b` or `qwen2.5-coder:1.5b` |
| Other GPU-heavy apps | Close browsers, games, and GPU workloads |
| CPU threading too low | In `/settings`, increase **Threads** (try 8 if you have 8+ cores) |
| Model not GPU-accelerated | Ensure Ollama detects your GPU: `ollama info` |

```bash
# Check if Ollama is using GPU:
ollama info
# Look for "GPU" in the output
```

---

### High RAM Usage

- Ollama keeps models loaded in memory by default. To unload:
  ```bash
  ollama stop hermes3:8b
  ```
- Use `OLLAMA_MAX_LOADED_MODELS=1` to limit concurrent model loads.

---

## 📋 Log Locations

| Log | Path | Purpose |
| :--- | :--- | :--- |
| Agent runtime | `~/.aether/logs/aether.log` | All agent events, errors, tool calls |
| Tauri startup | `./aether_startup.log` | Tauri process startup output |
| Debug log | `./startup_debug.log` | Additional launch debug info |
| Vault fragments | `<vault_path>/fragments/` | Memory fragment files |

```bash
# Live-tail the agent log:
tail -f ~/.aether/logs/aether.log
```

---

*Still stuck? Check [ARCHITECTURE.md](docs/ARCHITECTURE.md) for system internals, or open an issue on GitHub.*

[MIT License](LICENSE)
