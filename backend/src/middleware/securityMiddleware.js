const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });

const securityMiddleware = (app) => {
  app.use(helmet());

  app.use(
    cors({
      origin: process.env.ALLOWED_ORIGINS?.split(",") || [
        "http://localhost:3000",
        "http://frontend:3000",
      ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
};

module.exports = securityMiddleware;
