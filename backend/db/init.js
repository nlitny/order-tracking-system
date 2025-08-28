const { Client } = require("pg");
const { execSync } = require("child_process");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
async function initDB() {
  const client = new Client({
    user: "postgres",
    host: "127.0.0.1",
    database: "postgres",
    password: "sadafpj6761",
    port: 5432,
  });

  try {
    await client.connect();

    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'ordertracking') THEN
          CREATE ROLE ordertracking LOGIN PASSWORD 'OrderTrack2024';
        END IF;
      END
      $$;
    `);

    const res = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'order_tracking_db'"
    );
    if (res.rowCount === 0) {
      await client.query(
        "CREATE DATABASE order_tracking_db OWNER ordertracking"
      );
      console.log("Database created");
    } else {
      console.log("Database already exists");
    }

    await client.query(
      "GRANT ALL PRIVILEGES ON DATABASE order_tracking_db TO ordertracking"
    );

    console.log("Database initialized");

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
