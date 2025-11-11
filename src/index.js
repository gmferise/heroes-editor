import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'normalize.css';
import App from './App';

const root = createRoot(document.getElementById('root'));

root.render((
  <React.StrictMode>
    <BrowserRouter basename='/heroes-editor'>
      <App />
    </BrowserRouter>
  </React.StrictMode>
));