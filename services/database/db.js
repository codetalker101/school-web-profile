const Pool = require('pg').Pool

const pool = new Pool({
  user: "janghyun",
  password: "",
  host: "localhost",
  port: 5432,
  database: "webprofile"
});

module.exports = pool;

