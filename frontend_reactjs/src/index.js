import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// set default theme attribute early
if (!document.documentElement.getAttribute('data-theme')) {
  document.documentElement.setAttribute('data-theme', 'light');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
