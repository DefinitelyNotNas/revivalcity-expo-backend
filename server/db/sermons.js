const { client } = require("./index");
const uuid = require("uuid");

/**
 * Creates a new sermon entry.
 * @param {string} title - Title of the sermon.
 * @param {string} speaker - Speaker name.
 * @param {string} topic - Topic of the sermon.
 * @param {string} video_url - URL of the sermon video.
 * @param {string} audio_url - URL of the sermon audio.
 * @param {string} series_name - Name of the sermon series.
 * @param {string} description - Description of the sermon.
 * @param {string} sermon_type - Type/category of the sermon.
 * @param {string} bunny_id - BunnyCDN GUID.
 * @param {string} thumbnail_url - Thumbnail URL.
 * @param {string} date - Date the sermon was preached (optional).
 * @returns {Promise<Object>} The newly created sermon.
 */
const createSermon = async (
	title,
	speaker,
	topic,
	video_url,
	audio_url,
	series_name,
	description,
	sermon_type,
	bunny_id,
	thumbnail_url,
	date
) => {
	const { rows } = await client.query(
		`INSERT INTO sermons 
		 (title, speaker, topic, video_url, audio_url, series_name, description, sermon_type, bunny_id, thumbnail_url, date, created_at) 
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW()) 
		 RETURNING *`,
		[
			title,
			speaker,
			topic,
			video_url,
			audio_url,
			series_name,
			description,
			sermon_type,
			bunny_id,
			thumbnail_url,
			date,
		]
	);
	return rows[0];
};

const deleteSermon = async (sermonId) => {
	const { rows } = await client.query(
		`DELETE FROM sermons WHERE id = $1 RETURNING *;`,
		[sermonId]
	);
	return rows[0];
};

const fetchAllSermons = async () => {
	const { rows } = await client.query(
		`SELECT * FROM sermons ORDER BY date DESC;`
	);
	return rows;
};

const fetchSermonsBySpeaker = async (speaker) => {
	const { rows } = await client.query(
		`SELECT * FROM sermons WHERE speaker ILIKE $1 ORDER BY date DESC;`,
		[`%${speaker}%`]
	);
	return rows;
};

const fetchSermonsByType = async (type) => {
	const { rows } = await client.query(
		`SELECT * FROM sermons WHERE sermon_type = $1 ORDER BY date DESC;`,
		[type]
	);
	return rows;
};

const fetchSermonsByTopic = async (topic) => {
	const { rows } = await client.query(
		`SELECT * FROM sermons WHERE topic ILIKE $1 ORDER BY date DESC;`,
		[`%${topic}%`]
	);
	return rows;
};

const fetchSermonsBySeries = async (series) => {
	const { rows } = await client.query(
		`SELECT * FROM sermons WHERE series_name ILIKE $1 ORDER BY date DESC;`,
		[`%${series}%`]
	);
	return rows;
};

const fetchSermonById = async (sermonId) => {
	const { rows } = await client.query(
		`SELECT * FROM sermons WHERE id = $1;`,
		[sermonId]
	);
	return rows[0];
};

const fetchSermonByQuery = async (query) => {
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
};

const fetchRecentSermons = async () => {
	const { rows } = await client.query(
		`SELECT * FROM sermons ORDER BY date DESC LIMIT 5;`
	);
	return rows;
};

const fetchAllSeries = async () => {
	const { rows } = await client.query(
		`SELECT DISTINCT series_name FROM sermons WHERE series_name IS NOT NULL ORDER BY series_name;`
	);
	return rows.map((row) => row.series_name);
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
