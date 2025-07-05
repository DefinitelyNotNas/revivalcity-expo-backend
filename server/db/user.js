const { client } = require("../../app.js");
const uuid = require("uuid");

// - create user
const createUser = async (
	name,
	email,
	phone,
	avatar_url,
	role,
	user_stage
) => {
	try {
		const { rows } = await client.query(
			`INSERT INTO users(id, name, email, phone, avatar_url, role, user_stage, created_at)
			 VALUES($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *;`,
			[uuid.v4(), name, email, phone, avatar_url, role, user_stage]
		);
		return rows[0];
	} catch (error) {
		console.log(error);
	}
};

// - delete user
const deleteUser = async (userId) => {
	try {
		const { rows } = await client.query(
			`DELETE FROM users WHERE id = $1 RETURNING *;`,
			[userId]
		);
		return rows[0];
	} catch (error) {
		console.log(error);
	}
};

// - edit user (update any user field dynamically)
const editUser = async (userId, updates) => {
	try {
		const keys = Object.keys(updates);
		const setClause = keys
			.map((key, i) => `${key} = $${i + 2}`)
			.join(", ");
		const values = [userId, ...Object.values(updates)];

		const { rows } = await client.query(
			`UPDATE users SET ${setClause} WHERE id = $1 RETURNING *;`,
			values
		);
		return rows[0];
	} catch (error) {
		console.log(error);
	}
};

// - set user role
const setUserRole = async (userId, role) => {
	try {
		const { rows } = await client.query(
			`UPDATE users SET role = $2 WHERE id = $1 RETURNING *;`,
			[userId, role]
		);
		return rows[0];
	} catch (error) {
		console.log(error);
	}
};

// - set user stage
const setUserFunction = async (userId, user_stage) => {
	try {
		const { rows } = await client.query(
			`UPDATE users SET user_stage = $2 WHERE id = $1 RETURNING *;`,
			[userId, user_stage]
		);
		return rows[0];
	} catch (error) {
		console.log(error);
	}
};

// - fetch user by ID
const fetchUserById = async (userId) => {
	try {
		const { rows } = await client.query(
			`SELECT * FROM users WHERE id = $1;`,
			[userId]
		);
		return rows[0];
	} catch (error) {
		console.log(error);
	}
};

// - fetch user by name
const fetchUserByName = async (name) => {
	try {
		const { rows } = await client.query(
			`SELECT * FROM users WHERE name ILIKE $1;`,
			[`%${name}%`]
		);
		return rows;
	} catch (error) {
		console.log(error);
	}
};

// - fetch all users
const fetchAllUsers = async () => {
	try {
		const { rows } = await client.query(
			`SELECT * FROM users ORDER BY created_at DESC;`
		);
		return rows;
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	createUser,
	deleteUser,
	editUser,
	setUserRole,
	setUserFunction,
	fetchUserById,
	fetchUserByName,
	fetchAllUsers,
};
