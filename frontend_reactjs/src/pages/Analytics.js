import React, { useEffect, useState } from 'react';
import Layout, { Header } from '../components/Layout';
import { getAnalytics } from '../services/dataService';

export default function Analytics() {
  const month = new Date().toISOString().slice(0, 7);
  const [data, setData] = useState({ byCategory: {}, total: 0 });

  useEffect(() => {
    (async () => setData(await getAnalytics(month)))();
  }, [month]);

  const entries = Object.entries(data.byCategory).sort((a, b) => b[1] - a[1]);

  return (
    <Layout>
      <Header title="Analytics" />
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Category Breakdown</div>
          <table className="table">
            <thead><tr><th>Category</th><th>Amount</th><th>% of Total</th></tr></thead>
            <tbody>
              {entries.map(([cat, amt]) => (
                <tr key={cat}>
                  <td>{cat}</td>
                  <td>${Number(amt).toFixed(2)}</td>
                  <td>{data.total > 0 ? `${((amt / data.total) * 100).toFixed(1)}%` : '-'}</td>
                </tr>
              ))}
              {entries.length === 0 && <tr><td colSpan="3" style={{ color: 'var(--color-muted)' }}>No data available.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Trend</div>
          <div className="placeholder-chart">Chart placeholder</div>
        </div>
      </div>
    </Layout>
  );
}
