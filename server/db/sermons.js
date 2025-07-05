const { client } = require("../../app.js");
const uuid = require("uuid");

// - Add sermon
const createSermon = async (
	title,
	speaker,
	date,
	video_url,
	audio_url,
	series_name,
	description,
	type,
	topic
) => {
	try {
		const { rows } = await client.query(
			`INSERT INTO sermons(
				id,
				title,
				speaker,
				date,
				video_url,
				audio_url,
				series_name,
				description,
				sermon_type,
				topic
			) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;`,
			[
				uuid.v4(),
				title,
				speaker,
				date,
				video_url,
				audio_url,
				series_name,
				description,
				type,
				topic,
			]
		);
		return rows[0];
	} catch (error) {
		console.log(error);
	}
};

// - Remove sermon
const deleteSermon = async (sermonId) => {
	try {
		const { rows } = await client.query(
			`DELETE FROM sermons WHERE id = $1 RETURNING *;`,
			[sermonId]
		);
		return rows[0];
	} catch (error) {
		console.log(error);
	}
};

// - Fetch all sermons
const fetchAllSermons = async () => {
	try {
		const { rows } = await client.query(
			`SELECT * FROM sermons ORDER BY date DESC;`
		);
		return rows;
	} catch (error) {
		console.log(error);
	}
};

// - Fetch sermon by speaker
const fetchSermonsBySpeaker = async (speaker) => {
	try {
		const { rows } = await client.query(
			`SELECT * FROM sermons WHERE speaker ILIKE $1 ORDER BY date DESC;`,
			[`%${speaker}%`]
		);
		return rows;
	} catch (error) {
		console.log(error);
	}
};

// - Fetch sermon by type
const fetchSermonsByType = async (type) => {
	try {
		const { rows } = await client.query(
			`SELECT * FROM sermons WHERE sermon_type = $1 ORDER BY date DESC;`,
			[type]
		);
		return rows;
	} catch (error) {
		console.log(error);
	}
};

// - Fetch sermon by topic
const fetchSermonsByTopic = async (topic) => {
	try {
		const { rows } = await client.query(
			`SELECT * FROM sermons WHERE topic ILIKE $1 ORDER BY date DESC;`,
			[`%${topic}%`]
		);
		return rows;
	} catch (error) {
		console.log(error);
	}
};

// - Fetch sermons by series
const fetchSermonsBySeries = async (series) => {
	try {
		const { rows } = await client.query(
			`SELECT * FROM sermons WHERE series_name ILIKE $1 ORDER BY date DESC;`,
			[`%${series}%`]
		);
		return rows;
	} catch (error) {
		console.log(error);
	}
};

// - Fetch sermon by ID
const fetchSermonById = async (sermonId) => {
	try {
		const { rows } = await client.query(
			`SELECT * FROM sermons WHERE id = $1;`,
			[sermonId]
		);
		return rows[0];
	} catch (error) {
		console.log(error);
	}
};

// - Fetch sermon by query (search across multiple fields)
const fetchSermonByQuery = async (query) => {
	try {
		const { rows } = await client.query(
			`SELECT * FROM sermons
			 WHERE title ILIKE $1
			 OR speaker ILIKE $1
			 OR topic ILIKE $1
			 OR series_name ILIKE $1
			 ORDER BY date DESC;`,
			[`%${query}%`]
		);
		return rows;
	} catch (error) {
		console.log(error);
	}
};

// - Fetch recent sermons (e.g., last 5 sermons)
const fetchRecentSermons = async () => {
	try {
		const { rows } = await client.query(
			`SELECT * FROM sermons ORDER BY date DESC LIMIT 5;`
		);
		return rows;
	} catch (error) {
		console.log(error);
	}
};

// - Fetch all unique series names
const fetchAllSeries = async () => {
	try {
		const { rows } = await client.query(
			`SELECT DISTINCT series_name FROM sermons WHERE series_name IS NOT NULL ORDER BY series_name;`
		);
		return rows.map((row) => row.series_name);
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	createSermon,
	deleteSermon,
	fetchAllSermons,
	fetchSermonById,
	fetchSermonByQuery,
	fetchSermonsBySeries,
	fetchSermonsBySpeaker,
	fetchSermonsByTopic,
	fetchSermonsByType,
	fetchRecentSermons,
	fetchAllSeries,
};
