const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const seed = require('./prisma/seed');

const { generalRateLimit } = require("./src/middleware/rateLimit");
const errorHandler = require("./src/middleware/errorHandler");
const notFoundHandler = require("./src/middleware/notFound");

// Import routes
const authRoutes = require("./src/routes/auth");
const orderRoutes = require('./src/routes/orders');
const customerMediaRoutes = require('./src/routes/customerMedia'); // اضافه شده
const adminRoutes = require('./src/routes/admin');
const notificationRoutes = require('./src/routes/notification');

const swaggerUi = require("swagger-ui-express");
const { swaggerSpec } = require("./src/config/swagger");
const securityMiddleware = require("./src/middleware/securityMiddleware");
const app = express();

securityMiddleware(app);

// Rate limiting
app.use(generalRateLimit);

// Body parsing - افزایش حد برای فایل ها
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression
app.use(compression());

// Logging
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

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/orders', customerMediaRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/v1/notifications', notificationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

seed();
module.exports = app;
