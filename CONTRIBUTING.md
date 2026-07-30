# Contributing to Vantra Automation Hub

Thank you for helping small businesses access safer, clearer automation examples.

## Before you start

1. Choose an open Issue and leave a comment saying you want to work on it.
2. Wait for assignment when the Issue asks for it, so contributors do not duplicate work.
3. Create a fork and a focused branch.
4. Make one meaningful contribution per pull request.

## Local validation

```bash
cd automation-hub
npm test
```

Node.js 18 or newer is required. The validator has no third-party runtime dependencies.

## Adding an automation recipe

1. Copy one JSON file from `automation-hub/recipes/`.
2. Use a unique kebab-case `id` that matches the file name.
3. Describe a real business use case, not a vague idea.
4. Add at least three ordered steps.
5. Include honest privacy notes.
6. Include at least two concrete testing checks.
7. Run `npm test` before opening the pull request.

## Pull request requirements

A pull request must:

- Link to an open Issue using `Closes #NUMBER`.
- Explain what changed and why it is useful.
- Pass automated validation.
- Contain no API keys, access tokens, passwords, customer data, or private URLs.
- Avoid copied proprietary workflow exports unless their license explicitly permits redistribution.
- Avoid cosmetic one-line changes submitted only to appear as a contributor.

Maintainers may close low-value, duplicated, unsafe, or spam contributions.

## Good contributions for beginners

- A new recipe for a specific business type.
- A translation of an existing guide.
- Clearer setup or testing instructions.
- A validator test that catches a real mistake.
- A privacy or security improvement.

## Review process

Maintainers check usefulness, correctness, privacy, scope, and validation. Requested changes should be addressed in the same pull request. We prefer squash merges to keep the history readable.

## Community expectations

Be respectful, explain decisions, and help first-time contributors learn. Read `CODE_OF_CONDUCT.md` before participating.
