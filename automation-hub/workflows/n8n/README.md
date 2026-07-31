# Runnable n8n workflows

These files are importable n8n webhook demonstrations built only with core nodes. They contain no credentials, external customer data, or paid integrations.

## Included workflows

| Workflow | Purpose | Webhook path |
|---|---|---|
| `privacy-safe-lead-qualifier.json` | Scores a consented demo lead and recommends a next action | `vantra-lead-qualifier` |
| `faq-router.json` | Routes approved FAQ categories and escalates unknown questions | `vantra-faq-router` |
| `order-status-webhook.json` | Looks up synthetic orders after matching an order ID and email | `vantra-order-status` |

## Import and test

1. Open n8n and create or open a project.
2. Import one JSON file using **Import from File**.
3. Open the imported workflow.
4. Select the **Webhook** node and click **Listen for test event**.
5. Copy the test URL shown by n8n.
6. Send the matching JSON payload with curl, Postman, Insomnia, or another HTTP client.

### Lead qualifier

```bash
curl -X POST "PASTE_N8N_TEST_URL" \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana","businessType":"jewelry","monthlyMessages":450,"budget":150,"timelineDays":14,"consent":true}'
```

### FAQ router

```bash
curl -X POST "PASTE_N8N_TEST_URL" \
  -H "Content-Type: application/json" \
  -d '{"message":"¿Cuánto tarda el envío?","language":"es"}'
```

### Order status

```bash
curl -X POST "PASTE_N8N_TEST_URL" \
  -H "Content-Type: application/json" \
  -d '{"orderId":"VAN-1001","email":"ana@example.com"}'
```

## Important limitations

These are safe demonstrations, not production deployments. Before using one with real customers, add authentication, rate limiting, a real data source, retention rules, monitoring, error handling, and an approved human-escalation process. Never place credentials directly inside an exported workflow.

## Contributing

A useful workflow contribution must be importable, disabled by default, free of credentials, documented with a synthetic test payload, and runnable with standard n8n nodes whenever possible. Link the pull request to an open Issue.