/** Always-visible workflow intensity control in the composer tool row. */
window.__ModuleLoader__.load({
  id: 'dsh-rd-workflow',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const EN = { label: 'Workflow', aria: 'R&D workflow intensity', light: 'Light', standard: 'Standard', deep: 'Deep', error: 'Switch failed' }
    const COPY = {
      zh: { label: '流程强度', aria: '研发流程强度', light: '轻量', standard: '标准', deep: '深度', error: '切换失败' },
      en: EN, ja: EN, es: EN, fr: EN, de: EN, ru: EN, pt: EN,
    }
    const MODES = ['light', 'standard', 'deep']

    function makeControl(ctx) {
      return function ModeControl({ sessionId, useSessions, t }) {
        const preset = useSessions(state => state.byId[sessionId]?.projectionValues?.agentPreset)
        const initial = (() => { try { return localStorage.getItem(`rd-mode:${sessionId}`) || 'standard' } catch { return 'standard' } })()
        const [mode, setMode] = React.useState(initial)
        const [failed, setFailed] = React.useState(false)
        if (preset !== 'dev-workflow') return null
        const onChange = (event) => {
          const next = event.currentTarget.value
          const previous = mode
          setMode(next); setFailed(false)
          try { localStorage.setItem(`rd-mode:${sessionId}`, next) } catch {}
          const live = ctx.sessions.binding(sessionId)?.session
          if (!live) return
          void live.command(`/mode ${next}`).then((result) => {
            if (!result?.ok || !result?.value?.matched) {
              setMode(previous); setFailed(true)
              try { localStorage.setItem(`rd-mode:${sessionId}`, previous) } catch {}
            }
          }).catch(() => { setMode(previous); setFailed(true) })
        }
        const label = { label: t('label'), aria: t('aria'), light: t('light'), standard: t('standard'), deep: t('deep'), error: t('error') }
        const css = `.rd-mode-chip{display:inline-flex;align-items:center;gap:3px;height:26px;padding:0 6px 0 5px;border:1px solid transparent;border-radius:8px;color:var(--dsw-alias-label-secondary);font-family:inherit;font-size:12px;line-height:1;cursor:pointer;transition:background .15s ease,color .15s ease}.rd-mode-chip:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}.rd-mode-chip:focus-within{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);box-shadow:0 0 0 1px var(--dsw-alias-border-l2)}.rd-mode-chip select{appearance:none;border:0;background:transparent;color:inherit;font:inherit;line-height:1;height:100%;padding:0 12px 0 1px;cursor:pointer;outline:none}.rd-mode-chip option{background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary)}`
        const icon = h('svg', { width: 13, height: 13, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true, style: { flex: 'none' } },
          h('path', { d: 'M2.5 5h11M2.5 8h7M2.5 11h4', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' }))
        const chevron = h('svg', { width: 10, height: 10, viewBox: '0 0 10 10', fill: 'none', 'aria-hidden': true, style: { marginLeft: -10, pointerEvents: 'none', opacity: 0.65 } },
          h('path', { d: 'M2.2 3.8 5 6.6l2.8-2.8', stroke: 'currentColor', strokeWidth: 1.2, strokeLinecap: 'round', strokeLinejoin: 'round' }))
        return h(React.Fragment, null,
          h('style', { key: 'rd-mode-css' }, css),
          h('label', { className: 'rd-mode-chip', title: failed ? label.error : label.aria },
            icon,
            h('select', {
              id: 'rd-mode-select', 'aria-label': label.aria, value: mode, disabled: !sessionId, onChange,
            }, MODES.map(id => h('option', { key: id, value: id }, label[id]))),
            chevron))
      }
    }

    return {
      inject: ['slots', 'sessions', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register('rd.mode', COPY), 'rd-workflow.mode-locale')
        ctx.slots.inject('conversation.input.left', () => ctx.slots.register({
          name: 'conversation.input.left', id: 'rd-mode', order: 30, locale: 'rd.mode',
        }, makeControl(ctx)))
      },
    }
  },
})
