import assert from 'node:assert/strict'
import { test } from 'node:test'
import { hasDuplicateSlow } from '../src/dedupe.js'

test('detects duplicates', () => {
  assert.equal(hasDuplicateSlow([1, 2, 3, 2]), true)
  assert.equal(hasDuplicateSlow([1, 2, 3]), false)
})
