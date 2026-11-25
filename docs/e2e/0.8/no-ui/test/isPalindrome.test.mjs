import assert from 'node:assert/strict'
import { test } from 'node:test'
import { isPalindrome } from '../src/isPalindrome.js'

test('AC1 punctuation phrase', () => assert.equal(isPalindrome('A man, a plan, a canal: Panama'), true))
test('AC2 empty string', () => assert.equal(isPalindrome(''), true))
test('AC3 non-palindrome', () => assert.equal(isPalindrome('hello'), false))
test('AC4 apostrophe phrase', () => assert.equal(isPalindrome("No 'x' in Nixon"), true))
test('AC5 non-string returns false', () => {
  for (const value of [null, 1, [], {}, undefined]) assert.equal(isPalindrome(value), false)
})
test('AC6 non-string object is not mutated', () => {
  const input = { toString: () => 'racecar', marker: 1 }
  const snapshot = JSON.stringify(input)
  assert.equal(isPalindrome(input), false)
  assert.equal(JSON.stringify(input), snapshot)
})
test('AC7 Unicode letters are not silently dropped', () => {
  assert.equal(isPalindrome('aä'), false)
  assert.equal(isPalindrome('你好'), false)
  assert.equal(isPalindrome('上海自来水来自海上'), true)
})
test('AC7b mixed case/punctuation still works', () => assert.equal(isPalindrome('Was it a car or a cat I saw?'), true))
