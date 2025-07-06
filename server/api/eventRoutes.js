const express = require("express");
const router = express.Router();

const {
	fetchAllEvents,
	addEvent,
	deleteEvent,
	getEventById,
	fetchUpcomingEvents,
	registerForEvent,
} = require("../db/events");
const { verifyToken } = require("./middlewares");

router.get("/", async (req, res, next) => {
	try {
		const response = await fetchAllEvents();
		res.status(200).send(response);
	} catch (error) {
		next(error);
	}
});

router.post("/add", verifyToken, async (req, res, next) => {
	try {
		const response = await addEvent(
			req.body.title,
			req.body.description,
			req.body.location,
			req.body.imageUrl,
			req.body.date
		);
		res.status(201).send(response);
	} catch (error) {
		next(error);
	}
});

router.delete(
	"/delete/:eventId",
	verifyToken,
	async (req, res, next) => {
		try {
			const response = await deleteEvent(req.params.eventId);
			res.status(200).send(response);
		} catch (error) {
			next(error);
		}
	}
);

router.get("/:id", async (req, res, next) => {
	try {
		const response = await getEventById(req.params.id);
		res.status(200).send(response);
	} catch (error) {
		next(error);
	}
});

router.get("/upcoming", async (req, res, next) => {
	try {
		const response = await fetchUpcomingEvents();
		res.status(200).send(response);
	} catch (error) {
		next(error);
	}
});

router.post(
	"/register/:eventId",
	verifyToken,
	async (req, res, next) => {
		try {
			const response = await registerForEvent(
				req.userId,
				req.params.eventId
			);
			res.status(200).send(response);
		} catch (error) {
			next(error);
		}
	}
);

module.exports = router;
