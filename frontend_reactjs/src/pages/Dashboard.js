import React, { useEffect, useMemo, useState } from 'react';
import Layout, { Header, Banner } from '../components/Layout';
import { fetchBudgets, fetchTransactions, getAnalytics, getConfig } from '../services/dataService';

export default function Dashboard() {
  const month = new Date().toISOString().slice(0, 7);
  const { isMock } = getConfig();
  const [budgets, setBudgets] = useState([]);
  const [analytics, setAnalytics] = useState({ byCategory: {}, total: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    (async () => {
      setBudgets(await fetchBudgets(month));
      setAnalytics(await getAnalytics(month));
      const tx = await fetchTransactions({ month });
      setRecent(tx.slice(0, 6));
    })();
  }, [month]);

  const spent = useMemo(() => {
    const txSum = recent.reduce((s, t) => s + Number(t.amount), 0);
    return txSum;
  }, [recent]);

  const budgetTotal = budgets.reduce((s, b) => s + Number(b.amount), 0);
  const remaining = Math.max(0, budgetTotal - analytics.total);

  return (
    <Layout>
      <Header title="Dashboard" actions={<span className="pill"></span>} />
      {isMock && (
        <div style={{ marginBottom: 12 }}>
          <Banner>Running with mock data. Set REACT_APP_API_BASE or REACT_APP_BACKEND_URL to connect to an API.</Banner>
        </div>
      )}

      <div className="grid grid-3" style={{ marginBottom: 16 }}>
        <div className="card kpi">
          <div className="label">This Month Spend</div>
          <div className="value">${analytics.total.toFixed(2)}</div>
          <div className="delta">Month: {month}</div>
        </div>
        <div className="card kpi">
          <div className="label">Budgets Total</div>
          <div className="value">${budgetTotal.toFixed(2)}</div>
          <div className="delta">Across {budgets.length} categories</div>
        </div>
        <div className="card kpi">
          <div className="label">Remaining</div>
          <div className="value">${remaining.toFixed(2)}</div>
          <div className="delta">{remaining > 0 ? 'On track' : 'Exceeded!'}</div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Spending Overview</div>
          <div className="placeholder-chart">Chart placeholder</div>
        </div>
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Recent Transactions</div>
          <table className="table">
            <thead>
              <tr><th>Date</th><th>Description</th><th>Category</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {recent.map(t => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>{t.description}</td>
                  <td><span className="badge">{t.category}</span></td>
                  <td>${Number(t.amount).toFixed(2)}</td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr><td colSpan="4" style={{ color: 'var(--color-muted)' }}>No transactions yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
