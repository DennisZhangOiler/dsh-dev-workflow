export function hasDuplicateSlow(items) {
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (Object.is(items[i], items[j])) return true
    }
  }
  return false
}
