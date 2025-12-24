import { useState, useEffect } from "react";
import { api } from "./api";
import "./App.css";

// Job types
interface Job {
  id: number;
  mp_number: string;
  start_time: string;
  stop_time: string | null;
  coil_id: string | null;
  indirect_time_hours: number;
  total_time_hours: number | null;
}

function App() {
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isIndirect, setIsIndirect] = useState(false);
  const isMpMode = !activeJob;

  const handleInput = async (value: string) => {
    if (isMpMode) {
      if (value.length === 12 && value.startsWith("MP")) {
        const job = await api.createJob(value);
        setActiveJob(job);
        setInputValue("");
      }
    } else {
      if (value.length === 9 && value.startsWith("781")) {
        await api.completeJob(activeJob!.id, value);
        const completedJob = await api.completeJob(activeJob!.id, value);
        setActiveJob(completedJob);
        setInputValue("");
      }
    }
  };

  const handleIndirect = async () => {
    if (activeJob) {
      if (!isIndirect) {
        await api.startIndirect(activeJob.id);
        setIsIndirect(true);
      } else {
        await api.stopIndirect(activeJob.id);
        setIsIndirect(false);
        const updatedJob = await api.getActiveJob();
        setActiveJob(updatedJob);
      }
    }
  };

  // Fetch active job on load
  useEffect(() => {
    const loadJob = async () => {
      const job = await api.getActiveJob();
      setActiveJob(job);
    };
    loadJob();
  }, []);

  return (
    <div>
      <h1>Job Time Tracker</h1>
      <div className="job-container">
        <label>{isMpMode ? "Scan MP Number" : "Scan Coil ID"}</label>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            handleInput(e.target.value);
          }}
          placeholder={isMpMode ? "e.g. MP78010xxxx" : "e.g. 7810xxxxx"}
        />

        {activeJob ? (
          <div className="output">
            <p>Current Job: {activeJob.mp_number}</p>
            <p>
              Started: {new Date(activeJob.start_time).toLocaleTimeString()}
            </p>
            <p>Indirect Time: {activeJob.indirect_time_hours} hours</p>
            {activeJob.total_time_hours && (
              <p>Total Time: {activeJob.total_time_hours} hours</p>
            )}
          </div>
        ) : (
          <p>No active job</p>
        )}
        {activeJob && (
          <button
            className={isIndirect ? "stop-btn" : ""}
            onClick={handleIndirect}
          >
            {isIndirect ? "Stop Indirect Time" : "Start Indirect Time"}
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
