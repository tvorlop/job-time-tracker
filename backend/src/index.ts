import express from "express";
import pool from "./db";
import { createJob, completeJob } from "./routes";

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
app.get("/", (req, res) => {
  res.json({ message: "Job Tracker API is Running" });
});

app.post("/api/jobs", createJob);

app.patch("/api/jobs/:id/complete", completeJob);

// Listen call
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
