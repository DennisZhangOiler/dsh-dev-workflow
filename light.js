/** Light mode preset entry point. */
import { applyWithMode, inject, name } from './index.js'

export { inject, name }

export function apply(ctx) {
  return applyWithMode(ctx, 'light')
}
