import React, { useEffect, useState } from 'react';
import Layout, { Header } from '../components/Layout';
import { getSuggestions } from '../services/dataService';

export default function Suggestions() {
  const month = new Date().toISOString().slice(0, 7);
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => setItems(await getSuggestions(month)))();
  }, [month]);

  return (
    <Layout>
      <Header title="Suggestions" />
      <div className="grid">
        {items.map((s, idx) => (
          <div key={idx} className="card" style={{ borderLeft: `4px solid ${s.type === 'warning' ? 'var(--color-error)' : s.type === 'tip' ? 'var(--color-secondary)' : 'var(--color-primary)'}` }}>
            <div style={{ fontWeight: 700, marginBottom: 6, textTransform: 'capitalize' }}>{s.type}</div>
            <div>{s.text}</div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="card" style={{ color: 'var(--color-muted)' }}>No suggestions at this time.</div>
        )}
      </div>
    </Layout>
  );
}
