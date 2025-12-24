const API_URL = import.meta.env.PROD
  ? "https://job-tracker-api-of5n.onrender.com/api"
  : "http://localhost:3000/api";

export const api = {
  // POST created job
  createJob: async (mpNumber: string) => {
    const response = await fetch(`${API_URL}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mpNumber: mpNumber }),
    });
    return response.json();
  },

  // PATCH completed job
  completeJob: async (jobId: number, coilId: string) => {
    const response = await fetch(`${API_URL}/jobs/${jobId}/complete`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coilId: coilId }),
    });
    return response.json();
  },

  // POST indirect time start
  startIndirect: async (jobId: number) => {
    const response = await fetch(`${API_URL}/jobs/${jobId}/indirect/start`, {
      method: "POST",
    });
    return response.json();
  },

  // POST indirect time stop
  stopIndirect: async (jobId: number) => {
    const response = await fetch(`${API_URL}/jobs/${jobId}/indirect/stop`, {
      method: "POST",
    });
    return response.json();
  },

  // GET currently active job
  getActiveJob: async () => {
    const response = await fetch(`${API_URL}/jobs/active`);
    return response.json();
  },
};
