# Installation

## 1. Fork or clone the repository

**If you are setting up doqmentary for your organisation** (recommended): fork the
repository on GitHub so you can commit your own enterprise libraries and config
without affecting the upstream repo.

**If you are evaluating doqmentary**: clone directly.

```bash
git clone https://github.com/<your-org>/doqmentary.git
cd doqmentary
```

## 2. Install CLI dependencies

The CLI has a single dependency (`js-yaml`). Install it once:

```bash
cd cli
npm install
cd ..
```

This is the only step that touches the network. The CLI itself runs fully offline.

## 3. Verify the installation

Run the CLI from the repository root (so it can find the global `doqmentary.yaml`):

```bash
node cli/bin/doqmentary.mjs validate --help
```

You should see the validate command's help output. If you see an error, confirm
Node.js 18+ is active and that `npm install` completed successfully in `cli/`.

## 4. Run the test suite (optional but recommended)

```bash
cd cli
npm test
cd ..
```

All 45 tests should pass. This confirms the CLI is working correctly on your machine.

## 5. Open the workspace in VS Code and activate the Copilot plugin

1. Open the repository root in VS Code: `code .`
2. VS Code may prompt: _"This workspace has a Copilot plugin. Activate it?"_ — click **Activate**.
3. If not prompted, open Copilot Chat and look for the plugin panel to activate
   `doqmentary.collection.yml` manually.

Once activated, `@author-solution-outline`, `@review-enterprise-architect`,
`@review-solution-architect`, and `@review-manager-readability` will be available
in Copilot Chat.

## 6. Add your enterprise libraries

The shipped repository contains example principles and decisions (`*.example.md`).
Before authoring real documents, add your organisation's actual entries.

See [Setup/Configure-Enterprise-Libraries](Setup/Configure-Enterprise-Libraries).

---

Next: [Setup/Configure-Enterprise-Libraries](Setup/Configure-Enterprise-Libraries)
