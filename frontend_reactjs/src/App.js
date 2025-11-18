import React, { useEffect, useState } from 'react';
import './App.css';
import './theme.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Budgets from './pages/Budgets';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Suggestions from './pages/Suggestions';
import Settings from './pages/Settings';

// PUBLIC_INTERFACE
function App() {
  /**
   * Root application component bootstrapping theme and routes.
   */
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/suggestions" element={<Suggestions />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
