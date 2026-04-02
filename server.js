const http = require("node:http");
const express = require("express");
const path = require("node:path");

const app = express();
const PORT = 3000;

// Middleware for JSON
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// In-memory scene state
let boxState = {
  width: 2,
  height: 2,
  depth: 2,
  x: 0,
  y: 1,
  z: 0,
  color: {
    r: 0.2,
    g: 0.6,
    b: 1.0
  }
};

// API route to get current scene data
app.get("/api/scene-data", (req, res) => {
  res.json(boxState);
});

// API route to update the box position
app.post("/api/move-box", (req, res) => {
  const { x, y, z } = req.body;

  if (
    typeof x !== "number" ||
    typeof y !== "number" ||
    typeof z !== "number"
  ) {
    return res.status(400).json({
      error: "x, y, and z must be numbers"
    });
  }

  boxState.x = x;
  boxState.y = y;
  boxState.z = z;

  res.json({
    message: "Box position updated",
    boxState
  });
});

// API route to update box color
app.post("/api/change-color", (req, res) => {
  const { r, g, b } = req.body;

  if (
    typeof r !== "number" ||
    typeof g !== "number" ||
    typeof b !== "number"
  ) {
    return res.status(400).json({
      error: "r, g, and b must be numbers"
    });
  }

  boxState.color = { r, g, b };

  res.json({
    message: "Box color updated",
    boxState
  });
});

// Create HTTP server from Express app
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});