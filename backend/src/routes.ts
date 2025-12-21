import { Request, Response } from "express";
import pool from "./db";

export const createJob = async (req: Request, res: Response) => {
  try {
    const mpNumber = req.body.mpNumber;
    const startTime = new Date();

    // SQL query
    const query =
      "INSERT INTO jobs (mp_number, start_time) VALUES ($1, $2) RETURNING *";

    // Execute the query
    const result = await pool.query(query, [mpNumber, startTime]);

    // Send back the created job
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ error: "Failed to create job" });
  }
};

export const completeJob = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;
    const coilId = req.body.coilId;
    const stopTime = new Date();

    const query = `
    UPDATE jobs
    SET coil_id = $1,
        stop_time = $2,
        total_time_hours = ROUND((EXTRACT(EPOCH FROM ($2 - start_time)) / 3600 - indirect_time_hours)::numeric, 1)
    WHERE id = $3
    RETURNING *
      `;

    const result = await pool.query(query, [coilId, stopTime, jobId]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error completing job:", error);
    res.status(500).json({ error: "Failed to complete job" });
  }
};

export const startIndirect = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;
    const startTime = new Date();

    const query =
      "INSERT INTO indirect_periods (job_id, start_time) VALUES ($1, $2) RETURNING *";

    const result = await pool.query(query, [jobId, startTime]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error starting indirect timer:", error);
    res.status(500).json({ error: "Failed to start indirect timer" });
  }
};

export const stopIndirect = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;
    const stopIndirect = new Date();

    const indirectQuery = `
    UPDATE indirect_periods
    SET stop_time = $1,
        duration_hours = ROUND((EXTRACT(EPOCH FROM ($1 - start_time)) / 3600)::numeric, 1)
    WHERE job_id = $2 AND stop_time IS NULL
    RETURNING *
      `;

    const indirectResult = await pool.query(indirectQuery, [
      stopIndirect,
      jobId,
    ]);

    const duration = indirectResult.rows[0].duration_hours;
    const jobQuery = `
    UPDATE jobs
    SET indirect_time_hours = indirect_time_hours + $1
    WHERE id = $2
      `;
    await pool.query(jobQuery, [duration, jobId]);

    res.json(indirectResult.rows[0]);
  } catch (error) {
    console.error("Error stopping indirect timer:", error);
    res.status(500).json({ error: "Failed to stop indirect timer" });
  }
};

export const getActiveJob = async (req: Request, res: Response) => {
  try {
    const query = "SELECT * FROM jobs WHERE stop_time IS NULL";

    const result = await pool.query(query);

    res.json(result.rows[0] || null);
  } catch (error) {
    console.error("Error getting active job:", error);
    res.status(500).json({ error: "Failed to get active job" });
  }
};
