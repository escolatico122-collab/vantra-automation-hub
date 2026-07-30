# Vantra Automation Hub

Open-source automation recipes for small businesses using Instagram, WhatsApp, Telegram, n8n, Make, email, spreadsheets, and AI.

> **Status:** Early-stage and actively looking for first-time contributors.

## Why this project exists

Small businesses often need simple automations but cannot afford expensive platforms or custom development. This repository provides reusable, vendor-neutral recipes that explain what an automation does, what data it needs, how it handles privacy, and how to test it.

## What you can contribute

You do not need to be an expert. Useful contributions include:

- Adding a new automation recipe in JSON.
- Improving documentation or translations.
- Adding validator tests.
- Improving privacy and security guidance.
- Creating examples for n8n or Make.

Start with the issues labeled **`good first issue`**. Each task has clear acceptance criteria.

## Quick start

```bash
git clone <repository-url>
cd mi-primer-proyecto/automation-hub
npm test
```

The Automation Hub uses only Node.js built-in modules, so there are no production dependencies.

## Repository structure

```text
automation-hub/
├── recipes/                 Reusable automation recipes
├── schemas/                 JSON schema for recipes
├── scripts/                 Validation tools
└── docs/                    Guides and roadmap
.github/                      Contribution templates and CI
CONTRIBUTING.md               Contribution rules
CODE_OF_CONDUCT.md            Community standards
SECURITY.md                   Security reporting guidance
```

## Add your first recipe

1. Read [`CONTRIBUTING.md`](CONTRIBUTING.md).
2. Choose an open `good first issue`.
3. Copy an existing file from [`automation-hub/recipes/`](automation-hub/recipes/).
4. Change the ID, description, steps, inputs, privacy notes, and testing checklist.
5. Run `cd automation-hub && npm test`.
6. Open a pull request linked to the Issue.

## Current examples

- Instagram jewelry-store FAQ assistant.
- WhatsApp lead qualifier with consent and human routing.
- Telegram order-status assistant.
- n8n lead logging to Google Sheets.
- Make missed-lead follow-up.

## Principles

- No secret keys, tokens, passwords, or personal customer data.
- No fake integrations or untested claims.
- Every recipe must include privacy notes and a testing checklist.
- Contributions must add real value; meaningless one-line changes will not be accepted.

## Español

Vantra Automation Hub es una biblioteca abierta de recetas de automatización para pequeños negocios. Puedes contribuir sin ser experto: agrega una receta, mejora una guía, traduce documentación o añade pruebas. Busca los Issues con la etiqueta **`good first issue`** y sigue las instrucciones de [`CONTRIBUTING.md`](CONTRIBUTING.md).

## License

MIT — see [`LICENSE`](LICENSE).
