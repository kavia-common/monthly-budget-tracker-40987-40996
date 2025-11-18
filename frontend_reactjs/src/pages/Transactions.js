import React, { useEffect, useMemo, useState } from 'react';
import Layout, { Header, Banner } from '../components/Layout';
import { Modal } from '../components/Common';
import { fetchTransactions, addTransaction, getConfig } from '../services/dataService';

export default function Transactions() {
  const month = new Date().toISOString().slice(0, 7);
  const { isMock } = getConfig();
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('All');
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ date: '', category: '', description: '', amount: '' });

  const categories = useMemo(() => {
    const set = new Set(items.map(t => t.category));
    return ['All', ...Array.from(set)];
  }, [items]);

  const load = async () => {
    const tx = await fetchTransactions({ month, category: category === 'All' ? undefined : category });
    setItems(tx);
  };

  useEffect(() => { load(); }, [month, category]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.category || !form.amount) {
      setError('Category and amount are required.');
      return;
    }
    if (Number.isNaN(Number(form.amount))) {
      setError('Amount must be a number.');
      return;
    }
    setSaving(true);
    try {
      await addTransaction(form);
      setOpen(false);
      setForm({ date: '', category: '', description: '', amount: '' });
      await load();
    } catch (e2) {
      setError('Failed to add transaction.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <Header
        title="Transactions"
        actions={(
          <>
            <select className="select" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button className="btn" onClick={() => setOpen(true)}>Add transaction</button>
          </>
        )}
      />
      {isMock && (
        <div style={{ marginBottom: 12 }}>
          <Banner>Mock mode. Transactions are not persisted to a server.</Banner>
        </div>
      )}
      <div className="card">
        <table className="table">
          <thead>
            <tr><th>Date</th><th>Description</th><th>Category</th><th>Amount</th></tr>
          </thead>
          <tbody>
            {items.map(t => (
              <tr key={t.id}>
                <td>{t.date}</td>
                <td>{t.description}</td>
                <td><span className="badge">{t.category}</span></td>
                <td>${Number(t.amount).toFixed(2)}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan="4" style={{ color: 'var(--color-muted)' }}>No transactions for current filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Add transaction" actions={
        <>
          <button className="btn ghost" onClick={() => setOpen(false)} type="button">Cancel</button>
          <button className="btn" onClick={onSubmit} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </>
      }>
        <form onSubmit={onSubmit}>
          <div style={{ display: 'grid', gap: 10 }}>
            <div>
              <label htmlFor="date" style={{ display: 'block', marginBottom: 6 }}>Date</label>
              <input id="date" type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label htmlFor="tcat" style={{ display: 'block', marginBottom: 6 }}>Category</label>
              <input id="tcat" className="input" placeholder="e.g., Food" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
            <div>
              <label htmlFor="desc" style={{ display: 'block', marginBottom: 6 }}>Description</label>
              <input id="desc" className="input" placeholder="Optional" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label htmlFor="amt" style={{ display: 'block', marginBottom: 6 }}>Amount</label>
              <input id="amt" type="number" step="0.01" className="input" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </div>
            {error && <div style={{ color: 'var(--color-error)' }}>{error}</div>}
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
