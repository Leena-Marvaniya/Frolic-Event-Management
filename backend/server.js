const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load env variables
dotenv.config();

// Create app
const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(cors());

// ================= ROUTES =================
const authRoutes = require("./routes/authRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const eventRoutes = require("./routes/eventRoutes");
const winnerRoutes = require("./routes/eventWiseWinnerRoutes");
const groupRoutes = require("./routes/groupRoutes");
const instituteRoutes = require("./routes/instituteRoutes");
const participantRoutes = require("./routes/participantRoutes");
const reportRoutes = require("./routes/reportRoutes");
const userRoutes = require("./routes/userRoutes");

// Base route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api", eventRoutes);
app.use("/api", winnerRoutes);
app.use("/api", groupRoutes);
app.use("/api/institutes", instituteRoutes);
app.use("/api", participantRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        success: false,
        message: err.message || "Server Error",
        data: null
    });
});

// ================= DB CONNECTION =================
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");

    // Start server only after DB connects
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
})
.catch((err) => {
    console.error("DB connection error:", err);
});