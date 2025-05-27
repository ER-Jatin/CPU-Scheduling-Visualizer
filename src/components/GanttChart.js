import React from 'react';
import '../styles/GanttChart.css';

const GanttChart = ({ 
  schedule, 
  currentTime, 
  isRunning, 
  getProcessColor 
}) => {
  // Get max end time for scaling
  const maxEndTime = schedule.length > 0 ? schedule[schedule.length - 1]?.endTime || 1 : 1;
  
  return (
    <div className="gantt-chart-container">
      <h2 className="gantt-chart-title">Gantt Chart</h2>
      <div className="gantt-chart">
        {/* Time Marker */}
        <div 
          className="time-marker"
          style={{
            left: `${(currentTime / maxEndTime) * 100}%`,
            transition: 'left 1s linear'
          }}
        >
          <div className="time-marker-dot"></div>
          <div className="time-marker-label">{currentTime}s</div>
        </div>

        {/* Completed Slots */}
        {schedule
          .filter(slot => slot.startTime < currentTime)
          .map((slot, index) => {
            const endPoint = Math.min(slot.endTime, currentTime);
            return (
              <div
                key={`completed-${slot.id}-${index}`}
                className={`gantt-slot completed ${getProcessColor(slot.id)}`}
                style={{
                  left: `${(slot.startTime / maxEndTime) * 100}%`,
                  width: `${((endPoint - slot.startTime) / maxEndTime) * 100}%`,
                }}
              >
                <div className="gantt-slot-label">
                  {endPoint - slot.startTime >= 1 && `P${slot.id}`}
                </div>
              </div>
            );
          })
        }

        {/* Current and Future Slots (Next 3) */}
        {schedule
          .filter(slot => slot.endTime > currentTime)
          .slice(0, 4) // Show only the current and next 3 future slots
          .map((slot, index) => {
            const startPoint = Math.max(slot.startTime, currentTime);
            const isActive = slot.startTime <= currentTime && slot.endTime > currentTime;
            
            return (
              <div
                key={`future-${slot.id}-${index}`}
                className={`gantt-slot future ${getProcessColor(slot.id)} ${isActive ? 'active' : ''}`}
                style={{
                  left: `${(startPoint / maxEndTime) * 100}%`,
                  width: `${((slot.endTime - startPoint) / maxEndTime) * 100}%`,
                }}
              >
                <div className={`gantt-slot-label ${isActive ? 'animate-pulse' : ''}`}>
                  {slot.endTime - startPoint >= 1 && 
                    `${isActive ? '→ ' : ''}P${slot.id}${isActive ? ' ←' : ''}`}
                </div>
              </div>
            );
          })
        }
        
        {/* Time labels */}
        <div className="gantt-time-labels">
          <span>{Math.max(0, currentTime - 2)}s</span>
          <span>{Math.min(currentTime + 8, maxEndTime)}s</span>
        </div>
      </div>
      
      {/* Timeline Progress */}
      <div className="gantt-timeline">
        <div 
          className="gantt-progress"
          style={{
            width: `${(currentTime / maxEndTime) * 100}%`,
            transition: 'width 1s linear'
          }}
        ></div>
      </div>
      <div className="gantt-duration-labels">
        <span>0s</span>
        <span>Total Duration: {maxEndTime}s</span>
      </div>
    </div>
  );
};

export default GanttChart;