require("dotenv").config();
const { Pool } = require("pg");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// --- Database connection ---
const client = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: { rejectUnauthorized: false },
});

// --- Express App + Socket Server Setup ---
const app = express();
const server = http.createServer(app); // for socket.io
const io = new Server(server, {
	cors: {
		origin: "*", // Replace with specific frontend domain in prod
		methods: ["GET", "POST"],
	},
});

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`);
	next();
});

// --- Your API route ---
app.use("/api", require("./server/api"));

// --- Socket.IO Setup ---
io.on("connection", (socket) => {
	console.log(`User connected: ${socket.id}`);

	socket.on("join_room", (roomId) => {
		socket.join(roomId);
		console.log(`User joined room: ${roomId}`);
	});

	socket.on("send_message", (messageData) => {
		// You can insert messageData into DB here
		io.to(messageData.room).emit("receive_message", messageData);
	});

	socket.on("disconnect", () => {
		console.log("User disconnected");
	});
});

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
