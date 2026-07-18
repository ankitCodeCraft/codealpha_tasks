const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");

const errorHandler = require("./middleware/errorMiddleware");

// Load environment variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

// ==============================
// Security Middleware
// ==============================

app.use(helmet({ crossOriginResourcePolicy: false }));

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// ==============================
// Logging
// ==============================

app.use(morgan("dev"));

// ==============================
// Rate Limiter
// ==============================

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 5000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use(limiter);

// ==============================
// Body Parsers
// ==============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ==============================
// Static Files
// ==============================

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==============================
// Health Check
// ==============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to EcoHub API 🚀",
  });
});

// ==============================
// API Routes
// ==============================

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/posts/:id/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

// ==============================
// 404 Handler
// ==============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// ==============================
// Global Error Handler
// ==============================

app.use(errorHandler);

// ==============================
// Start Server
// ==============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
