const { client } = require("./index");
const uuid = require("uuid");

/**
 * Fetches all communities from the database, ordered by newest first.
 * @returns {Promise<Array>} Array of community records.
 */
const fetchAllComs = async () => {
	try {
		const { rows } = await client.query(
			`SELECT * FROM communities ORDER BY created_at DESC;`
		);
		return rows;
	} catch (error) {
		console.log(error);
	}
};

/**
 * Creates a new community with a name and description.
 * @param {string} name - Name of the community.
 * @param {string} description - Description of the community.
 * @returns {Promise<Object>} The newly created community.
 */
const createCom = async (name, description) => {
	try {
		const { rows } = await client.query(
			`INSERT INTO communities(id, name, description, created_at) VALUES($1, $2, $3, NOW()) RETURNING * ;`,
			[uuid.v4(), name, description]
		);
		return rows[0];
	} catch (error) {
		console.log(error);
	}
};

/**
 * Deletes a community by its ID.
 * @param {string} comId - Community ID to delete.
 * @returns {Promise<Object>} Deleted community or message.
 */
const deleteCom = async (comId) => {
	try {
		const { rows } = await client.query(
			`DELETE FROM communities WHERE id = $1;`,
			[comId]
		);
		if (rows.length === 0) {
			return { message: "Community not found or already deleted." };
		}
		return rows[0];
	} catch (error) {
		console.log(error);
	}
};

/**
 * Removes a user from a community.
 * @param {string} user_id - User ID.
 * @param {string} community_id - Community ID.
 * @returns {Promise<Object>} Message result.
 */
const leaveCom = async (user_id, community_id) => {
	try {
		const { rows } = await client.query(
			`DELETE FROM community_members
			 WHERE user_id = $1 AND community_id = $2
			 RETURNING *`,
			[user_id, community_id]
		);

		if (rows.length === 0) {
			return { message: "Not a member of this community." };
		}

		return { message: "Successfully left community." };
	} catch (error) {
		console.error("Error leaving community:", error);
		throw error;
	}
};

/**
 * Adds a user to a community if not already a member.
 * @param {string} user_id - User ID.
 * @param {string} community_id - Community ID.
 * @returns {Promise<Object>} Joined row or message.
 */
const joinCom = async (user_id, community_id) => {
	try {
		// Check if user already joined
		const exists = await client.query(
			`SELECT * FROM community_members WHERE user_id = $1 AND community_id = $2`,
			[user_id, community_id]
		);

		if (exists.rows.length > 0) {
			return { message: "Already a member." };
		}

		const { rows } = await client.query(
			`INSERT INTO community_members (user_id, community_id, joined_at)
			 VALUES ($1, $2, NOW())
			 RETURNING *`,
			[user_id, community_id]
		);

		return rows[0];
	} catch (error) {
		console.error("Error joining community:", error);
		throw error;
	}
};

/**
 * Fetches all members of a specific community.
 * @param {string} comId - Community ID.
 * @returns {Promise<Array>} Array of members.
 */
const fetchComMembers = async (comId) => {
	try {
		const { rows } = await client.query(
			`SELECT * FROM community_members WHERE community_id = $1;`,
			[comId]
		);
		return rows;
	} catch (error) {
		console.log(error);
	}
};

/**
 * Fetches a single community by ID.
 * @param {string} comId - Community ID.
 * @returns {Promise<Object>} Community data.
 */
const fetchSingleCom = async (comId) => {
	try {
		const { rows } = await client.query(
			`SELECT * FROM community WHERE community_id = $1;`,
			[comId]
		);
		return rows[0];
	} catch (error) {
		console.log(error);
	}
};

/**
 * Checks if a user is in a specific community.
 * @param {string} user_id - User ID.
 * @param {string} comId - Community ID.
 * @returns {Promise<boolean>} True if user is in community, false otherwise.
 */
const isUserInCom = async (user_id, comId) => {
	try {
		const { rows } = await client.query(
			`SELECT 1 FROM community_members WHERE user_id = $1 AND community_id = $2`,
			[user_id, comId]
		);
		return rows.length > 0;
	} catch (error) {
		console.log(error);
		return false;
	}
};

/**
 * Fetches all communities a user is part of.
 * @param {string} user_id - User ID.
 * @returns {Promise<Array>} Array of communities.
 */
const fetchUserComs = async (user_id) => {
	try {
		const { rows } = await client.query(
			`SELECT c.* 
            FROM communities c
            JOIN community_members cm ON c.id = cm.community_id
            WHERE cm.user_id = $1;`,
			[user_id]
		);
		return rows;
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	fetchAllComs,
	createCom,
	deleteCom,
	joinCom,
	leaveCom,
	fetchComMembers,
	fetchSingleCom,
	isUserInCom,
	fetchUserComs,
};
