import React from 'react';
import { NavLink } from 'react-router-dom';
import '../theme.css';

function Icon({ label }) {
  return (
    <span aria-hidden="true" style={{ width: 18, height: 18, display: 'inline-block' }}>
      {/* Simple shape placeholder that relies on label for variety */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="4" fill="currentColor" opacity="0.15"></rect>
        <path d="M7 12h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Primary">
      <div className="brand">
        <div className="brand-logo" aria-hidden="true" />
        <div className="brand-title">Budget Tracker</div>
        <span className="version-chip">v0.1</span>
      </div>
      <nav className="nav">
        <NavLink to="/" end>
          <Icon label="dashboard" />
          Dashboard
        </NavLink>
        <NavLink to="/budgets">
          <Icon label="budgets" />
          Budgets
        </NavLink>
        <NavLink to="/transactions">
          <Icon label="transactions" />
          Transactions
        </NavLink>
        <NavLink to="/analytics">
          <Icon label="analytics" />
          Analytics
        </NavLink>
        <NavLink to="/suggestions">
          <Icon label="suggestions" />
          Suggestions
        </NavLink>
        <NavLink to="/settings">
          <Icon label="settings" />
          Settings
        </NavLink>
      </nav>
    </aside>
  );
}

export function Header({ title, actions }) {
  return (
    <div className="header">
      <div className="header-title">{title}</div>
      <div className="header-actions">{actions}</div>
    </div>
  );
}

export function Banner({ children }) {
  return <div className="banner">{children}</div>;
}

/**
 * PUBLIC_INTERFACE
 * Layout
 * Shell with sidebar and main content.
 */
export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">{children}</main>
    </div>
  );
}
