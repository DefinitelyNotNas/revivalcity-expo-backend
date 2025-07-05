const {
	createMessage,
	fetchMessagesByCommunity,
} = require("./db/messageFunctions");

function registerSocketHandlers(io) {
	io.on("connection", (socket) => {
		console.log(`User connected: ${socket.id}`);

		socket.on("join_room", (roomId) => {
			socket.join(roomId);
			console.log(`User joined room: ${roomId}`);
		});

		socket.on(
			"send_message",
			async ({ community_id, user_id, content }) => {
				const message = await createMessage(
					community_id,
					user_id,
					content
				);
				io.to(community_id).emit("receive_message", message); // Send to everyone in room
			}
		);

		socket.on("get_messages", async (community_id, callback) => {
			const messages = await fetchMessagesByCommunity(community_id);
			callback(messages); // Emit through callback to requesting client
		});

		socket.on("disconnect", () => {
			console.log("User disconnected");
		});
	});
}

module.exports = registerSocketHandlers;
