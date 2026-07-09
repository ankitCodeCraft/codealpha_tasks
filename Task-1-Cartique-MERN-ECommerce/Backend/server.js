const productRoutes = require("./routes/productRoutes");
const testRoutes = require("./routes/testRoutes");
const orderRoutes = require("./routes/orderRoutes");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("E-Commerce API Running...");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
