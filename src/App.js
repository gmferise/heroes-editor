import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import useRedirectQuery from './hooks/useRedirectQuery';

import './App.css';

import HomePage from './views/HomePage';

function App() {
  useRedirectQuery();
  useEffect(() => {
    document.title = 'Heroes Editor';
  }, []);
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;