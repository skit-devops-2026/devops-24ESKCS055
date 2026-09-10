import test from 'node:test';
import assert from 'node:assert';
import { capitalize } from './format.js';

test('capitalize() correctly capitalizes first letter', () => {
  // Intentional failure to trigger a red CI build
  assert.strictEqual(capitalize('hello'), 'Hello!');
});
