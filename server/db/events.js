const { client } = require("../../app.js");
const uuid = require("uuid");

const fetchAllEvents = async () => {
	try {
		const { rows } = await client.query(`SELECT * FROM events;`);
		return rows;
	} catch (error) {
		console.log(error);
	}
};

const addEvent = async (title, description, location, image_url) => {
	try {
		const { rows } = await client.query(
			`INSERT INTO events(id, title, description, location, image_url) VALUES($1, $2, $3, $4, $5) RETURNING *;`,
			[uuid.v4(), title, description, location, image_url]
		);
		return rows[0];
	} catch (error) {
		console.log(error);
	}
};

const deleteEvent = async (eventId) => {
	try {
		const { rows } = await client.query(
			`DELETE FROM events WHERE id = $1 RETURNING *;`,
			[eventId]
		);
		return rows[0];
	} catch (error) {
		console.log(error);
	}
};

const getEventById = async (eventId) => {
	try {
		const { rows } = await client.query(
			`SELECT * FROM events WHERE id = $1;`,
			[eventId]
		);
		return rows[0];
	} catch (error) {
		console.log(error);
	}
};

const fetchUpcomingEvents = async () => {
	try {
		const { rows } = await client.query(
			`SELECT * FROM events WHERE event_date >= CURRENT_DATE ORDER BY event_date ASC;`
		);
		return rows;
	} catch (error) {
		console.log(error);
	}
};

const registerForEvent = async (userId, eventId) => {
	try {
		await client.query("BEGIN");

		await client.query(
			`INSERT INTO event_registrations(user_id, event_id) VALUES ($1, $2)
			ON CONFLICT (user_id, event_id) DO NOTHING;`,
			[userId, eventId]
		);

		await client.query(
			`UPDATE events SET attendance_count = attendance_count + 1 WHERE id = $1;`,
			[eventId]
		);

		await client.query("COMMIT");

		return { success: true };
	} catch (error) {
		await client.query("ROLLBACK");
		console.error(error);
		throw error;
	}
};

module.exports = {
	fetchAllEvents,
	addEvent,
	deleteEvent,
	getEventById,
	fetchUpcomingEvents,
	registerForEvent,
};
