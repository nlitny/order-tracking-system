const { Client } = require("pg");
const { execSync } = require("child_process");
const path = require("path");

// Load .env
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

async function initDB() {
  const client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: Number(process.env.POSTGRES_PORT),
  });

  try {
    await client.connect();

    // CREATE ROLE
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${process.env.ORDERTRACKING_USER}') THEN
          CREATE ROLE ${process.env.ORDERTRACKING_USER} LOGIN ENCRYPTED PASSWORD '${process.env.ORDERTRACKING_PASSWORD}';
        END IF;
      END
      $$;
    `);

    // CREATE DATABASE
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = '${process.env.ORDERTRACKING_DB}'`
    );
    if (res.rowCount === 0) {
      await client.query(
        `CREATE DATABASE ${process.env.ORDERTRACKING_DB} OWNER ${process.env.ORDERTRACKING_USER}`
      );
      console.log("Database created");
    } else {
      console.log("Database already exists");
    }

    // GRANT PRIVILEGES
    await client.query(
      `GRANT ALL PRIVILEGES ON DATABASE ${process.env.ORDERTRACKING_DB} TO ${process.env.ORDERTRACKING_USER}`
    );

    console.log("Database initialized");

    // Prisma migrations
    console.log("Running Prisma migrations & seed...");
    execSync("npx prisma generate", { stdio: "inherit" });
    execSync("npx prisma migrate dev --name init", { stdio: "inherit" });

    console.log("Prisma migrations & seed finished");
  } catch (err) {
    console.error("Error initializing database:", err);
  } finally {
    await client.end();
  }
}

initDB();
