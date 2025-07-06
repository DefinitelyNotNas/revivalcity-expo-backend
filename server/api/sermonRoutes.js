const express = require("express");
const router = express.Router();

const {
	createSermon, //post
	deleteSermon, //delete
	fetchAllSermons, //get
	fetchSermonById, //get
	fetchSermonByQuery, // get
	fetchSermonsBySeries, // get
	fetchSermonsBySpeaker, // get
	fetchSermonsByTopic, // get
	fetchSermonsByType, // get
	fetchRecentSermons, // get
	fetchAllSeries, // get
} = require("../db/sermons");

router.post("/create", verifyToken, async (req, res, next) => {
	try {
		const response = await createSermon();
		res.status(200).send(response);
	} catch (error) {
		next(error);
	}
});

router.delete("/delete/:id", verifyToken, async (req, res, next) => {
	try {
		const response = await deleteSermon();
		res.status(200).send(response);
	} catch (error) {
		next(error);
	}
});

router.get("/", async (req, res, next) => {
	try {
		const response = await fetchAllSermons();
		res.status(200).send(response);
	} catch (error) {
		next(error);
	}
});

router.get("/sermons/:id", async (req, res, next) => {
	try {
		const response = await fetchSermonById(req.params.id);
		res.status(200).send(response);
	} catch (error) {
		next(error);
	}
});

router.get("/sermons/:query", async (req, res, next) => {
	try {
		const response = await fetchSermonByQuery(req.params.query);
		res.status(200).send(response);
	} catch (error) {
		next(error);
	}
});

router.get("/sermons/series/:series", async (req, res, next) => {
	try {
		const response = await fetchSermonsBySeries(req.params.series);
		res.status(200).send(response);
	} catch (error) {
		next(error);
	}
});

router.get("/sermons/:speaker", async (req, res, next) => {
	try {
		const response = await fetchSermonsBySpeaker(req.params.speaker);
		res.status(200).send(response);
	} catch (error) {
		next(error);
	}
});

router.get("/sermons/:topic", async (req, res, next) => {
	try {
		const response = await fetchSermonsByTopic(req.params.topic);
		res.status(200).send(response);
	} catch (error) {
		next(error);
	}
});

router.get("/sermons/:type", async (req, res, next) => {
	try {
		const response = await fetchSermonsByType(req.params.type);
		res.status(200).send(response);
	} catch (error) {
		next(error);
	}
});

router.get("/sermons/recent", async (req, res, next) => {
	try {
		const response = await fetchRecentSermons();
		res.status(200).send(response);
	} catch (error) {
		next(error);
	}
});

router.get("/sermons/series", async (req, res, next) => {
	try {
		const response = await fetchAllSeries();
		res.status(200).send(response);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
