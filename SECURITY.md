# Security Policy

## Reporting a vulnerability or exposed secret

Do not open a public Issue containing API keys, tokens, customer data, private webhook URLs, or exploit details.

Contact the repository owner privately through the contact method shown on their GitHub profile. Include:

- The affected file or workflow.
- A clear description of the risk.
- Safe reproduction steps using test data.
- Suggested remediation, when known.

## Supported content

The project is currently early-stage. Security fixes are prioritized for the latest version on the default branch.

## Contributor safety rules

- Use placeholders such as `YOUR_ACCESS_TOKEN`.
- Never commit `.env` files.
- Use synthetic test payloads only.
- Minimize stored personal information.
- Add rate limiting and human escalation where abuse is possible.
- Use official platform APIs and follow their terms.
