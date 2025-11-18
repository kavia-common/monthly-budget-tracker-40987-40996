import React, { useEffect, useState } from 'react';
import Layout, { Header, Banner } from '../components/Layout';
import { getConfig } from '../services/dataService';

export default function Settings() {
  const cfg = getConfig();
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Layout>
      <Header title="Settings" />
      {cfg.isMock && (
        <div style={{ marginBottom: 12 }}>
          <Banner>Mock mode enabled. Configure REACT_APP_API_BASE or REACT_APP_BACKEND_URL to use live APIs.</Banner>
        </div>
      )}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Appearance</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn ghost" onClick={() => setTheme('light')} aria-pressed={theme === 'light'}>Light</button>
            <button className="btn ghost" onClick={() => setTheme('dark')} aria-pressed={theme === 'dark'}>Dark</button>
          </div>
        </div>
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Environment</div>
          <div style={{ color: 'var(--color-muted)', fontSize: 14, display: 'grid', gap: 6 }}>
            <div><strong>API Base:</strong> {cfg.apiBase || '(not set)'}</div>
            <div><strong>Backend URL:</strong> {cfg.backendUrl || '(not set)'}</div>
            <div><strong>WS URL:</strong> {cfg.wsUrl || '(not set)'}</div>
            <div><strong>Node Env:</strong> {cfg.nodeEnv || '(not set)'}</div>
            <div><strong>Feature Flags:</strong> {JSON.stringify(cfg.flags) || '{}'}</div>
            <div><strong>Experiments:</strong> {cfg.experiments}</div>
            <div><strong>Mode:</strong> {cfg.isMock ? 'Mock' : 'Live'}</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
