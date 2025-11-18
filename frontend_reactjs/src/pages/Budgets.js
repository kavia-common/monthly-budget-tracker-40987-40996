import React, { useEffect, useState } from 'react';
import Layout, { Header, Banner } from '../components/Layout';
import { fetchBudgets, upsertBudget, getConfig } from '../services/dataService';

export default function Budgets() {
  const month = new Date().toISOString().slice(0, 7);
  const { isMock } = getConfig();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ category: '', amount: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const data = await fetchBudgets(month);
      setItems(data);
    })();
  }, [month]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.category || !form.amount) {
      setError('Category and amount are required.');
      return;
    }
    if (Number.isNaN(Number(form.amount)) || Number(form.amount) < 0) {
      setError('Amount must be a positive number.');
      return;
    }
    setSaving(true);
    try {
      const saved = await upsertBudget(form);
      const idx = items.findIndex(i => i.id === saved.id || i.category === saved.category);
      if (idx >= 0) {
        const next = [...items];
        next[idx] = saved;
        setItems(next);
      } else {
        setItems([saved, ...items]);
      }
      setForm({ category: '', amount: '' });
    } catch (e2) {
      setError('Failed to save budget.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <Header title="Budgets" />
      {isMock && (
        <div style={{ marginBottom: 12 }}>
          <Banner>Mock mode. Changes persist in-memory for this session.</Banner>
        </div>
      )}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Set Budget</div>
          <form onSubmit={onSubmit}>
            <div style={{ display: 'grid', gap: 10 }}>
              <div>
                <label htmlFor="category" style={{ display: 'block', marginBottom: 6 }}>Category</label>
                <input id="category" className="input" placeholder="e.g., Food"
                       value={form.category}
                       onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div>
                <label htmlFor="amount" style={{ display: 'block', marginBottom: 6 }}>Amount</label>
                <input id="amount" className="input" placeholder="e.g., 500" type="number" min="0" step="0.01"
                       value={form.amount}
                       onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              </div>
              {error && <div style={{ color: 'var(--color-error)' }}>{error}</div>}
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn" disabled={saving} type="submit">{saving ? 'Saving...' : 'Save budget'}</button>
                <button className="btn ghost" type="button" onClick={() => setForm({ category: '', amount: '' })}>Reset</button>
              </div>
            </div>
          </form>
        </div>
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Current Budgets</div>
          <table className="table">
            <thead>
              <tr><th>Category</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {items.map(b => (
                <tr key={b.id || b.category}>
                  <td>{b.category}</td>
                  <td>${Number(b.amount).toFixed(2)}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan="2" style={{ color: 'var(--color-muted)' }}>No budgets set.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
