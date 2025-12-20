CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  mp_number VARCHAR(12) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  stop_time TIMESTAMP,
  coil_id VARCHAR(9),
  indirect_time_hours DECIMAL(10,2) DEFAULT 0,
  total_time_hours DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE indirect_periods (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  stop_time TIMESTAMP,
  duration_hours DECIMAL(10,2)
);
