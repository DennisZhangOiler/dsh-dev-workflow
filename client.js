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
        const css = `.rd-mode-chip{position:relative;display:inline-flex;align-items:center;gap:4px;min-width:0;max-width:180px;height:28px;padding:0 4px 0 8px;border:none;border-radius:var(--dsw-radius-sm);outline:none;background:transparent;color:var(--dsw-alias-label-secondary);font-family:inherit;font-size:13px;line-height:20px;font-weight:500;cursor:pointer}.rd-mode-chip:hover{background:var(--dsw-alias-interactive-bg-hover)}.rd-mode-chip:focus-within{box-shadow:0 0 0 2px var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary))}.rd-mode-chip select{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer}.rd-mode-label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rd-mode-chevron{display:inline-flex;flex:0 0 auto;color:var(--dsw-alias-label-caption);transition:transform 120ms ease}.rd-mode-chip:focus-within .rd-mode-chevron{transform:rotate(180deg)}`
        const icon = h('svg', { width: 14, height: 14, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true, style: { flex: 'none' } },
          h('path', { d: 'M2.5 5h11M2.5 8h7M2.5 11h4', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' }))
        const chevron = h('svg', { width: 12, height: 12, viewBox: '0 0 10 10', fill: 'none', 'aria-hidden': true },
          h('path', { d: 'M2.2 3.8 5 6.6l2.8-2.8', stroke: 'currentColor', strokeWidth: 1.2, strokeLinecap: 'round', strokeLinejoin: 'round' }))
        return h(React.Fragment, null,
          h('style', { key: 'rd-mode-css' }, css),
          h('label', { className: 'rd-mode-chip', title: failed ? label.error : label.aria },
            icon,
            h('span', { className: 'rd-mode-label' }, label[mode]),
            h('span', { className: 'rd-mode-chevron' }, chevron),
            h('select', {
              id: 'rd-mode-select', 'aria-label': label.aria, value: mode, disabled: !sessionId, onChange,
            }, MODES.map(id => h('option', { key: id, value: id }, label[id])))))
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
