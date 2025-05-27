import React from 'react';


export default function ProcessTable({ bootProcesses, schedule, currentTime, runningProcess, algorithm, getProcessColor }) {
  return (
    <div  className="process-table-container">
      <h2 className="table-title">Process Information</h2>
      <div className="table-wrapper"  style={{ display: "flex", justifyContent: "center" }}>
        <table className="process-table" style={{ border: "2px solid black", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "2px solid black" }}>Process</th>
              <th style={{ border: "2px solid black" }}>Burst Time</th>
              {algorithm === 'priority' && <th style={{ border: "2px solid black" }}> Priority</th>}
              <th style={{ border: "2px solid black" }}>Progress</th>
              <th style={{ border: "2px solid black" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {bootProcesses.map((proc) => {
              // Calculate progress for this process
              const processSlots = schedule.filter(s => s.id === proc.id);
              const completedTime = processSlots
                .filter(s => s.endTime <= currentTime)
                .reduce((total, s) => total + (s.endTime - s.startTime), 0);
                
              const inProgressTime = processSlots
                .filter(s => s.startTime <= currentTime && s.endTime > currentTime)
                .reduce((total, s) => total + (currentTime - s.startTime), 0);
                
              const totalCompletedTime = completedTime + inProgressTime;
              let progressPercent = (totalCompletedTime / proc.burstTime) * 100;
              progressPercent = Math.min(100, progressPercent); // Cap at 100%
              
              // Determine process status
              let status = 'Waiting';
              let statusClass = 'status-waiting';
              
              if (runningProcess && runningProcess.id === proc.id) {
                status = 'Running';
                statusClass = 'status-running';
              } else if (currentTime > 0) {
                if (progressPercent >= 100) {
                  status = 'Completed';
                  statusClass = 'status-completed';
                } else if (progressPercent > 0) {
                  status = `Partially Completed`;
                  statusClass = 'status-partial';
                } else {
                  const nextSlot = schedule.find(s => s.id === proc.id && s.startTime > currentTime);
                  if (nextSlot) {
                    status = `Waiting (at ${nextSlot.startTime}s)`;
                  }
                }
              }
              
              return (
                <tr  key={proc.id} className={runningProcess && runningProcess.id === proc.id ? 'row-active' : ''}>
                  <td style={{ border: "2px solid black" }} className="process-name">
                    <div className="process-indicator">
                      <div className={`color-dot ${getProcessColor(proc.id)}`}></div>
                      {proc.name}
                    </div>
                  </td>
                  <td style={{ border: "2px solid black" }} className="burst-time">{proc.burstTime}s</td>
                  {algorithm === 'priority' && <td style={{ border: "2px solid black" }} className="priority">{proc.priority}</td>}
                  <td style={{ border: "2px solid black" }} className="progress-cell">
                    <div className="progress-bar-bg">
                      <div 
                        className={`progress-bar-fill ${getProcessColor(proc.id)}`} 
                        style={{ width: `${progressPercent}%` }}
                      >
                        {progressPercent > 20 && `${Math.round(progressPercent)}%`}
                      </div>
                    </div>
                  </td>
                  <td style={{ border: "2px solid black" }} className={`process-status ${statusClass}`}>
                    {status}
                    {runningProcess && runningProcess.id === proc.id && (
                      <span className="status-icon">⚙️</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}