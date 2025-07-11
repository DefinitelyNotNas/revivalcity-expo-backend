require("dotenv").config();
const { Pool } = require("pg");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const registerSocketHandlers = require("./socket");

// --- Database connection ---
const client = require("./server/db");

// --- Express App + Socket Server Setup ---
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: [
			"http://localhost:5173",
			"https://rcitysermonupload.netlify.app",
		],
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
	},
});

// --- CORS Middleware ---
app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"https://rcitysermonupload.netlify.app",
		],
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

// --- JSON Parsing & Logging ---
app.use(express.json());
app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`);
	next();
});

// --- API Routes ---
app.use("/api", require("./server/api"));

// --- Register Socket.IO Events ---
registerSocketHandlers(io);

// --- Start Server ---
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
