import express from "express";
import pool from "./db";
import {
  createJob,
  completeJob,
  startIndirect,
  stopIndirect,
  getActiveJob,
} from "./routes";

// Test DB Connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Database connected:", res.rows[0]);
  }
});

// Initialize express engine
const app: express.Application = express();

app.use(express.json());

// Use port 3000
const port: number = 3000;

// Routes

app.post("/api/jobs", createJob);

app.patch("/api/jobs/:id/complete", completeJob);

app.post("/api/jobs/:id/indirect/start", startIndirect);

app.post("/api/jobs/:id/indirect/stop", stopIndirect);

app.get("/api/jobs/active", getActiveJob);

// Listen call
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
