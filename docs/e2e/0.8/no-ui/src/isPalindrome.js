export function isPalindrome(value) {
  if (typeof value !== 'string') return false
  const normalized = value.normalize('NFKC').toLowerCase().replace(/[\p{P}\p{Z}]/gu, '')
  return normalized === [...normalized].reverse().join('')
}
