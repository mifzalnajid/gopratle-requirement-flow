const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const requirementRoutes = require("./routes/requirementRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
    }),
);
app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_req, res) => {
    const connected = mongoose.connection.readyState === 1;

    res.status(connected ? 200 : 503).json({
        status: connected ? "ok" : "unavailable",
        database: connected ? "connected" : "disconnected",
    });
});

app.use("/api/requirements", requirementRoutes);
app.use(errorHandler);

module.exports = app;