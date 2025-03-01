/**
 * Application Entry Point
 * 
 * This is the main entry file for the Recipe Finder application.
 * It renders the root App component into the DOM.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import './index.css';
import App from './App';

/**
 * Create a React root and render the application
 * 
 * This uses the new React 18 createRoot API for concurrent rendering features
 */
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Render the App component wrapped in StrictMode for additional development checks
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 