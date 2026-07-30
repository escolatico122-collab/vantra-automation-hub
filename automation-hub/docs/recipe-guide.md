# Automation Recipe Guide

A recipe is a small, vendor-neutral specification for one useful business automation. It should help a reader understand the workflow before implementing it in code, n8n, Make, or another approved tool.

## Required fields

- `id`: unique kebab-case identifier matching the file name.
- `name`: clear human-readable name.
- `platform`: one supported platform value.
- `category`: the business purpose.
- `difficulty`: beginner, intermediate, or advanced.
- `description`: what the automation does and what it must not invent.
- `inputs`: information or configured sources required by the workflow.
- `steps`: ordered actions with meaningful descriptions.
- `privacy`: whether personal data is stored and how risk is reduced.
- `testing`: concrete checks using synthetic data.

## Quality standard

A useful recipe is specific enough that another contributor could implement it without guessing the business logic. It includes a human escalation path where the automation may be uncertain or unsafe.

## Safe example values

Use placeholders such as:

- `YOUR_ACCESS_TOKEN`
- `TEST_ORDER_001`
- `customer@example.test`
- `https://example.invalid/webhook`

Never commit real tokens, customer conversations, phone numbers, addresses, or private webhook URLs.

## Validation

From the project directory:

```bash
cd automation-hub
npm test
```

The command checks required fields, unique IDs, ordered steps, supported values, privacy notes, testing instructions, and common secret patterns.
