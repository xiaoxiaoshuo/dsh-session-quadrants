window.__ModuleLoader__.load({
  id: '@local/dsh-session-quadrants',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const NS = 'local.sessionQuadrants';
    const ROW_ID = 'local-session-quadrants';
    const IDS = ['important-urgent', 'important-not-urgent', 'urgent-not-important', 'neither'];
    const COLORS = {
      'important-urgent': 'var(--dsw-alias-state-error-primary)',
      'important-not-urgent': 'var(--dsw-alias-state-warn-primary)',
      'urgent-not-important': 'var(--dsw-alias-brand-primary)',
      neither: 'var(--dsw-alias-state-idle-primary)',
    };
    const validId = value => typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/.test(value)
      && !['__proto__', 'constructor', 'prototype'].includes(value);
    const dictionaries = {
      zh: {
        title: '四象限标识', edit: '设置四象限标识', editFor: '设置「{title}」的四象限标识',
        untitled: '未命名会话', subtitle: '按重要性与紧急性分类，选择后自动保存。',
        'important-urgent': '重要且紧急', 'important-not-urgent': '重要不紧急',
        'urgent-not-important': '紧急不重要', neither: '不重要不紧急',
        'hint.important-urgent': '优先处理', 'hint.important-not-urgent': '安排计划',
        'hint.urgent-not-important': '尽快处理或委派', 'hint.neither': '稍后处理',
        clear: '清除标识', none: '未标记', close: '关闭', selected: '已选择',
        loading: '正在读取标识…', saving: '正在保存…', retry: '重新读取',
        failed: '操作失败：{reason}', unavailable: '标识设置暂不可用，请重试。',
        legend: '红 · 重要且紧急　橙 · 重要不紧急　蓝 · 紧急不重要　灰 · 不重要不紧急',
      },
      en: {
        title: 'Session quadrant', edit: 'Set session quadrant', editFor: 'Set quadrant for “{title}”',
        untitled: 'Untitled session', subtitle: 'Classify importance and urgency. Changes save automatically.',
        'important-urgent': 'Important & urgent', 'important-not-urgent': 'Important, not urgent',
        'urgent-not-important': 'Urgent, not important', neither: 'Neither important nor urgent',
        'hint.important-urgent': 'Do first', 'hint.important-not-urgent': 'Schedule',
        'hint.urgent-not-important': 'Handle or delegate', 'hint.neither': 'Defer',
        clear: 'Clear label', none: 'Unmarked', close: 'Close', selected: 'Selected',
        loading: 'Loading labels…', saving: 'Saving…', retry: 'Reload',
        failed: 'Could not save: {reason}', unavailable: 'Label settings are unavailable. Please retry.',
        legend: 'Red: important & urgent · Amber: important · Blue: urgent · Gray: neither',
      },
    };
    const CSS = `
.dsh-sq-icon{display:inline-flex;align-items:center;justify-content:center;flex:none;width:22px;height:22px;padding:0;border:0;border-radius:5px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;font:inherit}
.dsh-sq-icon:hover,.dsh-sq-menu:hover,.dsh-sq-button:hover{background:var(--dsw-alias-bg-layer-2)}
.dsh-sq-icon:focus-visible,.dsh-sq-menu:focus-visible,.dsh-sq-button:focus-visible,.dsh-sq-option:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}
.dsh-sq-glyph{display:inline-flex;align-items:center;justify-content:center;flex:none;box-sizing:border-box;width:16px;height:16px;border:1px solid currentColor;border-radius:4px;font-size:10px;font-weight:700;line-height:1}
.dsh-sq-menu{display:flex;align-items:center;gap:8px;width:100%;box-sizing:border-box;padding:7px 10px;border:0;border-radius:5px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;text-align:left;cursor:pointer}
.dsh-sq-menu-label{flex:1;white-space:nowrap}.dsh-sq-current{color:var(--dsw-alias-label-secondary);font-size:11px}
.dsh-sq-hover{display:flex;align-items:center;gap:6px;padding:5px 0;color:var(--dsw-alias-label-secondary);font-size:12px}
.dsh-sq-backdrop{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;box-sizing:border-box;padding:20px;pointer-events:auto;background:color-mix(in srgb,var(--dsw-alias-bg-base) 72%,transparent);z-index:1000}
.dsh-sq-dialog{box-sizing:border-box;width:400px;max-width:100%;max-height:calc(100dvh - 40px);overflow:auto;padding:20px;border:1px solid var(--dsw-alias-border-l2);border-radius:14px;background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);box-shadow:0 12px 48px color-mix(in srgb,var(--dsw-alias-label-primary) 15%,transparent);font:inherit}
.dsh-sq-heading{display:flex;align-items:center;justify-content:space-between;gap:12px}.dsh-sq-heading h2{margin:0;font-size:17px;line-height:24px;font-weight:600}
.dsh-sq-session{margin:8px 0 0;font-size:13px;overflow-wrap:anywhere;color:var(--dsw-alias-label-secondary)}
.dsh-sq-description{margin:6px 0 16px;font-size:12px;line-height:1.6;color:var(--dsw-alias-label-secondary)}
.dsh-sq-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.dsh-sq-option{position:relative;box-sizing:border-box;display:flex;flex-direction:column;align-items:flex-start;gap:8px;min-height:106px;padding:12px;border:1px solid var(--dsw-alias-border-l1);border-inline-start:4px solid var(--sq-color);border-radius:8px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;text-align:left;cursor:pointer}
.dsh-sq-option:hover{background:var(--dsw-alias-bg-layer-2)}.dsh-sq-option[aria-pressed="true"]{border-color:var(--sq-color);background:color-mix(in srgb,var(--sq-color) 10%,var(--dsw-alias-bg-layer-1))}
.dsh-sq-option-top{display:flex;align-items:center;justify-content:space-between;width:100%;color:var(--sq-color)}
.dsh-sq-option-name{font-size:13px;line-height:1.5;font-weight:600}.dsh-sq-hint{font-size:11px;line-height:1.5;color:var(--dsw-alias-label-secondary)}
.dsh-sq-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:16px}.dsh-sq-button{padding:7px 10px;border:1px solid var(--dsw-alias-border-l1);border-radius:6px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;cursor:pointer}
.dsh-sq-status{min-height:18px;margin:10px 0 0;font-size:12px;color:var(--dsw-alias-label-secondary)}.dsh-sq-error{font-size:12px;line-height:1.6;color:var(--dsw-alias-state-error-primary);overflow-wrap:anywhere}
.dsh-sq-option:disabled,.dsh-sq-button:disabled{opacity:.55;cursor:wait}
@media(max-width:360px){.dsh-sq-grid{grid-template-columns:1fr}.dsh-sq-dialog{padding:14px}}
@media(forced-colors:active){.dsh-sq-option[aria-pressed="true"]{outline:2px solid Highlight}}
`;

    function Glyph({ quadrant }) {
      if (quadrant) return h('span', { className: 'dsh-sq-glyph', 'aria-hidden': true, style: { color: COLORS[quadrant] } }, IDS.indexOf(quadrant) + 1);
      return h('svg', { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', 'aria-hidden': true },
        ...[[2, 2], [9, 2], [2, 9], [9, 9]].map(([x, y]) => h('rect', { key: `${x}-${y}`, x, y, width: 5, height: 5, rx: 1 })));
    }
    function RowAction({ sessionId, displayTitle, useQuadrants, openChooser, t }) {
      const quadrant = useQuadrants(s => s.marks[sessionId] ?? null);
      if (!validId(sessionId)) return null;
      // The owner's stable row identity is the only Host selector we depend on.
      // A component-owned style keeps the stripe visible even while the hover-action
      // strip is hidden, without replacing status dots or mutating another DOM node.
      const stripe = quadrant ? `[data-row-key="session:${sessionId}"]{box-shadow:inset 3px 0 0 ${COLORS[quadrant]};}` : '';
      return h(React.Fragment, null,
        stripe && h('style', null, stripe),
        h('button', {
          type: 'button', className: 'dsh-sq-icon',
          'aria-label': t('editFor', { title: displayTitle || t('untitled') }),
          title: `${t('edit')} · ${t(quadrant || 'none')}`,
          onClick: e => { e.stopPropagation(); openChooser(sessionId, displayTitle, e.currentTarget); },
        }, h(Glyph, { quadrant })));
    }
    function MenuItem({ sessionId, displayTitle, useMenuOpenState, useQuadrants, openChooser, t }) {
      const [, setMenuOpen] = useMenuOpenState();
      const quadrant = useQuadrants(s => s.marks[sessionId] ?? null);
      return h('button', {
        type: 'button', role: 'menuitem', className: 'dsh-sq-menu',
        onClick: () => { setMenuOpen(false); openChooser(sessionId, displayTitle); },
      }, h(Glyph, { quadrant }), h('span', { className: 'dsh-sq-menu-label' }, t('title')),
      h('span', { className: 'dsh-sq-current' }, quadrant ? `Q${IDS.indexOf(quadrant) + 1}` : t('none')));
    }
    function HoverInfo({ sessionId, useQuadrants, t }) {
      const quadrant = useQuadrants(s => s.marks[sessionId] ?? null);
      return quadrant ? h('div', { className: 'dsh-sq-hover' }, h(Glyph, { quadrant }), t(quadrant)) : null;
    }
    function Chooser({ dialog, state, setQuadrant, closeChooser, reload, t }) {
      const panel = React.useRef(null);
      const titleId = React.useId();
      const descriptionId = React.useId();
      const current = state.marks[dialog.sessionId] ?? null;
      const pending = state.pending[dialog.sessionId] === true;
      const error = state.errors[dialog.sessionId] || state.error;
      React.useEffect(() => {
        const active = document.activeElement;
        panel.current?.focus();
        return () => {
          const target = dialog.returnFocus || active;
          if (target?.isConnected && typeof target.focus === 'function') target.focus();
        };
      }, [dialog]);
      function onKeyDown(event) {
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeChooser(); }
        if (event.key !== 'Tab') return;
        const controls = Array.from(panel.current?.querySelectorAll('button:not(:disabled)') || []);
        const first = controls[0], last = controls.at(-1);
        if (!first) { event.preventDefault(); return; }
        const active = document.activeElement;
        if (event.shiftKey && (active === first || active === panel.current)) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && (active === last || active === panel.current)) { event.preventDefault(); first.focus(); }
      }
      return h('div', {
        className: 'dsh-sq-backdrop', onKeyDown,
        onClick: e => { if (e.target === e.currentTarget) closeChooser(); },
      }, h('section', {
        className: 'dsh-sq-dialog', ref: panel, tabIndex: -1,
        role: 'dialog', 'aria-modal': true, 'aria-labelledby': titleId, 'aria-describedby': descriptionId,
        'aria-busy': pending,
      },
      h('header', { className: 'dsh-sq-heading' }, h('h2', { id: titleId }, t('title')),
        h('button', { type: 'button', className: 'dsh-sq-icon', 'aria-label': t('close'), onClick: closeChooser }, '×')),
      h('p', { className: 'dsh-sq-session' }, dialog.displayTitle || t('untitled')),
      h('p', { className: 'dsh-sq-description', id: descriptionId }, t('subtitle')),
      h('div', { className: 'dsh-sq-grid', role: 'group', 'aria-label': t('title') }, ...IDS.map((id, index) =>
        h('button', {
          key: id, type: 'button', className: 'dsh-sq-option', style: { '--sq-color': COLORS[id] },
          'aria-pressed': current === id, disabled: pending || !state.ready || !state.namespace,
          onClick: () => setQuadrant(dialog.sessionId, id, dialog),
        }, h('span', { className: 'dsh-sq-option-top' }, `Q${index + 1}`, current === id ? h('span', { 'aria-label': t('selected') }, '✓') : null),
        h('span', { className: 'dsh-sq-option-name' }, t(id)), h('span', { className: 'dsh-sq-hint' }, t('hint.' + id))))),
      h('div', { className: 'dsh-sq-status', role: 'status', 'aria-live': 'polite' },
        pending ? t('saving') : !state.ready ? t('loading') : `${t('selected')}：${t(current || 'none')}`),
      error && h('p', { className: 'dsh-sq-error', role: 'alert' }, t('failed', { reason: error })),
      state.ready && !state.namespace && !error && h('p', { className: 'dsh-sq-error', role: 'alert' }, t('unavailable')),
      h('footer', { className: 'dsh-sq-footer' },
        h('button', { type: 'button', className: 'dsh-sq-button', disabled: pending || !current || !state.namespace, onClick: () => setQuadrant(dialog.sessionId, null, dialog) }, t('clear')),
        (error || !state.namespace) && h('button', { type: 'button', className: 'dsh-sq-button', disabled: pending, onClick: reload }, t('retry')),
        h('button', { type: 'button', className: 'dsh-sq-button', onClick: closeChooser }, t('close')))));
    }
    function Overlay(props) {
      const state = props.useQuadrants(s => s);
      return h(React.Fragment, null, h('style', null, CSS), state.dialog && h(Chooser, { ...props, key: state.dialog.token, dialog: state.dialog, state }));
    }

    return {
      inject: ['slots', 'locale', 'remote', 'remote.settings'],
      apply(ctx) {
        let state = { marks: {}, namespace: null, revision: -1, ready: false, error: null, pending: {}, errors: {}, dialog: null };
        let disposed = false, inFlight, reloadRequested = false, token = 0;
        const listeners = new Set();
        const store = { getSnapshot: () => state, subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); } };
        function publish(patch) {
          if (disposed) return;
          state = { ...state, ...patch };
          for (const listener of listeners) listener();
        }
        function adopt(row) {
          if (!row || row.revision < state.revision) return;
          const marks = Object.fromEntries(Object.entries(row.value?.marks ?? {}).filter(([key, value]) => validId(key) && IDS.includes(value)));
          publish({ namespace: row.ns, marks, revision: row.revision, ready: true, error: null });
        }
        function unwrap(result) {
          if (!result?.ok) throw new Error(result?.error?.message || 'Settings request failed.');
          return result.value;
        }
        function reload() {
          if (disposed) return Promise.resolve();
          if (inFlight) { reloadRequested = true; return inFlight; }
          inFlight = (async () => {
            do {
              reloadRequested = false;
              try {
                const value = unwrap(await ctx.remote.settings.describe());
                if (disposed) return;
                const rows = value.namespaces.filter(row => row.ns === ROW_ID || row.ns.endsWith(':' + ROW_ID));
                if (rows.length !== 1) publish({ namespace: null, ready: true });
                else adopt(rows[0]);
              } catch (error) {
                publish({ ready: true, error: error instanceof Error ? error.message : String(error) });
              }
            } while (reloadRequested && !disposed);
          })().finally(() => { inFlight = undefined; });
          return inFlight;
        }
        function openChooser(sessionId, displayTitle, returnFocus) {
          if (!validId(sessionId)) return;
          publish({ dialog: { sessionId, displayTitle, returnFocus, token: ++token }, errors: { ...state.errors, [sessionId]: null } });
          void reload();
        }
        function closeChooser() { publish({ dialog: null }); }
        async function setQuadrant(sessionId, quadrant, dialog) {
          if (!validId(sessionId) || (quadrant !== null && !IDS.includes(quadrant)) || state.pending[sessionId]) return;
          publish({ pending: { ...state.pending, [sessionId]: true }, errors: { ...state.errors, [sessionId]: null } });
          try {
            if (!state.namespace) await reload();
            if (!state.namespace) throw new Error('Session quadrant settings are unavailable.');
            const path = ['marks', sessionId];
            const op = quadrant === null ? { op: 'unset', path } : { op: 'set', path, value: quadrant };
            const row = unwrap(await ctx.remote.settings.mutate(state.namespace, [op], undefined));
            adopt(row);
            if (state.dialog === dialog) closeChooser();
          } catch (error) {
            publish({ errors: { ...state.errors, [sessionId]: error instanceof Error ? error.message : String(error) } });
          } finally {
            const pending = { ...state.pending }; delete pending[sessionId];
            publish({ pending });
          }
        }
        ctx.effect(() => ctx.locale.register(NS, dictionaries), 'session-quadrants: locale');
        ctx.effect(() => {
          const offSettings = ctx.remote.$on('settings/document-updated', ns => {
            if (ns === ROW_ID || ns.endsWith(':' + ROW_ID)) void reload();
          });
          const offReset = ctx.on('connection/reset', () => { publish({ revision: -1 }); void reload(); });
          void reload();
          return () => { disposed = true; offSettings(); offReset(); listeners.clear(); };
        }, 'session-quadrants: settings');
        const inject = () => ({ hooks: { quadrants: store }, openChooser, closeChooser, setQuadrant, reload });
        for (const [name, id, order, component] of [
          ['sidebar.workspaces.session.row.action', 'local.session-quadrants.action', 50, RowAction],
          ['sidebar.workspaces.session.menu.item', 'local.session-quadrants.menu', 250, MenuItem],
          ['sidebar.session.row.hover', 'local.session-quadrants.detail', 20, HoverInfo],
          ['shell.overlay', 'local.session-quadrants.chooser', 100, Overlay],
        ]) ctx.slots.inject(name, () => ctx.slots.register({ name, id, order, locale: NS, inject }, component));
      },
    };
  },
});
