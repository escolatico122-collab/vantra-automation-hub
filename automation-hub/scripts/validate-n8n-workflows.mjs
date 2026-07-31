import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const workflowsDirectory = fileURLToPath(new URL('../workflows/n8n/', import.meta.url));
const forbiddenSecretPatterns = [
  /sk-ant-[a-z0-9_-]+/i,
  /AIza[0-9A-Za-z_-]{20,}/,
  /EA[A-Za-z0-9]{20,}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validateWorkflow(workflow, fileName, knownPaths) {
  assert(workflow && typeof workflow === 'object' && !Array.isArray(workflow), `${fileName}: root must be an object`);
  assert(typeof workflow.name === 'string' && workflow.name.length >= 8, `${fileName}: workflow name is missing or too short`);
  assert(Array.isArray(workflow.nodes) && workflow.nodes.length >= 3, `${fileName}: add at least three nodes`);
  assert(workflow.connections && typeof workflow.connections === 'object', `${fileName}: connections object is required`);
  assert(workflow.active === false, `${fileName}: contributed workflows must be disabled by default`);

  const names = new Set();
  for (const node of workflow.nodes) {
    assert(typeof node.name === 'string' && node.name.length > 0, `${fileName}: every node needs a name`);
    assert(!names.has(node.name), `${fileName}: duplicate node name "${node.name}"`);
    names.add(node.name);
    assert(typeof node.type === 'string' && node.type.startsWith('n8n-nodes-'), `${fileName}: unsupported node type`);
    assert(!Object.hasOwn(node, 'credentials'), `${fileName}: exported credentials are not allowed`);
  }

  const webhook = workflow.nodes.find((node) => node.type === 'n8n-nodes-base.webhook');
  assert(webhook, `${fileName}: a Webhook node is required for runnable demos`);
  const webhookPath = webhook.parameters?.path;
  assert(typeof webhookPath === 'string' && /^[a-z0-9-]+$/.test(webhookPath), `${fileName}: webhook path must use lowercase kebab-case`);
  assert(!knownPaths.has(webhookPath), `${fileName}: duplicate webhook path "${webhookPath}"`);
  knownPaths.add(webhookPath);

  assert(workflow.nodes.some((node) => node.type === 'n8n-nodes-base.respondToWebhook'), `${fileName}: add a Respond to Webhook node`);

  const serialized = JSON.stringify(workflow);
  for (const pattern of forbiddenSecretPatterns) {
    assert(!pattern.test(serialized), `${fileName}: possible secret or private key detected`);
  }
}

async function main() {
  const entries = await readdir(workflowsDirectory, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => entry.name)
    .sort();

  assert(files.length > 0, 'No n8n workflow files found');

  const knownPaths = new Set();
  const failures = [];
  for (const fileName of files) {
    try {
      const workflow = JSON.parse(await readFile(join(workflowsDirectory, fileName), 'utf8'));
      validateWorkflow(workflow, fileName, knownPaths);
      console.log(`✓ ${fileName}`);
    } catch (error) {
      failures.push(error.message);
      console.error(`✗ ${error.message}`);
    }
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} n8n workflow validation error(s).`);
    process.exitCode = 1;
    return;
  }

  console.log(`\nValidated ${files.length} n8n workflow(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
