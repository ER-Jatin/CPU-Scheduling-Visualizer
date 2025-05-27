import { useState, useEffect, useCallback } from 'react';
import '../styles/BootScheduler.css';
import SimulationControl from './SimulationControl';
import ProcessTable from './ProcessTable';
import GanttChart from './GanttChart';
import Statistics from './Statistics';
import AlgorithmSelector from './AlgorithmSelector';

// Sample boot processes with added color field
const initialBootProcesses = [
  { id: 1, name: 'Initialize Kernel', burstTime: 5, priority: 2, color: '#3B82F6' },
  { id: 2, name: 'Mount File Systems', burstTime: 3, priority: 3, color: '#10B981' },
  { id: 3, name: 'Load Device Drivers', burstTime: 4, priority: 1, color: '#F59E0B' },
  { id: 4, name: 'Start Services', burstTime: 2, priority: 4, color: '#EF4444' },
  { id: 5, name: 'Launch Login Manager', burstTime: 3, priority: 5, color: '#8B5CF6' },
];

const algorithms = {
  'fcfs': 'First-Come, First-Served (FCFS)',
  'sjf': 'Shortest Job First (SJF)',
  'rr': 'Round Robin (RR)',
  'srtf': 'Shortest Remaining Time First (SRTF)',
  'priority': 'Priority Scheduling'
};

