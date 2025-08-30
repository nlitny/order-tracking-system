const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const seed = require("./prisma/seed");
const { generalRateLimit } = require("./src/middleware/rateLimit");
const errorHandler = require("./src/middleware/errorHandler");
const notFoundHandler = require("./src/middleware/notFound");

const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/users"); 
const adminRoutes = require("./src/routes/admin");
const orderRoutes = require("./src/routes/orders");
const customerMediaRoutes = require("./src/routes/customerMedia");
const mediaFileRoutes = require("./src/routes/mediaFile");
const notificationRoutes = require("./src/routes/notification");

const swaggerUi = require("swagger-ui-express");
const { swaggerSpec } = require("./src/config/swagger");
const securityMiddleware = require("./src/middleware/securityMiddleware");

const app = express();

// Security & middleware
securityMiddleware(app);
app.use(generalRateLimit);
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true, limit: "500mb" }));
app.use(compression());

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use("/api/v1/orders", mediaFileRoutes);
app.use("/api/v1/orders", customerMediaRoutes);
app.use("/api/v1/orders", orderRoutes);

app.use("/api/v1/notifications", notificationRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Seed data
seed();

module.exports = app;
