const mysql = require("mysql");
const util = require("util");
const colors = require("colors");
require("dotenv").config();

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER_NM,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
});

connection.connect(function (err) {
  if (err) {
    console.log(colors.red.bold(`❌ Error connecting: ${err.stack}`));
    console.log("⚠️ DB Password:", process.env.DB_PASSWORD);
    return;
  }
  console.log(
    colors.green.bold(`✅ Connected as thread ID: ${connection.threadId}`)
  );
});

// Promisify queries for async/await
connection.query = util.promisify(connection.query).bind(connection);

module.exports = connection;
