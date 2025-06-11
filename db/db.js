// const { Pool } = require("pg");
// const dotenv = require("dotenv");

// dotenv.config();

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl:
//     process.env.NODE_ENV === "production"
//       ? { rejectUnauthorized: false }
//       : false,
//   connectionTimeoutMillis: 5000,
//   idleTimeoutMillis: 30000,
// });

// pool.on("connect", () => {
//   // console.log("success, connected to database");
// });

// pool.on("error", (err) => {
//   console.error("Error with PostgreSQL client", err);
// });

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'devbasit2001',
  // Updated host to new endpoint
  host: 'foodypanda1.chsqgq86kwh6.ap-south-1.rds.amazonaws.com',
  port: 5432,
  // Updated database name
  database: 'foodypanda1',
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000,
  max: 20,
  idleTimeoutMillis: 30000,
  retries: 3
});

// Add better error logging
pool.on('connect', () => {
  console.log('Database connected successfully to foodypanda1');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Test query
async function testDB() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('Query result:', result.rows[0]);
    client.release();
  } catch (err) {
    console.error('Error testing connection:', err);
  }
}

testDB();

module.exports = pool;
