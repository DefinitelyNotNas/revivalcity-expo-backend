const { client } = require("../../app.js");
const uuid = require("uuid");

/**
 * Creates a new sermon entry.
 * @param {string} title - Title of the sermon.
 * @param {string} speaker - Speaker name.
 * @param {string} date - Date of the sermon.
 * @param {string} video_url - URL of the sermon video.
 * @param {string} audio_url - URL of the sermon audio.
 * @param {string} series_name - Name of the sermon series.
 * @param {string} description - Description of the sermon.
 * @param {string} type - Type/category of the sermon.
 * @param {string} topic - Topic of the sermon.
 * @returns {Promise<Object>} The newly created sermon.
 */
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

/**
 * Deletes a sermon by its ID.
 * @param {string} sermonId - ID of the sermon to delete.
 * @returns {Promise<Object>} The deleted sermon.
 */
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

/**
 * Fetches all sermons, ordered by date (newest first).
 * @returns {Promise<Array>} List of all sermons.
 */
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

/**
 * Fetches sermons filtered by speaker name.
 * @param {string} speaker - Speaker name to search for.
 * @returns {Promise<Array>} List of sermons matching the speaker.
 */
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

/**
 * Fetches sermons by sermon type/category.
 * @param {string} type - Type/category of sermon.
 * @returns {Promise<Array>} List of sermons matching the type.
 */
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

/**
 * Fetches sermons by topic.
 * @param {string} topic - Topic string to search for.
 * @returns {Promise<Array>} List of sermons matching the topic.
 */
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

/**
 * Fetches sermons by series name.
 * @param {string} series - Series name to search for.
 * @returns {Promise<Array>} List of sermons in the series.
 */
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

/**
 * Fetches a single sermon by ID.
 * @param {string} sermonId - ID of the sermon.
 * @returns {Promise<Object>} The sermon record.
 */
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

/**
 * Searches sermons by a query string across title, speaker, topic, and series name.
 * @param {string} query - Search string.
 * @returns {Promise<Array>} List of matching sermons.
 */
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

/**
 * Fetches the 5 most recent sermons.
 * @returns {Promise<Array>} Array of the 5 latest sermons.
 */
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

/**
 * Fetches all distinct sermon series names.
 * @returns {Promise<Array<string>>} Array of unique series names.
 */
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
