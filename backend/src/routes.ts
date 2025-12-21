import { Request, Response } from "express";
import pool from "./db";

export const createJob = async (req: Request, res: Response) => {
  const mpNumber = req.body.mpNumber;
  const startTime = new Date();

  // SQL query
  const query =
    "INSERT INTO jobs (mp_number, start_time) VALUES ($1, $2) RETURNING *";

  // Execute the query
  const result = await pool.query(query, [mpNumber, startTime]);

  // Send back the created job
  res.json(result.rows[0]);
};

export const completeJob = async (req: Request, res: Response) => {
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
};
