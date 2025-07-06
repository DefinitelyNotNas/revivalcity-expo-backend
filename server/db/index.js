// server/db/index.js
const { Pool } = require("pg");
require("dotenv").config();

const client = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: { rejectUnauthorized: false },
});

module.exports = client;
