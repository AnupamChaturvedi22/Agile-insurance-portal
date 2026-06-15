const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config({ path: ".env" });

const appConfig = require("./Config/app.config");
const connectDB = require("./db/connect");
const errorHandler = require("./Middlewares/error.middleware");
const AppError = require("./Utils/appError");

// Routes
const authRoutes = require("./Routes/auth.route");
const adminRoutes = require("./Routes/admin.route");
const userRoutes = require("./Routes/user.route");
const kycRoutes = require("./Routes/kyc.route");
const supportRoutes = require("./Routes/support.route");
const userProfileRoutes = require("./Routes/userProfile.route");

const PORT = appConfig.port;

// Connect Database
connectDB();

// Middleware
app.use(
  cors({
    origin: appConfig.clientUrl,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request Logger Middleware
// app.use((req, res, next) => {
//   console.log("\n========== REQUEST ==========");
//   console.log("Method:", req.method);
//   console.log("URL:", req.originalUrl);
//   console.log("Body:", req.body);
//   console.log("Params:", req.params);
//   console.log("Query:", req.query);
//   console.log("=============================\n");

//   next();
// });

// Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/profile", userProfileRoutes);

// Handle Undefined Routes
app.use((req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});