import React from 'react';
import '../styles/SimulationControl.css';
const SimulationControl = ({ isRunning, isComplete, toggleSimulation }) => {
  return (
    <div className="flex justify-center mb-6">
      <button
  className={`control-button ${
    isRunning ? 'paused' : isComplete ? 'reset' : 'start'
  } creative-button`}
  onClick={toggleSimulation}
>
  {isRunning ? '⏸ Pause' : isComplete ? '🔄 Reset' : '▶ Start'} Simulation
</button>

    </div>
  );
};

export default SimulationControl;