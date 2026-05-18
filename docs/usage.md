<div align="center">

# 📖 Aether — Daily Usage Guide

*Quick reference for interacting with your Aether Workstation.*

</div>

---

::: tip
If you haven't installed Aether yet, please start with the **[Getting Started Guide](./getting-started.md)**.
:::

## 🚀 Launching the Application

::: warning ALPHA NOTICE
**Aether is currently in Alpha.** Public binary releases are not yet available. Please follow the instructions below to build from source.
:::

### Building from Source

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/earnerbaymalay/aether-tauri
   cd aether-tauri
   ```

2. **Install Dependencies:**
   - Ensure you have **Rust**, **Node.js**, and **Python 3.10+** installed.
   - Install frontend dependencies: `npm install`
   - Install Python dependencies: `pip install -r requirements.txt`

3. **Run in Development Mode:**
   ```bash
   npm run tauri dev
   ```

The application will handle starting all necessary background services for you.

<div align="center">
  <img src="/images/terminal_prompt.png" alt="Terminal Prompt" width="70%" />
</div>

---

## ⚡ Slash Commands

Once inside the Aether terminal, you can type these slash commands to interact with the system without talking to the AI.

| Command | What it does |
| :--- | :--- |
| `/help` | Displays a quick reference of all commands. |
| `/settings` | Opens the configuration menu. You can change themes, toggle UNCENSORED mode, and set your Vault path here. |
| `/memory` | Displays the last 10 memory fragments saved to your AetherVault. |
| `/health` | Runs a system vitals check to ensure Ollama, your Vault, and Models are all online and accessible. |
| `/auto-fix` | Paste an error message here! The LOGIC model will analyze it and suggest a single command to fix the issue. |
| `/clear` | Clears the terminal screen. |
| `/exit` | Safely shuts down the Aether agent. |

---

## ⌨️ Keyboard Shortcuts

Aether's terminal is built for speed. Use these shortcuts to navigate your session efficiently:

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + L` | Clear the terminal screen (same as `/clear`). |
| `Up / Down` | Cycle through your command history. |
| `Ctrl + C` | Interrupt the current AI response generation. |
| `Ctrl + V` | Paste text into the terminal (Standard OS paste also works). |
| `Tab` | (Planned) Autocomplete for slash commands and file paths. |

---

## 🗄️ Vault Management

Your **AetherVault** is where all your local knowledge is stored. It's a collection of Markdown files located in your configured `vault_path`.

### Pinning Fragments
Aether automatically saves "fragments" of your conversations. If you want to make sure a piece of information is always available to the AI:
1. Open your Vault folder.
2. Find the relevant `.md` file in the `fragments/` subfolder.
3. Move it to the root of your Vault or prefix it with `PIN_`.

### Deleting Fragments
To remove knowledge from Aether's memory, simply delete the corresponding Markdown file from your Vault directory. Aether will re-index the remaining files on the next startup.

::: warning
Deleting files from your Vault is permanent. We recommend moving them to a "Trash" folder within the Vault if you aren't sure.
:::

---

## 📊 The Neural Monitor

Aether comes with a standalone text-based dashboard to monitor your system's health. It tracks CPU usage, RAM, and whether your background services (like Ollama and OpenClaw) are alive.

We recommend running this in a separate terminal window alongside Aether:

<div align="center">
  <img src="/images/neural_monitor.png" alt="Neural Monitor" width="80%" />
</div>

```bash
# Run the monitor script directly
python3 tools/monitor.py
```

---

## 🧠 Neural Pathways (AI Modes)

When you launch Aether, you select a "Pathway". This determines the underlying model and system prompt used for the session.

<div align="center">
  <img src="/images/pathway_selection.png" alt="Pathway Selection" width="60%" />
</div>

### Pathway Comparison

| Pathway | Model | Best For | Speed |
| :--- | :--- | :--- | :--- |
| **🤖 AGENT** | `hermes3:8b` | Tool use, web search, complex tasks | Moderate |
| **⚡ TURBO** | `llama3.2:3b` | Quick questions, summarization | High |
| **💻 CODE** | `qwen2.5-coder:3b` | Scripting, refactoring, debugging | High |
| **🧠 LOGIC** | `deepseek-r1:8b` | Architecture, deep reasoning | Slow |

::: info
You cannot change the pathway mid-session. To switch, you must `/exit` and restart the application.
:::

---

*For deeper configuration, memory synchronization, and MCP tool setup, see the **[Advanced Features Guide](./advanced-features.md)**.*
