import React from 'react';
import '../styles/StatusDisplay.css';

const CurrentStatus = ({ currentTime, algorithm, runningProcess, schedule }) => {
  // Format algorithm name for display
  const getAlgorithmName = (alg) => {
    switch (alg) {
      case 'fcfs': return 'First-Come, First-Served (FCFS)';
      case 'sjf': return 'Shortest Job First (SJF)';
      case 'rr': return 'Round Robin (RR)';
      case 'srtf': return 'Shortest Remaining Time First (SRTF)';
      case 'priority': return 'Priority Scheduling';
      default: return alg.toUpperCase();
    }
  };
  
  // Get border color matching the process fill color
  const getProcessBorderColor = (procId) => {
    const colors = [
      'border-blue-400',
      'border-green-400',
      'border-yellow-400',
      'border-purple-400',
      'border-red-400',
      'border-pink-400',
      'border-indigo-400'
    ];
    
    return colors[(procId - 1) % colors.length];
  };

  return (
    <div className="current-status-container">
      <div className="current-time-display">
        <p className="time-counter">Current Time: {currentTime}s</p>
        <p className="algorithm-name">Algorithm: {getAlgorithmName(algorithm)}</p>
        {runningProcess ? (
          <div className="running-process">
            <div className="process-status">
              <p className="running-process-name">
                <span className="gear-icon">⚙</span> Running: {runningProcess.name}
              </p>
              <p className="process-details">
                Process {runningProcess.id} ({runningProcess.endTime - Math.max(currentTime, runningProcess.startTime)}s remaining)
              </p>
            </div>
          </div>
        ) : (
          <p className="idle-status">System Idle</p>
        )}
      </div>
      
      {/* Next Process Preview */}
      <div className="next-process-container">
        <p className="next-process-label">Coming Up Next:</p>
        <div className="next-processes">
          {schedule
            .filter(slot => slot.startTime > currentTime)
            .slice(0, 3)
            .map((slot, index) => (
              <div 
                key={`next-${slot.id}-${index}`} 
                className={`next-process ${getProcessBorderColor(slot.id)}`}
              >
                <p className="next-process-name">{slot.name}</p>
                <p className="next-process-time">at {slot.startTime}s</p>
              </div>
            ))}
          {schedule.filter(slot => slot.startTime > currentTime).length === 0 && (
            <p className="no-processes">No more processes</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentStatus;