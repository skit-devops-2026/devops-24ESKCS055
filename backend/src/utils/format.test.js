import test from 'node:test';
import assert from 'node:assert';
import { capitalize } from './format.js';

test('capitalize() correctly capitalizes first letter', () => {
  assert.strictEqual(capitalize('hello'), 'Hello');
});

test('capitalize() handles empty string', () => {
  assert.strictEqual(capitalize(''), '');
});
