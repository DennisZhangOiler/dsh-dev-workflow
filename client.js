/** Always-visible workflow intensity control plus its frame-wide menu. */
window.__ModuleLoader__.load({
  id: 'dsh-rd-workflow',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const { useEffect, useRef, useState } = React
    const EN = { label: 'Workflow', aria: 'R&D workflow intensity', light: 'Light', standard: 'Standard', deep: 'Deep', error: 'Switch failed' }
    const COPY = {
      zh: { label: '流程', aria: '研发流程强度', light: '轻量', standard: '标准', deep: '深度', error: '切换失败' },
      en: EN, ja: EN, es: EN, fr: EN, de: EN, ru: EN, pt: EN,
    }
    const MODES = ['light', 'standard', 'deep']

    // One frame-wide menu instance. The trigger lives in the composer; the
    // menu lives in shell.overlay so it is never clipped by the docked composer.
    const store = {
      state: { open: false, top: 0, left: 0, mode: 'standard', labels: null, onSelect: null },
      listeners: new Set(),
      update(patch) { this.state = { ...this.state, ...patch }; for (const fn of this.listeners) fn() },
      subscribe(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn) },
    }
    function useMenu() {
      const [state, setState] = useState(store.state)
      useEffect(() => store.subscribe(() => setState(store.state)), [])
      return state
    }

    const css = `
      .rd-mode-chip{position:relative;display:inline-flex;align-items:center;gap:4px;min-width:0;max-width:180px;height:28px;padding:0 4px 0 8px;border:none;border-radius:var(--dsw-radius-sm);outline:none;background:transparent;color:var(--dsw-alias-label-secondary);font-family:inherit;font-size:13px;line-height:20px;font-weight:500;cursor:pointer}
      .rd-mode-chip:hover{background:var(--dsw-alias-interactive-bg-hover)}
      .rd-mode-chip:focus-visible{box-shadow:0 0 0 2px var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary))}
      .rd-mode-label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .rd-mode-chevron{display:inline-flex;flex:0 0 auto;color:var(--dsw-alias-label-caption);transition:transform 120ms ease}
      .rd-mode-chevron.open{transform:rotate(180deg)}
      .rd-mode-menu{position:fixed;z-index:1001;width:184px;padding:4px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-layer-1);box-shadow:0 6px 20px rgba(0,0,0,.12);font-family:inherit;pointer-events:auto}
      .rd-mode-option{display:flex;align-items:center;gap:8px;width:100%;height:32px;padding:0 8px;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-primary);font-family:inherit;font-size:13px;line-height:20px;font-weight:500;text-align:left;cursor:pointer}
      .rd-mode-option:hover{background:var(--dsw-alias-interactive-bg-hover)}
      .rd-mode-option-icon{display:inline-flex;flex:0 0 auto;color:var(--dsw-alias-label-caption)}
      .rd-mode-check{margin-left:auto;color:var(--dsw-alias-brand-primary);opacity:0}
      .rd-mode-option[aria-selected="true"] .rd-mode-check{opacity:1}
    `

    const glyph = (id, size = 14) => {
      const d = id === 'light' ? 'M2.5 8h11' : id === 'standard' ? 'M2.5 6h11M2.5 10h7' : 'M2.5 5h11M2.5 8h7M2.5 11h4'
      return h('svg', { width: size, height: size, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
        h('path', { d, stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' }))
    }
    const chevron = h('svg', { width: 12, height: 12, viewBox: '0 0 10 10', fill: 'none', 'aria-hidden': true },
      h('path', { d: 'M2.2 3.8 5 6.6l2.8-2.8', stroke: 'currentColor', strokeWidth: 1.2, strokeLinecap: 'round', strokeLinejoin: 'round' }))
    const check = h('svg', { className: 'rd-mode-check', width: 12, height: 12, viewBox: '0 0 12 12', fill: 'none', 'aria-hidden': true },
      h('path', { d: 'm2.4 6.2 2.3 2.3 4.9-4.9', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }))

    function ModeMenu({ t }) {
      const state = useMenu()
      const ref = useRef(null)
      useEffect(() => {
        if (!state.open) return undefined
        const close = () => store.update({ open: false })
        const onPointer = (event) => {
          if (ref.current?.contains(event.target)) return
          if (event.target?.closest?.('.rd-mode-chip')) return
          close()
        }
        const onKey = (event) => { if (event.key === 'Escape') close() }
        const onViewport = () => close()
        document.addEventListener('mousedown', onPointer)
        document.addEventListener('keydown', onKey)
        window.addEventListener('resize', onViewport)
        window.addEventListener('scroll', onViewport, true)
        return () => {
          document.removeEventListener('mousedown', onPointer)
          document.removeEventListener('keydown', onKey)
          window.removeEventListener('resize', onViewport)
          window.removeEventListener('scroll', onViewport, true)
        }
      }, [state.open])
      if (!state.open) return null
      const label = state.labels ?? { aria: t('aria'), light: t('light'), standard: t('standard'), deep: t('deep') }
      return h(React.Fragment, null,
        h('style', { key: 'rd-mode-css' }, css),
        h('div', { ref, className: 'rd-mode-menu', role: 'listbox', 'aria-label': label.aria, style: { top: state.top, left: state.left } },
          MODES.map(id => h('button', {
            key: id, type: 'button', role: 'option', className: 'rd-mode-option',
            'aria-selected': id === state.mode,
            onClick: () => { const action = state.onSelect; store.update({ open: false }); action?.(id) },
          }, h('span', { className: 'rd-mode-option-icon' }, glyph(id)), h('span', null, label[id]), check))))
    }

    function makeControl(ctx) {
      return function ModeControl({ sessionId, useSessions, t }) {
        const preset = useSessions(state => state.byId[sessionId]?.projectionValues?.agentPreset)
        const initial = (() => { try { return localStorage.getItem(`rd-mode:${sessionId}`) || 'standard' } catch { return 'standard' } })()
        const [mode, setMode] = useState(initial)
        const [failed, setFailed] = useState(false)
        const trigger = useRef(null)
        const menuState = useMenu()
        const open = menuState.open && menuState.sessionId === sessionId

        useEffect(() => () => { if (store.state.open && store.state.sessionId === sessionId) store.update({ open: false }) }, [sessionId])
        if (preset !== 'dev-workflow') return null

        const label = { aria: t('aria'), light: t('light'), standard: t('standard'), deep: t('deep'), error: t('error') }
        const choose = (next) => {
          if (next === mode) return
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
        const openMenu = () => {
          if (open) { store.update({ open: false }); return }
          const rect = trigger.current?.getBoundingClientRect()
          if (!rect) return
          const width = 184
          const height = MODES.length * 32 + 8
          const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8))
          const top = rect.top >= height + 8 ? rect.top - height - 6 : rect.bottom + 6
          store.update({ open: true, top, left, mode, labels: label, onSelect: choose, sessionId })
        }

        return h(React.Fragment, null,
          h('style', { key: 'rd-mode-css' }, css),
          h('button', {
            ref: trigger, type: 'button', className: 'rd-mode-chip', title: failed ? label.error : label.aria,
            'aria-label': label.aria, 'aria-haspopup': 'listbox', 'aria-expanded': open,
            disabled: !sessionId, onClick: openMenu,
          },
          glyph(mode),
          h('span', { className: 'rd-mode-label' }, label[mode]),
          h('span', { className: `rd-mode-chevron${open ? ' open' : ''}` }, chevron)))
      }
    }

    return {
      inject: ['slots', 'sessions', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register('rd.mode', COPY), 'rd-workflow.mode-locale')
        ctx.slots.inject('conversation.input.left', () => ctx.slots.register({
          name: 'conversation.input.left', id: 'rd-mode', order: 30, locale: 'rd.mode',
        }, makeControl(ctx)))
        ctx.slots.inject('shell.overlay', () => ctx.slots.register({
          name: 'shell.overlay', id: 'rd-mode-menu', order: 40, locale: 'rd.mode',
        }, ModeMenu))
      },
    }
  },
})
