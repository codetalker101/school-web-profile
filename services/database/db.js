const Pool = require('pg').Pool
const dotenv = require('dotenv')

// path to config.env
dotenv.config({ path: 'config.env' });

const pool = new Pool({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: "localhost",
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME
});

// const { Pool } = require('pg');
// require('dotenv').config();
//
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false, // untuk Railway
//   },
// });


module.exports = pool;

