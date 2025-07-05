const { client } = require("../../app.js");
const uuid = require("uuid");

// 1. Create a new message in a community
const createMessage = async (community_id, user_id, content) => {
	try {
		const { rows } = await client.query(
			`INSERT INTO messages(id, community_id, user_id, content, created_at)
			VALUES($1, $2, $3, $4, NOW()) RETURNING *;`,
			[uuid.v4(), community_id, user_id, content]
		);
		return rows[0];
	} catch (error) {
		console.error("Error creating message:", error);
	}
};

// 2. Fetch all messages in a community
const fetchMessagesByCommunity = async (community_id) => {
	try {
		const { rows } = await client.query(
			`SELECT messages.*, users.name, users.avatar_url
			FROM messages
			JOIN users ON messages.user_id = users.id
			WHERE messages.community_id = $1
			ORDER BY messages.created_at ASC;`,
			[community_id]
		);
		return rows;
	} catch (error) {
		console.error("Error fetching messages:", error);
	}
};

// 3. Delete a message (by sender)
const deleteMessage = async (message_id, user_id) => {
	try {
		const { rows } = await client.query(
			`DELETE FROM messages
			WHERE id = $1 AND user_id = $2 RETURNING *;`,
			[message_id, user_id]
		);
		return rows[0];
	} catch (error) {
		console.error("Error deleting message:", error);
	}
};

// 4. Edit a message (optional)
const editMessage = async (message_id, user_id, newContent) => {
	try {
		const { rows } = await client.query(
			`UPDATE messages
			SET content = $1
			WHERE id = $2 AND user_id = $3
			RETURNING *;`,
			[newContent, message_id, user_id]
		);
		return rows[0];
	} catch (error) {
		console.error("Error editing message:", error);
	}
};

module.exports = {
	createMessage,
	fetchMessagesByCommunity,
	deleteMessage,
	editMessage,
};
