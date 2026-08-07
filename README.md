# Vantra Automation Hub

[![Validate automation assets](https://github.com/escolatico122-collab/vantra-automation-hub/actions/workflows/validate-automation-recipes.yml/badge.svg)](https://github.com/escolatico122-collab/vantra-automation-hub/actions/workflows/validate-automation-recipes.yml)
[![Good first issues](https://img.shields.io/github/issues-search/escolatico122-collab/vantra-automation-hub?query=is%3Aopen%20label%3A%22good%20first%20issue%22&label=good%20first%20issues)](https://github.com/escolatico122-collab/vantra-automation-hub/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)

[Português (Brasil)](automation-hub/docs/README.pt-BR.md)

Open-source, privacy-aware automation recipes and runnable n8n webhook demos for small businesses.

> **Status:** Early-stage, usable for learning and testing, and actively welcoming first-time contributors.

## What is usable today

### Runnable n8n demos

The repository includes three credentials-free workflows that can be imported into n8n and tested through webhooks:

- [Privacy-safe lead qualifier](automation-hub/workflows/n8n/privacy-safe-lead-qualifier.json)
- [FAQ router with human escalation](automation-hub/workflows/n8n/faq-router.json)
- [Order-status lookup with identity matching](automation-hub/workflows/n8n/order-status-webhook.json)

Read the [n8n import and testing guide](automation-hub/workflows/n8n/README.md) for copyable test requests.

### Structured automation recipes

Recipes describe business behavior, required inputs, ordered steps, privacy handling, and testing requirements. Current examples cover Instagram, WhatsApp, Telegram, n8n, Make, email, and spreadsheets.

### Automated quality checks

Running `npm test` validates both recipes and n8n workflows. The checks reject incomplete data, duplicate IDs or webhook paths, enabled contributed workflows, embedded credentials, and suspicious secret patterns.

## Why this project exists

Small businesses often need simple automations but cannot afford expensive platforms or custom development. Public examples are frequently incomplete, unsafe, tied to one vendor, or filled with hidden credentials. Vantra Automation Hub provides small, reviewable building blocks that people can learn from and improve together.

## Quick start

```bash
git clone https://github.com/escolatico122-collab/vantra-automation-hub.git
cd vantra-automation-hub/automation-hub
npm test
```

The validators use only Node.js built-in modules and require Node.js 18 or newer.

For a full walkthrough — including verifying prerequisites, forking, and troubleshooting common
setup errors — see the [macOS and Linux setup guide](automation-hub/docs/setup-macos-linux.md).

## Make your first contribution

1. Choose an unassigned [`good first issue`](https://github.com/escolatico122-collab/vantra-automation-hub/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22).
2. Comment before starting so work is not duplicated.
3. Read [`CONTRIBUTING.md`](CONTRIBUTING.md).
4. Make one focused, useful change.
5. Run `cd automation-hub && npm test`.
6. Open a pull request containing `Closes #ISSUE_NUMBER`.
7. Respond to review feedback.

No advanced experience is required. Useful contributions include:

- Importable n8n workflows using synthetic data.
- New automation recipes.
- Validator tests and bug fixes.
- Accurate English, Spanish, or Portuguese documentation.
- Privacy, security, and accessibility improvements.
- Improvements to the public workflow catalog in [`docs/`](docs/).

Every person whose meaningful pull request is merged can be recognized in [`CONTRIBUTORS.md`](CONTRIBUTORS.md).

## Repository structure

```text
automation-hub/
├── recipes/                 Structured automation recipes
├── workflows/n8n/           Importable webhook demonstrations
├── schemas/                 Recipe schema
├── scripts/                 Recipe and workflow validators
└── docs/                    Technical guides and roadmap
docs/                         Static public catalog for GitHub Pages
.github/                      Issue templates, PR template, and CI
CONTRIBUTING.md               Contribution rules
CONTRIBUTORS.md               Public contributor recognition
CODE_OF_CONDUCT.md            Community standards
SECURITY.md                   Security reporting guidance
```

## Safety and quality principles

- Never commit secret keys, tokens, passwords, or real customer data.
- Use synthetic test records and obvious placeholders.
- Do not claim an integration works unless the submitted asset can be tested.
- Imported workflows must be disabled by default.
- Unknown or sensitive cases should route to a person.
- Every contribution must add real value; artificial or meaningless pull requests are rejected.

## Production warning

The included workflows are safe demonstrations, not turnkey production deployments. A real deployment still needs authentication, rate limiting, approved data sources, retention rules, monitoring, error handling, legal review where appropriate, and a human-escalation process.

## Español

Vantra Automation Hub es una biblioteca abierta de recetas y demostraciones importables de n8n para pequeños negocios. Los flujos actuales pueden recibir solicitudes mediante webhooks y responder con datos JSON sin usar credenciales externas.

Para colaborar, selecciona un Issue con la etiqueta `good first issue`, comenta antes de empezar, sigue los criterios de aceptación, ejecuta `npm test` y abre un pull request útil. No se aceptan cambios artificiales creados únicamente para aumentar estadísticas.

## License

MIT — see [`LICENSE`](LICENSE).
