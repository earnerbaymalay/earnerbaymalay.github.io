<div align="center">

# 📖 Aether — Daily Usage Guide

*Quick reference for interacting with your Aether Workstation.*

</div>

---

If you haven't installed Aether yet, please start with the **[Getting Started Guide](docs/GETTING_STARTED.md)**.

## 🚀 Launching the Application

Once you have downloaded the correct application for your operating system from the [GitHub Releases](https://github.com/earnerbaymalay/aether-tauri/releases) page, follow these steps:

- **On Windows:** Unzip the package and run the `Aether.exe` executable. You can create a shortcut for easy access.
- **On macOS:** Open the `.dmg` file and drag the `Aether.app` into your `Applications` folder.
- **On Linux:** Make the `.AppImage` file executable (`chmod +x Aether.AppImage`) and then run it.

The application will handle starting all necessary background services for you.

<div align="center">
  <img src="docs//images/terminal_prompt.png" alt="Terminal Prompt" width="70%" />
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

## 📊 The Neural Monitor

Aether comes with a standalone text-based dashboard to monitor your system's health. It tracks CPU usage, RAM, and whether your background services (like Ollama and OpenClaw) are alive.

We recommend running this in a separate terminal window alongside Aether:

![Neural Monitor](docs//images/neural_monitor.png)

```bash
# Run the monitor script directly
python3 tools/monitor.py
```

---

## 🧠 Neural Pathways (AI Modes)

When you launch Aether, you select a "Pathway". You can't change this mid-session (yet!), so choose the right tool for the job:

<div align="center">
  <img src="docs//images/pathway_selection.png" alt="Pathway Selection" width="60%" />
</div>

- **🤖 AGENT:** Powered by `hermes3:8b`.
 This is your main assistant. Use it when you need Aether to use tools, search the web, or execute complex tasks.
- **⚡ TURBO:** Powered by `llama3.2:3b`. Extremely fast. Use it for quick questions, translations, or text summarization.
- **💻 CODE:** Powered by `qwen2.5-coder:3b`. Highly optimized for writing scripts, finding bugs, and refactoring code.
- **🧠 LOGIC:** Powered by `deepseek-r1:8b`. A slow, deep-thinking model best used for architectural planning and brainstorming.

---

*For deeper configuration, memory synchronization, and MCP tool setup, see the **[Advanced Features Guide](docs/ADVANCED_FEATURES.md)**.*
