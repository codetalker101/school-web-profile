const Pool = require('pg').Pool

const pool = new Pool({
  user: "janghyun",
  password: "",
  host: "localhost",
  port: 5432,
  database: "webprofile"
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