const BootScheduler = () => {
  const [bootProcesses, setBootProcesses] = useState(initialBootProcesses);
  const [schedule, setSchedule] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [runningProcess, setRunningProcess] = useState(null);
  const [algorithm, setAlgorithm] = useState('fcfs');
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Scheduling algorithms (unchanged)
  const generateFCFSSchedule = useCallback((processes) => {
    let time = 0;
    const timeline = [];
    processes.forEach(proc => {
      const startTime = time;
      const endTime = time + proc.burstTime;
      timeline.push({
        id: proc.id,
        name: proc.name,
        startTime,
        endTime,
        burstTime: proc.burstTime
      });
      time = endTime;
    });
    return timeline;
  }, []);

  const generateSJFSchedule = useCallback((processes) => {
    let time = 0;
    const timeline = [];
    const sorted = [...processes].sort((a, b) => a.burstTime - b.burstTime);
    sorted.forEach(proc => {
      const startTime = time;
      const endTime = time + proc.burstTime;
      timeline.push({
        id: proc.id,
        name: proc.name,
        startTime,
        endTime,
        burstTime: proc.burstTime
      });
      time = endTime;
    });
    return timeline;
  }, []);

  const generateRRSchedule = useCallback((processes, quantum) => {
    let time = 0;
    const timeline = [];
    const queue = [...processes];
    const processMap = {};
    processes.forEach(proc => {
      processMap[proc.id] = { ...proc, remainingTime: proc.burstTime };
    });
    while (queue.length > 0) {
      const proc = queue.shift();
      const procState = processMap[proc.id];
      if (procState.remainingTime <= 0) continue;
      const startTime = time;
      const executionTime = Math.min(quantum, procState.remainingTime);
      const endTime = time + executionTime;
      timeline.push({
        id: proc.id,
        name: proc.name,
        startTime,
        endTime,
        burstTime: executionTime
      });
      procState.remainingTime -= executionTime;
      time = endTime;
      if (procState.remainingTime > 0) {
        queue.push(proc);
      }
    }
    return timeline;
  }, []);

  const generateSRTFSchedule = useCallback((processes) => {
    const timeline = [];
    let time = 0;
    const remaining = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
    let currentProc = null;
    while (remaining.some(p => p.remainingTime > 0)) {
      const readyProcesses = remaining.filter(p => p.remainingTime > 0);
      const nextProc = readyProcesses.reduce(
        (min, p) => p.remainingTime < min.remainingTime ? p : min,
        readyProcesses[0]
      );
      if (!currentProc || currentProc.id !== nextProc.id) {
        if (currentProc) {
          timeline.push({
            id: currentProc.id,
            name: currentProc.name,
            startTime: currentProc.segmentStart,
            endTime: time,
            burstTime: time - currentProc.segmentStart
          });
        }
        nextProc.segmentStart = time;
        currentProc = nextProc;
      }
      time++;
      const proc = remaining.find(p => p.id === nextProc.id);
      proc.remainingTime--;
      if (proc.remainingTime === 0) {
        timeline.push({
          id: currentProc.id,
          name: currentProc.name,
          startTime: currentProc.segmentStart,
          endTime: time,
          burstTime: time - currentProc.segmentStart
        });
        currentProc = null;
      }
    }
    return timeline;
  }, []);

  const generatePrioritySchedule = useCallback((processes) => {
    let time = 0;
    const timeline = [];
    const sorted = [...processes].sort((a, b) => b.priority - a.priority);
    sorted.forEach(proc => {
      const startTime = time;
      const endTime = time + proc.burstTime;
      timeline.push({
        id: proc.id,
        name: proc.name,
        startTime,
        endTime,
        burstTime: proc.burstTime,
        priority: proc.priority
      });
      time = endTime;
    });
    return timeline;
  }, []);

  // Calculate statistics for comparison
  const calculateStatistics = (schedule, processes) => {
    if (schedule.length === 0) return { avgTurnaround: 0, avgWaiting: 0, totalDuration: 0 };
    const processStats = {};
    const originalProcessesMap = {};
    processes.forEach(proc => {
      originalProcessesMap[proc.id] = proc;
    });
    schedule.forEach(slot => {
      if (!processStats[slot.id]) {
        processStats[slot.id] = { firstStart: slot.startTime, lastEnd: slot.endTime };
      } else {
        processStats[slot.id].lastEnd = Math.max(processStats[slot.id].lastEnd, slot.endTime);
        processStats[slot.id].firstStart = Math.min(processStats[slot.id].firstStart, slot.startTime);
      }
    });
    let totalTurnaround = 0;
    let totalWaiting = 0;
    Object.keys(processStats).forEach(id => {
      const stats = processStats[id];
      const proc = originalProcessesMap[id];
      const turnaround = stats.lastEnd;
      const waiting = turnaround - proc.burstTime;
      totalTurnaround += turnaround;
      totalWaiting += waiting;
    });
    const numProcesses = Object.keys(processStats).length;
    const avgTurnaround = numProcesses > 0 ? totalTurnaround / numProcesses : 0;
    const avgWaiting = numProcesses > 0 ? totalWaiting / numProcesses : 0;
    const totalDuration = schedule.length > 0 ? schedule[schedule.length - 1].endTime : 0;
    return { avgTurnaround, avgWaiting, totalDuration };
  };

  // Run comparison of all algorithms
  const runComparison = () => {
    const results = [];
    const algorithmKeys = Object.keys(algorithms);
    algorithmKeys.forEach(alg => {
      let schedule = [];
      const processesClone = JSON.parse(JSON.stringify(bootProcesses));
      switch (alg) {
        case 'fcfs':
          schedule = generateFCFSSchedule(processesClone);
          break;
        case 'sjf':
          schedule = generateSJFSchedule(processesClone);
          break;
        case 'rr':
          schedule = generateRRSchedule(processesClone, timeQuantum);
          break;
        case 'srtf':
          schedule = generateSRTFSchedule(processesClone);
          break;
        case 'priority':
          schedule = generatePrioritySchedule(processesClone);
          break;
        default:
          schedule = generateFCFSSchedule(processesClone);
      }
      const stats = calculateStatistics(schedule, bootProcesses);
      results.push({
        algorithm: alg,
        name: algorithms[alg],
        avgTurnaround: stats.avgTurnaround,
        avgWaiting: stats.avgWaiting,
        totalDuration: stats.totalDuration
      });
    });
    const best = results.reduce((prev, current) =>
      prev.avgTurnaround < current.avgTurnaround ? prev : current
    );
    // Store results in session storage
    sessionStorage.setItem('comparisonResults', JSON.stringify(results));
    sessionStorage.setItem('bestAlgorithm', JSON.stringify(best));
    // Open new page
    window.open('/comparison', '_blank');
  };

  const generateSchedule = useCallback((processes, selectedAlgorithm) => {
    let newSchedule = [];
    const processesClone = JSON.parse(JSON.stringify(processes));
    switch (selectedAlgorithm) {
      case 'fcfs':
        newSchedule = generateFCFSSchedule(processesClone);
        break;
      case 'sjf':
        newSchedule = generateSJFSchedule(processesClone);
        break;
      case 'rr':
        newSchedule = generateRRSchedule(processesClone, timeQuantum);
        break;
      case 'srtf':
        newSchedule = generateSRTFSchedule(processesClone);
        break;
      case 'priority':
        newSchedule = generatePrioritySchedule(processesClone);
        break;
      default:
        newSchedule = generateFCFSSchedule(processesClone);
    }
    setSchedule(newSchedule);
    return newSchedule;
  }, [timeQuantum, generateFCFSSchedule, generateSJFSchedule, generateRRSchedule, generateSRTFSchedule, generatePrioritySchedule]);

  const resetSimulation = useCallback(() => {
    setCurrentTime(0);
    setRunningProcess(null);
    setIsRunning(false);
    setIsComplete(false);
    const resetProcesses = initialBootProcesses.map(proc => ({
      ...proc,
      remainingTime: proc.burstTime,
      startTime: null,
      endTime: null,
      completionTime: null,
      turnaroundTime: null,
      waitingTime: null,
      responseTime: null,
      executed: false
    }));
    setBootProcesses(resetProcesses);
    generateSchedule(resetProcesses, algorithm);
  }, [algorithm, generateSchedule]);

  const toggleSimulation = () => {
    if (isComplete) {
      resetSimulation();
    }
    setIsRunning(!isRunning);
  };

  const changeAlgorithm = (newAlgorithm) => {
    setAlgorithm(newAlgorithm);
    resetSimulation();
  };

  useEffect(() => {
    resetSimulation();
  }, [resetSimulation]);

  useEffect(() => {
    if (!isRunning || schedule.length === 0) return;
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const newTime = prev + 1;
        const current = schedule.find((p) => p.startTime <= newTime && p.endTime > newTime);
        setRunningProcess(current || null);
        if (newTime >= schedule[schedule.length - 1].endTime) {
          clearInterval(interval);
          setIsRunning(false);
          setIsComplete(true);
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, schedule]);

  // const getProcessColor = (procId) => {
  //   const process = bootProcesses.find(p => p.id === procId);
  //   return process ? process.color : '#000000';
  // };
const getProcessColor = (procId) => {
    const colors = [
      'bg-blue-400',
      'bg-green-400',
      'bg-yellow-400',
      'bg-purple-400',
      'bg-red-400',
      'bg-pink-400',
      'bg-indigo-400'
    ];
    
    return colors[(procId - 1) % colors.length];
  };
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

  const getAlgorithmName = (alg) => {
    return algorithms[alg] || alg.toUpperCase();
  };

  return (
    <div className="boot-scheduler">
      <h1 className="title">OS Boot Process - CPU Scheduling Simulation</h1>
      <div className="control-bar">
        <AlgorithmSelector
          algorithm={algorithm}
          timeQuantum={timeQuantum}
          isRunning={isRunning}
          changeAlgorithm={changeAlgorithm}
          setTimeQuantum={setTimeQuantum}
        />
        <button 
  className="compare-button"
  onClick={runComparison}
>
  Compare All Algorithms
</button>
        <SimulationControl 
          isRunning={isRunning}
          isComplete={isComplete}
          toggleSimulation={toggleSimulation}
          currentTime={currentTime}
          algorithm={algorithm}
          getAlgorithmName={getAlgorithmName}
          runningProcess={runningProcess}
          schedule={schedule}
          getProcessBorderColor={getProcessBorderColor}
        />
      </div>
      
      <ProcessTable 
        bootProcesses={bootProcesses}
        schedule={schedule}
        currentTime={currentTime}
        runningProcess={runningProcess}
        algorithm={algorithm}
        getProcessColor={getProcessColor}
      />
      
      <GanttChart 
        schedule={schedule}
        currentTime={currentTime}
        getProcessColor={getProcessColor}
      />
      
      <Statistics
        processes={initialBootProcesses}
        schedule={schedule}
        isComplete={isComplete}
      />
    </div>
  );
};

export default BootScheduler;