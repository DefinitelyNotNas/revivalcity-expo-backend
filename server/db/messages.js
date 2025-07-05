const { client } = require("../../app.js");
const uuid = require("uuid");

/**
 * Creates a new message in a community.
 * @param {string} community_id - ID of the community where the message is posted.
 * @param {string} user_id - ID of the user sending the message.
 * @param {string} content - The content of the message.
 * @returns {Promise<Object>} The newly created message.
 */
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

/**
 * Fetches all messages for a given community, including user info.
 * @param {string} community_id - ID of the community.
 * @returns {Promise<Array>} Array of messages with sender name and avatar.
 */
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

/**
 * Deletes a message by ID, only if it belongs to the given user.
 * @param {string} message_id - ID of the message to delete.
 * @param {string} user_id - ID of the user attempting deletion.
 * @returns {Promise<Object>} The deleted message or null.
 */
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

/**
 * Edits the content of a message if it belongs to the user.
 * @param {string} message_id - ID of the message to edit.
 * @param {string} user_id - ID of the user editing the message.
 * @param {string} newContent - The new content to replace the old one.
 * @returns {Promise<Object>} The updated message.
 */
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
