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
        const label = { label: t('label'), aria: t('aria'), light: t('light'), standard: t('standard'), deep: t('deep') }
        return h('label', { title: failed ? t('error') : label.aria, style: { display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--dsw-alias-text-secondary)' } },
          h('span', { style: { whiteSpace: 'nowrap' } }, label.label),
          h('select', {
            id: 'rd-mode-select', 'aria-label': label.aria, value: mode, disabled: !sessionId, onChange,
            style: { height: 26, padding: '0 4px', borderRadius: 6, border: '1px solid var(--dsw-alias-border-secondary)', background: 'var(--dsw-alias-bg-secondary)', color: 'var(--dsw-alias-text-primary)', fontSize: 11, cursor: 'pointer' },
          }, MODES.map(id => h('option', { key: id, value: id }, label[id]))))
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
