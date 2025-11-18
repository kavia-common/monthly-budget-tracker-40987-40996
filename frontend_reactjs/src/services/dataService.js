const env = {
  apiBase: process.env.REACT_APP_API_BASE,
  backendUrl: process.env.REACT_APP_BACKEND_URL,
  wsUrl: process.env.REACT_APP_WS_URL,
  nodeEnv: process.env.REACT_APP_NODE_ENV,
  featureFlags: process.env.REACT_APP_FEATURE_FLAGS || '',
  experiments: process.env.REACT_APP_EXPERIMENTS_ENABLED || 'false',
};

const parseFlags = (flagStr) => {
  try {
    if (!flagStr) return {};
    // support JSON or comma-separated key=value
    if (flagStr.trim().startsWith('{')) return JSON.parse(flagStr);
    return flagStr.split(',').reduce((acc, kv) => {
      const [k, v] = kv.split('=');
      if (!k) return acc;
      acc[k.trim()] = (v || 'true').trim();
      return acc;
    }, {});
  } catch {
    return {};
  }
};

const FLAGS = parseFlags(env.featureFlags);

// Mock dataset for offline/demo mode
const MOCK = {
  month: new Date().toISOString().slice(0, 7),
  budgets: [
    { id: 'b1', category: 'Housing', amount: 1200 },
    { id: 'b2', category: 'Food', amount: 500 },
    { id: 'b3', category: 'Transport', amount: 200 },
    { id: 'b4', category: 'Entertainment', amount: 150 },
    { id: 'b5', category: 'Utilities', amount: 250 },
  ],
  transactions: [
    { id: 't1', date: '2025-11-01', category: 'Food', description: 'Groceries', amount: 85.3 },
    { id: 't2', date: '2025-11-03', category: 'Transport', description: 'Gas', amount: 45.9 },
    { id: 't3', date: '2025-11-04', category: 'Housing', description: 'Rent', amount: 1200 },
    { id: 't4', date: '2025-11-05', category: 'Entertainment', description: 'Movies', amount: 28.0 },
    { id: 't5', date: '2025-11-06', category: 'Food', description: 'Lunch', amount: 14.2 },
  ],
};

const isMock = !env.apiBase && !env.backendUrl;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Helper to select base
const baseUrl = env.apiBase || env.backendUrl || '';

/**
 * PUBLIC_INTERFACE
 * getConfig
 * Returns runtime config and whether the service runs on mock data.
 */
export function getConfig() {
  /** Returns runtime configuration and mock flag. */
  return { ...env, flags: FLAGS, isMock, baseUrl };
}

/**
 * PUBLIC_INTERFACE
 * fetchBudgets
 * Fetch budgets for a month. Uses mock when env is not configured.
 */
export async function fetchBudgets(month) {
  if (isMock) {
    await delay(150);
    return structuredClone(MOCK.budgets);
  }
  const url = `${baseUrl}/budgets?month=${encodeURIComponent(month)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error('fetchBudgets error:', e);
    // graceful fallback
    return structuredClone(MOCK.budgets);
  }
}

/**
 * PUBLIC_INTERFACE
 * upsertBudget
 * Create or update a budget item for a category.
 */
export async function upsertBudget({ id, category, amount }) {
  if (isMock) {
    await delay(120);
    const existing = MOCK.budgets.find((b) => b.id === id || b.category === category);
    if (existing) {
      existing.amount = Number(amount);
      return { ...existing };
    }
    const newItem = { id: `b_${Date.now()}`, category, amount: Number(amount) };
    MOCK.budgets.push(newItem);
    return { ...newItem };
  }
  const method = id ? 'PUT' : 'POST';
  const url = `${baseUrl}/budgets${id ? `/${id}` : ''}`;
  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, amount: Number(amount) }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error('upsertBudget error:', e);
    throw e;
  }
}

/**
 * PUBLIC_INTERFACE
 * fetchTransactions
 * Fetch transactions with optional filters.
 */
export async function fetchTransactions({ month, category } = {}) {
  if (isMock) {
    await delay(150);
    let tx = [...MOCK.transactions];
    if (month) tx = tx.filter((t) => t.date.startsWith(month));
    if (category && category !== 'All') tx = tx.filter((t) => t.category === category);
    return tx;
  }
  const params = new URLSearchParams();
  if (month) params.set('month', month);
  if (category) params.set('category', category);
  const url = `${baseUrl}/transactions?${params.toString()}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error('fetchTransactions error:', e);
    // fallback
    return [];
  }
}

/**
 * PUBLIC_INTERFACE
 * addTransaction
 * Add a new transaction record.
 */
export async function addTransaction(tx) {
  const sanitized = {
    date: tx.date || new Date().toISOString().slice(0, 10),
    category: tx.category || 'Misc',
    description: tx.description || '',
    amount: Number(tx.amount || 0),
  };

  if (isMock) {
    await delay(120);
    const item = { id: `t_${Date.now()}`, ...sanitized };
    MOCK.transactions.unshift(item);
    return item;
  }

  try {
    const res = await fetch(`${baseUrl}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitized),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error('addTransaction error:', e);
    throw e;
  }
}

/**
 * PUBLIC_INTERFACE
 * getAnalytics
 * Compute category breakdown and totals (mock-side or via API).
 */
export async function getAnalytics(month) {
  if (isMock) {
    const tx = await fetchTransactions({ month });
    const byCat = tx.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {});
    const total = tx.reduce((s, t) => s + Number(t.amount), 0);
    return { byCategory: byCat, total };
  }
  try {
    const res = await fetch(`${baseUrl}/analytics?month=${encodeURIComponent(month)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error('getAnalytics error:', e);
    return { byCategory: {}, total: 0 };
  }
}

/**
 * PUBLIC_INTERFACE
 * getSuggestions
 * Provide simple heuristics-based suggestions from current budgets and transactions.
 */
export async function getSuggestions(month) {
  const budgets = await fetchBudgets(month);
  const tx = await fetchTransactions({ month });

  const spendByCat = tx.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
    return acc;
  }, {});
  const suggestions = [];

  for (const b of budgets) {
    const spent = spendByCat[b.category] || 0;
    const pct = b.amount > 0 ? (spent / b.amount) * 100 : 0;
    if (pct > 90) {
      suggestions.push({
        type: 'warning',
        text: `You are at ${pct.toFixed(0)}% of your ${b.category} budget.`,
      });
    } else if (pct < 50 && spent > 0) {
      suggestions.push({
        type: 'tip',
        text: `Great job! ${b.category} is under 50% of budget. Consider reallocating unused funds.`,
      });
    }
  }

  // Global tip if eating out/food high relative to others
  const food = spendByCat['Food'] || 0;
  const total = tx.reduce((s, t) => s + Number(t.amount), 0);
  if (total > 0 && food / total > 0.35) {
    suggestions.push({
      type: 'insight',
      text: 'Food spending is over 35% of total. Consider meal planning to reduce costs.',
    });
  }

  return suggestions;
}
