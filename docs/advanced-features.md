<div align="center">

# 🛠️ Advanced Features

*Unlock the full potential of your Aether workstation.*

</div>

---

Once you've mastered the basics in the [Getting Started Guide](GETTING_STARTED.md), it's time to dive into the core technologies that make Aether a powerful neural workstation.

---

## 1. AetherVault & The Shadow Monitor

**AetherVault** is your AI's long-term memory. Unlike cloud assistants that forget everything when you start a new chat, Aether continuously learns about you and your projects.

### How it Works
All memories are saved as plain text Markdown (`.md`) files in a folder on your computer (default: `~/Documents/Vault`). This means you own your memories, and you can edit or read them with any text editor (like Obsidian).

### The Shadow Monitor
When you talk to Aether, a silent background process called the **Shadow Monitor** reads the conversation. It extracts important facts, preferences, and context, and saves them as `shadow_*.md` fragments in your Vault. 

*Example: If you tell Aether "I prefer Python over JavaScript", the Shadow Monitor will silently create a memory fragment noting this preference for all future conversations.*

---

## 2. Model Context Protocol (MCP) Integration

Aether uses the **OpenClaw Hybrid Bridge** to support the **Model Context Protocol (MCP)**. This is a standardized way for AI models to connect to external data sources and tools.

### What does this mean for you?
You can give Aether new abilities instantly! If you want Aether to search your local database, fetch live weather, or control your smart home, you simply add an MCP server to your `~/.aether/config.json`.

**Example config enabling MCP:**
```json
{
  "mcp_enabled": true,
  "mcp_servers": {
    "fetch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"]
    }
  }
}
```
*Once enabled, Aether can fetch content from the internet autonomously!*

---

## 3. Nexus Shield (System Hardening)

Because Aether has the ability to run code and execute tools on your computer, security is paramount. The **Nexus Shield** is accessible from the UI's System Panel and offers one-click protections:

![Nexus Shield UI](/images/nexus_shield_ui.png)

- **Privacy Shield:** Blocks Windows/OS telemetry and ad trackers.
- **AI Bloat Killer:** Disables built-in OS AI tools (like Windows Recall or Copilot) to save resources for Aether.
- **Ghost Mode:** Dynamically throttles background apps when Aether is running a heavy inference task, giving the AI maximum CPU/RAM priority.

---

## 4. AetherLink (P2P Memory Sync)

Do you use Aether on your desktop and also have `Aether-Droid` on your Android phone? **AetherLink** keeps them in sync.

Running on port `8888`, AetherLink creates an encrypted, Peer-to-Peer (P2P) connection between your devices. It synchronizes your AetherVault fragments across your local network so your AI partner has a continuous memory state, whether you are at your desk or on the go.

---

## 5. Aether Eye (Vision)

Aether isn't just text-based. By leveraging small, local vision models like `moondream`, Aether can literally "see" your screen. 

When **Aether Eye** is triggered, it takes a fast, local screenshot and passes it to the vision model to understand what you are currently looking at, enabling contextual help without you needing to copy-paste error messages.

---

*Ready to troubleshoot or dig into the code? Check the [Troubleshooting Guide](../TROUBLESHOOTING.md) or [Architecture Reference](ARCHITECTURE.md).*
