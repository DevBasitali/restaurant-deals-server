const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

pool.on("connect", () => {
  console.log("success, connected to database");
});

pool.on('error', (err) => {
    console.error('Error with PostgreSQL client:', err);
  });

module.exports = pool;
