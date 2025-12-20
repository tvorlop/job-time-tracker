import express from "express";
import pool from "./db";

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

// Use port 3000
const port: number = 3000;

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Job Tracker API is Running" });
});

// Listen call
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
