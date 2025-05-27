import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Trophy } from 'lucide-react';
import '../styles/AlgorithmComparison.css';



const AlgorithmComparison = ({ comparisonResults, bestAlgorithm }) => {
  const chartData = comparisonResults.map(result => ({
    name: result.algorithm.toUpperCase(),
    'Avg Turnaround': result.avgTurnaround,
    'Avg Waiting': result.avgWaiting,
    'Total Duration': result.totalDuration
  }));

  return (
    <div className="container">
      <div className="header">
        <h1>Scheduling Algorithm Comparison</h1>
        <p>Performance metrics for OS boot process scheduling algorithms</p>
      </div>

      {/* Best Algorithm Banner */}
      {bestAlgorithm && (
        <div className="best-algorithm-banner">
          <div className="best-algorithm-content">
            <Trophy />
            <div className="best-algorithm-text">
              <h3>{bestAlgorithm.name}</h3>
              <p>🏆 Best Algorithm for OS Boot Process</p>
              <div className="best-algorithm-metrics">
                <div>
                  <div className="metric-value">{bestAlgorithm.avgTurnaround.toFixed(2)}s</div>
                  <div className="metric-label">Avg Turnaround</div>
                </div>
                <div>
                  <div className="metric-value">{bestAlgorithm.avgWaiting.toFixed(2)}s</div>
                  <div className="metric-label">Avg Waiting</div>
                </div>
                <div>
                  <div className="metric-value">{bestAlgorithm.totalDuration}s</div>
                  <div className="metric-label">Total Duration</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Chart */}
      <div className="chart-container">
        <h3 className="chart-title">
          <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          Performance Comparison
        </h3>
        <div className="chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Avg Turnaround" fill="#3B82F6" />
              <Bar dataKey="Avg Waiting" fill="#10B981" />
              <Bar dataKey="Total Duration" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Results Table */}
      <div className="table-container">
        <div className="table-header">
          <h3>
            <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 001.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Detailed Performance Metrics
          </h3>
        </div>
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Algorithm</th>
                <th>Avg Turnaround (s)</th>
                <th>Avg Waiting (s)</th>
                <th>Total Duration (s)</th>
                <th>Ranking</th>
              </tr>
            </thead>
            <tbody>
              {comparisonResults
                .sort((a, b) => a.avgTurnaround - b.avgTurnaround)
                .map((result, index) => (
                  <tr
                    key={result.algorithm}
                    className={result.algorithm === bestAlgorithm?.algorithm ? 'best' : ''}
                  >
                    <td className="algorithm-cell">
                      <span className={`algorithm-name ${result.algorithm === bestAlgorithm?.algorithm ? 'best' : ''}`}>
                        {result.name}
                      </span>
                      {result.algorithm === bestAlgorithm?.algorithm && (
                        <Trophy className="trophy" />
                      )}
                    </td>
                    <td className="metric">{result.avgTurnaround.toFixed(2)}</td>
                    <td>{result.avgWaiting.toFixed(2)}</td>
                    <td>{result.totalDuration}</td>
                    <td>
                      <span className={`ranking ${index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : 'rank-other'}`}>
                        #{index + 1}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmComparison;