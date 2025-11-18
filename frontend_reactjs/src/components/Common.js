import React from 'react';

export function Modal({ open, onClose, title, children, actions }) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label={title}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
        display: 'grid', placeItems: 'center', zIndex: 50
      }}
      onClick={onClose}
    >
      <div className="card" style={{ width: 'min(560px, 92vw)' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{title}</div>
          <button className="btn ghost" style={{ marginLeft: 'auto' }} onClick={onClose} aria-label="Close">Close</button>
        </div>
        <div>{children}</div>
        {actions ? <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>{actions}</div> : null}
      </div>
    </div>
  );
}

export function Pill({ color = 'var(--color-primary)', children }) {
  return (
    <span className="badge" style={{ background: 'transparent', color, border: `1px solid ${color}` }}>
      {children}
    </span>
  );
}

export function EmptyState({ title, subtitle, action }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: 30 }}>
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>{title}</div>
      <div style={{ color: 'var(--color-muted)', marginBottom: 12 }}>{subtitle}</div>
      {action}
    </div>
  );
}
