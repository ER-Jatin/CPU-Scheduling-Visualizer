import React from 'react';
import '../styles/AlgorithmSelector.css';

const AlgorithmSelector = ({ algorithm, timeQuantum, changeAlgorithm, setTimeQuantum, isRunning }) => {
  return (
    <div className="algorithm-selector-container">
      <div className="algorithm-dropdown">
        <label className="selector-label">Scheduling Algorithm:</label>
        <select 
          className="algorithm-select"
          value={algorithm}
          onChange={(e) => changeAlgorithm(e.target.value)}
          disabled={isRunning}
        >
          <option value="fcfs">First-Come, First-Served (FCFS)</option>
          <option value="sjf">Shortest Job First (SJF)</option>
          <option value="rr">Round Robin (RR)</option>
          <option value="srtf">Shortest Remaining Time First (SRTF)</option>
          <option value="priority">Priority Scheduling</option>
        </select>
      </div>
      
      {algorithm === 'rr' && (
        <div className="time-quantum-input">
          <label className="selector-label">Time Quantum:</label>
          <input 
            type="number" 
            min="1" 
            max="10" 
            className="quantum-input"
            value={timeQuantum}
            onChange={(e) => setTimeQuantum(parseInt(e.target.value))}
            disabled={isRunning}
          />
        </div>
      )}
    </div>
  );
};

export default AlgorithmSelector;