<div align="center">

# 🚀 Getting Started with Aether

*A friendly, step-by-step guide to setting up your first sovereign neural workstation.*

</div>

---

Welcome to Aether! If you're new to running local AI models, you're in the right place. This guide will walk you through everything you need to get Aether up and running on your computer.

No cloud. No subscriptions. Total privacy.

## Step 1: Install the Prerequisites

To run Aether, your computer needs a few background programs to handle the heavy lifting.

### 1. Ollama (The AI Engine)
Ollama is the engine that actually runs the AI models on your computer.
- **Mac & Windows:** Download the installer from [ollama.com/download](https://ollama.com/download)
- **Linux:** Run this command in your terminal:
  ```bash
  curl -fsSL https://ollama.com/install.sh | sh
  ```

### 2. Node.js (The User Interface)
Node.js helps build and run Aether's desktop application.
- Download the "LTS" (Long Term Support) version from [nodejs.org](https://nodejs.org).

### 3. Python (The Agent Core)
Python is what gives Aether its "agency" (the ability to think and use tools).
- Download Python 3.10 or higher from [python.org/downloads](https://python.org/downloads).

### 4. Rust (The Native Bridge)
Rust is used by Tauri to make Aether run fast as a native app on your desktop.
- Follow the official instructions at [rustup.rs](https://rustup.rs/) (usually a single command).

---

## Step 2: Download Your First AI Models

Aether works best when it has different "specialist" models to call upon. Open your terminal and run these commands to download them. Don't worry, they are saved locally!

```bash
# 1. The General Assistant (Best for tool use and chat)
ollama pull hermes3:8b

# 2. The Coding Specialist (Best for writing and fixing code)
ollama pull qwen2.5-coder:3b

# 3. The Deep Thinker (Best for logic and complex planning)
ollama pull deepseek-r1:8b
```

*(Note: Depending on your internet speed, this might take a few minutes as each model is a few gigabytes.)*

---

## Step 3: Install and Launch Aether

Now that your computer is ready, let's start Aether!

1. Open your terminal and navigate to the folder where you downloaded Aether:
   ```bash
   cd path/to/aether-tauri
   ```

2. Install the necessary packages for the app and the Python agent:
   ```bash
   npm install
   pip install -r requirements.txt
   ```

3. Launch Aether!
   ```bash
   # Make the launcher executable (only needed once on Mac/Linux)
   chmod +x ./aether.sh
   
   # Start the app!
   ./aether.sh
   ```

---

## Step 4: Your First Prompt

When the Aether window opens, you'll see different **Neural Pathways** (AGENT, TURBO, CODE, LOGIC). Think of these as different modes you can switch between depending on what you need.

![Pathway Selection](/images/pathway_selection.png)

1. Click on **AGENT**.
2. A terminal window will open. Type your first prompt:
   > "Hello Aether! What are some things you can help me with?"
3. Press **Enter**.

Aether will think and respond. Because everything runs on your machine, no data is sent to the internet!

![Terminal Prompt](/images/terminal_prompt.png)

---

## What's Next?

- **Want to customize Aether?** Type `/settings` and press Enter to change themes, models, and more.
- **Curious about advanced features?** Check out the [Advanced Features Guide](ADVANCED_FEATURES.md) to learn about AetherVault (memory) and Nexus Shield (privacy).
- **Need help?** Check our [Troubleshooting Guide](../TROUBLESHOOTING.md) if you hit any bumps.

Welcome to the future of sovereign computing! 🌌
