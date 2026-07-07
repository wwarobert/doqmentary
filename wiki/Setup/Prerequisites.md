# Prerequisites

Before installing doqmentary, confirm you have the following.

## Required

### Node.js 18 or later

The doqmentary CLI runs on Node.js. Version 18+ is required (ESM modules, `node --test`).

Check your version:
```bash
node --version   # must be v18.0.0 or higher
```

Download from [nodejs.org](https://nodejs.org) if needed. The LTS release is recommended.

### Git

Required for cloning the repository and for the gitignore boundary to work correctly.

```bash
git --version
```

### GitHub account with Copilot access

The author skill and review board run in **GitHub Copilot Chat**. You need:
- A GitHub account with an active **GitHub Copilot** subscription (Individual, Business, or Enterprise)
- GitHub Copilot access granted (check at [github.com/settings/copilot](https://github.com/settings/copilot))

### Visual Studio Code

The Copilot skills and agents run as VS Code extensions. Download from
[code.visualstudio.com](https://code.visualstudio.com).

### GitHub Copilot extension for VS Code

Install from the VS Code Marketplace:
- Search for **GitHub Copilot** and **GitHub Copilot Chat**
- Or install via: `ext install GitHub.copilot GitHub.copilot-chat`

Sign in to your GitHub account when prompted.

## Optional

### `doqmentary.collection.yml` plugin

The `.github/doqmentary.collection.yml` file bundles the author skill and review
agents as a Copilot plugin. VS Code will prompt to activate it when you open the
workspace. You can also activate it manually via the Copilot Chat plugin panel.

---

Next: [Setup/Installation](Setup/Installation)
