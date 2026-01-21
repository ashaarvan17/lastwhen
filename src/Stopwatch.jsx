import React, {useState , useEffect , useRef} from 'react';

function StopWatch(){

const [isRunning, setIsRunning] = useState(false);

const [masterElapsed, setMasterElapsed] = useState(0);
const [segmentElapsed, setSegmentElapsed] = useState(0);

const [logs, setLogs] = useState([]);

const intervalRef = useRef(null);
const masterStartRef = useRef(0);
const segmentStartRef = useRef(0);

useEffect(() => {
  if (!isRunning) return;

  intervalRef.current = setInterval(() => {
    const now = Date.now();
    setMasterElapsed(now - masterStartRef.current);
    setSegmentElapsed(now - segmentStartRef.current);
  }, 10);

  return () => clearInterval(intervalRef.current);
}, [isRunning]);

function start() {
  const now = Date.now();

  masterStartRef.current = now - masterElapsed;
  segmentStartRef.current = now - segmentElapsed;

  setIsRunning(true);
}

function stop() {
    setIsRunning(false);
}

function resetSegment() {

  if(isRunning){
  setLogs(prev => [
    ...prev,
    {
      id: prev.length + 1,
      segmentDuration: segmentElapsed,
      masterTimestamp: masterElapsed,
    }
  ]);

  setSegmentElapsed(0);
  segmentStartRef.current = Date.now();}
  else {
    setIsRunning(false);
    setMasterElapsed(0)
    setSegmentElapsed(0)
  }
}

function formatTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const millis = Math.floor((ms % 1000) / 10);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(millis).padStart(2, "0")}`;
}

return ( 
    <div>
        <div className='stopWatch'>
            <div className="display">
            <div className='masterTimer'> {formatTime(masterElapsed)}</div>
            <div className='segment'> {formatTime(segmentElapsed)}</div>
            </div>
            <div className='controls'>
                <button onClick={start}>Start</button>
                <button onClick={stop}>Stop</button>
                <button onClick={resetSegment}>Reset</button>
            </div>
        </div> 
              
        <div className="resetLogList">
            <h3>Reset Logs</h3>
             {logs.map(log => (
    <div key={log.id} className="resetItem">
      <strong>{log.id}</strong> 
      Segment: {formatTime(log.segmentDuration)} 
      At: {formatTime(log.masterTimestamp)}
    </div>
  ))}
</div>
</div>
)
}

export default StopWatch;