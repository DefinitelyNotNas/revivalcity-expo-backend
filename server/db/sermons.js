const { client } = require("../../app.js");
const uuid = require("uuid");

// - Add sermon
const createSermon = async (title, speaker, date, video_url, audio_url, series_name, description, type, ) => {
	try {
		const { rows } = await client.query(`;`);
		return rows[0];
	} catch (error) {
		console.log(error);
	}
};
// - Remove sermon
const deleteSermon = async (sermonId) => {
	try {
		const { rows } = await client.query(`;`);
		return rows[0];
	} catch (error) {
		console.log(error);
	}
};

// - fetch all sermons
const fetchAllSermons = async () => {
	try {
		const { rows } = await client.query(`;`);
		return rows;
	} catch (error) {
		console.log(error);
	}
};

// - fetch sermon by speaker
const fetchSermonsBySpeaker = async (speaker) => {
	try {
		const { rows } = await client.query(`;`);
		return rows;
	} catch (error) {
		console.log(error);
	}
};

// - fetch sermon by type
const fetchSermonsByType = async (type) => {
	try {
		const { rows } = await client.query(`;`);
		return rows;
	} catch (error) {
		console.log(error);
	}
};

// - fetch sermon by topic
const fetchSermonsByTopic = async (topic) => {
	try {
		const { rows } = await client.query(`;`);
		return rows;
	} catch (error) {
		console.log(error);
	}
};

// - fetch sermons by series
const fetchSermonsBySeries = async (series) => {
	try {
		const { rows } = await client.query(`;`);
		return rows;
	} catch (error) {
		console.log(error);
	}
};

// - fetch sermon by id
const fetchSermonById = async (sermonId) => {
	try {
		const { rows } = await client.query(`;`);
		return rows[0];
	} catch (error) {
		console.log(error);
	}
};

// - fetch sermon by query (search)
const fetchSermonByQuery = async (query) => {
	try {
		const { rows } = await client.query(`;`);
		return rows[0];
	} catch (error) {
		console.log(error);
	}
};

// - fetch recent sermons
const fetchRecentSermons = async () => {
	try {
		const { rows } = await client.query(`;`);
		return rows[0];
	} catch (error) {
		console.log(error);
	}
};

// - fetch all series (what series do we have)
const fetchAllSeries = async () => {
	try {
		const { rows } = await client.query(`;`);
		return rows;
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
