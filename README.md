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
cd vantra-automation-hub
npm install
npm test
```

The project uses only Node.js built-in modules, so there are no production dependencies.

## Repository structure

```text
recipes/                 Reusable automation recipes
schemas/                 JSON schema for recipes
scripts/                 Validation tools
examples/                Example payloads and templates
docs/                    Guides and roadmap
.github/                  Contribution templates and CI
```

## Add your first recipe

1. Read [`CONTRIBUTING.md`](CONTRIBUTING.md).
2. Choose an open `good first issue`.
3. Copy an existing file from `recipes/`.
4. Change the ID, description, steps, inputs, privacy notes, and testing checklist.
5. Run `npm test`.
6. Open a pull request linked to the issue.

## Principles

- No secret keys, tokens, passwords, or personal customer data.
- No fake integrations or untested claims.
- Every recipe must include privacy notes and a testing checklist.
- Contributions must add real value; meaningless one-line changes will not be accepted.

## Español

Vantra Automation Hub es una biblioteca abierta de recetas de automatización para pequeños negocios. Puedes contribuir sin ser experto: agrega una receta, mejora una guía, traduce documentación o añade pruebas. Busca los Issues con la etiqueta **`good first issue`** y sigue las instrucciones de [`CONTRIBUTING.md`](CONTRIBUTING.md).

## License

MIT — see [`LICENSE`](LICENSE).
