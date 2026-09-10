import test from 'node:test';
import assert from 'node:assert';
import generateToken from './generateToken.js';

test('generateToken exists as a function', () => {
  assert.strictEqual(typeof generateToken, 'function');
});
