const { client } = require("../../app.js");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * Creates a new user in the database.
 * @param {string} name - User's name.
 * @param {string} email - User's email.
 * @param {string} phone - User's phone number.
 * @param {string} avatar_url - Avatar image URL.
 * @param {string} role - User role (e.g. "admin", "member").
 * @param {string} user_stage - User's stage (e.g. "new", "active").
 * @returns {Promise<Object>} The created user.
 */
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

/**
 * Deletes a user by ID.
 * @param {string} userId - ID of the user to delete.
 * @returns {Promise<Object>} The deleted user.
 */
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

/**
 * Edits a user with provided fields.
 * @param {string} userId - ID of the user to update.
 * @param {Object} updates - Key-value pairs of fields to update.
 * @returns {Promise<Object>} The updated user.
 */
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

/**
 * Sets the user's role.
 * @param {string} userId - ID of the user.
 * @param {string} role - New role to assign.
 * @returns {Promise<Object>} The updated user.
 */
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

/**
 * Sets the user's stage.
 * @param {string} userId - ID of the user.
 * @param {string} user_stage - New stage to assign.
 * @returns {Promise<Object>} The updated user.
 */
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

/**
 * Fetches a user by their ID.
 * @param {string} userId - ID of the user.
 * @returns {Promise<Object>} The user record.
 */
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

/**
 * Fetches users by name (case-insensitive partial match).
 * @param {string} name - Name to search.
 * @returns {Promise<Array>} Array of matching users.
 */
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

/**
 * Fetches all users in the system.
 * @returns {Promise<Array>} List of all users.
 */
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

/**
 * Checks if a user exists by username.
 * @param {string} username - Username to check.
 * @returns {Promise<boolean>} True if user exists, false otherwise.
 */
const userExists = async (username) => {
	const SQL = `SELECT id FROM users WHERE username = $1;`;
	const response = await client.query(SQL, [username]);
	return response.rows.length > 0;
};

/**
 * Authenticates a user by username and password.
 * @param {Object} credentials - Object with `username` and `password`.
 * @returns {Promise<Object>} JWT token object on success.
 * @throws {Error} If user not found or password is incorrect.
 */
const authenticate = async ({ username, password }) => {
	const SQL = `SELECT id, password, email, role FROM users WHERE username = $1;`;
	const response = await client.query(SQL, [username]);

	if (!response.rows.length) throw new Error("User not found");
	const user = response.rows[0];
	if (!user.password) throw new Error("User password not defined");

	const passwordMatch = await bcrypt.compare(password, user.password);
	if (!passwordMatch) throw new Error("Incorrect password");

	const myToken = jwt.sign(
		{ id: user.id, role: user.role },
		process.env.JWT_SECRET
	);

	return { token: myToken };
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
	authenticate,
	userExists,
};
