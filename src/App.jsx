import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-darkBg text-slate-100 selection:bg-cyan-500/30">
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
