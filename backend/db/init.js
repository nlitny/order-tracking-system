const { Client } = require("pg");
const { execSync } = require("child_process");
const path = require("path");

// Load .env from root
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForDB(maxRetries = 30) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const client = new Client({
        user: process.env.POSTGRES_USER,
        host: "db",
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: 5432,
      });

      await client.connect();
      await client.end();
      console.log("Database connection successful!");
      return true;
    } catch (err) {
      console.log(`Waiting for database... (${i + 1}/${maxRetries})`);
      await sleep(2000);
    }
  }
  throw new Error("Could not connect to database after multiple attempts");
}

async function initDB() {
  await waitForDB();

  const client = new Client({
    user: process.env.POSTGRES_USER,
    host: "db",
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
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

    await client.end();

    // Connect to the app database for migrations
    const appClient = new Client({
      user: process.env.ORDERTRACKING_USER,
      host: "db",
      database: process.env.ORDERTRACKING_DB,
      password: process.env.ORDERTRACKING_PASSWORD,
      port: 5432,
    });

    await appClient.connect();
    await appClient.end();

    // Prisma migrations
    console.log("Running Prisma migrations...");
    execSync("npx prisma migrate deploy", { stdio: "inherit" });
    console.log("Prisma migrations finished");
  } catch (err) {
    console.error("Error initializing database:", err);
    throw err;
  }
}

initDB().catch(console.error);
