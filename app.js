require("dotenv").config();
const { Pool } = require("pg");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const registerSocketHandlers = require("./socket"); // ✅ Your new socket handler

// --- Database connection ---
const client = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: { rejectUnauthorized: false },
});

// --- Express App + Socket Server Setup ---
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*", // Use specific domain in prod
		methods: ["GET", "POST"],
	},
});

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`);
	next();
});

// --- API Routes ---
app.use("/api", require("./server/api"));

// ✅ Replace it with your cleaner version
registerSocketHandlers(io);

// --- Start Everything ---
const PORT = process.env.PORT || 3000;

const init = async () => {
	try {
		await client.connect();
		console.log("Connected to PostgreSQL");

		server.listen(PORT, () => {
			console.log(`Server + Socket.IO running on port ${PORT}`);
		});
	} catch (error) {
		console.error("DB connection error:", error);
		process.exit(1);
	}
};

init();

module.exports = { client };
