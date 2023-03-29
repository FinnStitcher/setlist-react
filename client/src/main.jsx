import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ErrorBoundary from './ErrorBoundary';
import FatalError from './pages/error_pages/FatalError';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary fallback={<FatalError />}>
        <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
