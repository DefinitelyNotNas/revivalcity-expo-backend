const express = require("express");
const router = express.Router();

const {
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
} = require("../db/sermons");
