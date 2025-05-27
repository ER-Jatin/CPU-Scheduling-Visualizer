import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import AlgorithmComparison from './components/AlgorithmComparison';
import BootScheduler from './components/BootScheduler';

function App() {
  const comparisonResults = JSON.parse(sessionStorage.getItem('comparisonResults') || '[]');
  const bestAlgorithm = JSON.parse(sessionStorage.getItem('bestAlgorithm') || 'null');
  return(
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<BootScheduler />} />
        <Route
          path="/comparison"
          element={<AlgorithmComparison comparisonResults={comparisonResults} bestAlgorithm={bestAlgorithm} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;