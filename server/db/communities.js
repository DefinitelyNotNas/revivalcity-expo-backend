const { client } = require("../../app.js");
const uuid = require("uuid");

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

		return rows[0]; // return the inserted row
	} catch (error) {
		console.error("Error joining community:", error);
		throw error;
	}
};

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

const isUserInCom = async (user_id, comId) => {
	try {
		const { rows } = await client.query(
			`SELECT 1 FROM community_members WHERE user_id = $1 AND community_id = $2);`,
			[user_id, comId]
		);
		return rows.length > 0;
	} catch (error) {
		console.log(error);
		return false;
	}
};

const fetchUserComs = async (user_id) => {
	try {
		const { rows } = await client.query(
			`SELECT c.* 
            FROM communities c
            JOIN community_members cm ON c.id = cm.community_id
            WHERE cm.user_id = $1;
            `,
			[user_id]
		);
		return rows;
	} catch (error) {}
};

//Pending
/* 
- Update Community
 */

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
