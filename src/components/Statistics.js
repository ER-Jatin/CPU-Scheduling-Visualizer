
import React from 'react';
import '../styles/Statistics.css';
const Statistics = ({ processes, schedule, isComplete }) => {
  if (!isComplete) return null;

  // Map to store first and last time for each process
  const statsMap = {};
  schedule.forEach(({ id, startTime, endTime }) => {
    if (!statsMap[id]) {
      statsMap[id] = { startTime, endTime };
    } else {
      statsMap[id].startTime = Math.min(statsMap[id].startTime, startTime);
      statsMap[id].endTime = Math.max(statsMap[id].endTime, endTime);
    }
  });

  let totalTurnaround = 0;
  let totalWaiting = 0;

  const rows = processes.map((proc) => {
    const { burstTime, id, name } = proc;
    const completionTime = statsMap[id]?.endTime ?? 0;
    const turnaroundTime = completionTime; // assuming arrival time is 0
    const waitingTime = turnaroundTime - burstTime;

    totalTurnaround += turnaroundTime;
    totalWaiting += waitingTime;

    return (
      <tr  key={id} className="border-t">
        <td style={{ border: "2px solid black" }} className="p-2">{name}</td>
        <td style={{ border: "2px solid black" }} className="p-2 text-center">{burstTime}</td>
        <td style={{ border: "2px solid black" }} className="p-2 text-center">{completionTime}</td>
        <td style={{ border: "2px solid black" }} className="p-2 text-center">{turnaroundTime}</td>
        <td style={{ border: "2px solid black" }} className="p-2 text-center">{waitingTime}</td>
      </tr>
    );
  });

  const avgTurnaround = (totalTurnaround / processes.length).toFixed(2);
  const avgWaiting = (totalWaiting / processes.length).toFixed(2);

  return (
    <div className="mt-6 p-4 border  bg-black shadow">
      <h2 className="text-xl font-bold mb-4">Statistics</h2>
      <table style={{ border: "2px solid black", borderCollapse: "collapse" }} className="w-full border border-black text-sm">
        <thead>
          <tr className="bg-gray-100">
             <th style={{ border: "2px solid black" }} className="p-2 text-left border border-black">Process</th>
      <th style={{ border: "2px solid black" }} className="p-2 text-center border border-black">Burst Time</th>
      <th style={{ border: "2px solid black" }} className="p-2 text-center border border-black">Completion Time</th>
      <th style={{ border: "2px solid black" }} className="p-2 text-center border border-black">Turnaround Time</th>
      <th style={{ border: "2px solid black" }} className="p-2 text-center border border-black">Waiting Time</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
        <tfoot>
          <tr className="font-semibold border-t">
      <td className="p-2 border border-black">Average</td>
      <td className="p-2 border border-black"></td>
      <td className="p-2 border border-black"></td>
      <td className="p-2 text-center border border-black">{avgTurnaround}</td>
      <td className="p-2 text-center border border-black">{avgWaiting}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Statistics;
