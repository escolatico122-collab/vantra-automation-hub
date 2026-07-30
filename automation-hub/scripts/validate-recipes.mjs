import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const recipesDirectory = new URL('../recipes/', import.meta.url);
const allowedPlatforms = new Set([
  'instagram',
  'whatsapp',
  'telegram',
  'n8n',
  'make',
  'email',
  'sheets',
  'multi-platform',
]);
const allowedCategories = new Set([
  'customer-support',
  'sales',
  'lead-management',
  'appointments',
  'operations',
  'content',
  'analytics',
]);
const allowedDifficulties = new Set(['beginner', 'intermediate', 'advanced']);
const forbiddenSecretPatterns = [
  /sk-ant-[a-z0-9_-]+/i,
  /AIza[0-9A-Za-z_-]{20,}/,
  /EA[A-Za-z0-9]{20,}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validateRecipe(recipe, fileName, knownIds) {
  assert(recipe && typeof recipe === 'object' && !Array.isArray(recipe), `${fileName}: root must be an object`);

  const required = [
    'id',
    'name',
    'platform',
    'category',
    'difficulty',
    'description',
    'inputs',
    'steps',
    'privacy',
    'testing',
  ];
  for (const field of required) {
    assert(Object.hasOwn(recipe, field), `${fileName}: missing required field "${field}"`);
  }

  assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(recipe.id), `${fileName}: id must use kebab-case`);
  assert(!knownIds.has(recipe.id), `${fileName}: duplicate recipe id "${recipe.id}"`);
  knownIds.add(recipe.id);

  assert(typeof recipe.name === 'string' && recipe.name.length >= 5, `${fileName}: name is too short`);
  assert(allowedPlatforms.has(recipe.platform), `${fileName}: unsupported platform "${recipe.platform}"`);
  assert(allowedCategories.has(recipe.category), `${fileName}: unsupported category "${recipe.category}"`);
  assert(allowedDifficulties.has(recipe.difficulty), `${fileName}: unsupported difficulty "${recipe.difficulty}"`);
  assert(typeof recipe.description === 'string' && recipe.description.length >= 30, `${fileName}: description must be at least 30 characters`);

  assert(Array.isArray(recipe.inputs) && recipe.inputs.length >= 1, `${fileName}: inputs must contain at least one item`);
  assert(new Set(recipe.inputs).size === recipe.inputs.length, `${fileName}: inputs must be unique`);
  assert(recipe.inputs.every((item) => typeof item === 'string' && item.length >= 2), `${fileName}: every input must be descriptive text`);

  assert(Array.isArray(recipe.steps) && recipe.steps.length >= 3, `${fileName}: add at least three steps`);
  recipe.steps.forEach((step, index) => {
    assert(step && typeof step === 'object', `${fileName}: step ${index + 1} must be an object`);
    assert(step.order === index + 1, `${fileName}: step order must be sequential starting at 1`);
    assert(typeof step.action === 'string' && step.action.length >= 3, `${fileName}: step ${index + 1} action is too short`);
    assert(typeof step.description === 'string' && step.description.length >= 15, `${fileName}: step ${index + 1} description is too short`);
  });

  assert(recipe.privacy && typeof recipe.privacy === 'object', `${fileName}: privacy must be an object`);
  assert(typeof recipe.privacy.storesPersonalData === 'boolean', `${fileName}: privacy.storesPersonalData must be boolean`);
  assert(typeof recipe.privacy.notes === 'string' && recipe.privacy.notes.length >= 20, `${fileName}: privacy notes are too short`);

  assert(Array.isArray(recipe.testing) && recipe.testing.length >= 2, `${fileName}: add at least two testing checks`);
  assert(recipe.testing.every((item) => typeof item === 'string' && item.length >= 10), `${fileName}: testing checks must be descriptive`);

  const serialized = JSON.stringify(recipe);
  for (const pattern of forbiddenSecretPatterns) {
    assert(!pattern.test(serialized), `${fileName}: possible secret or private key detected`);
  }
}

async function main() {
  const entries = await readdir(recipesDirectory, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => entry.name)
    .sort();

  assert(files.length > 0, 'No recipe files found in automation-hub/recipes');

  const knownIds = new Set();
  const failures = [];

  for (const fileName of files) {
    try {
      const raw = await readFile(join(recipesDirectory.pathname, fileName), 'utf8');
      const recipe = JSON.parse(raw);
      validateRecipe(recipe, fileName, knownIds);
      console.log(`✓ ${fileName}`);
    } catch (error) {
      failures.push(error.message);
      console.error(`✗ ${error.message}`);
    }
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} recipe validation error(s).`);
    process.exitCode = 1;
    return;
  }

  console.log(`\nValidated ${files.length} automation recipe(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
