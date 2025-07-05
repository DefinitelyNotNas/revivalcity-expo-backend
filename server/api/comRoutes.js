const express = require("express");
const router = express.Router();

const {
	fetchAllComs,
	createCom,
	joinCom,
	leaveCom,
	fetchComMembers,
	fetchSingleCom,
	isUserInCom,
	fetchUserComs,
} = require("../db/communities");

// GET all communities
router.get("/", async (req, res, next) => {
	try {
		const response = await fetchAllComs();
		res.status(200).send(response);
	} catch (error) {
		next(error);
	}
});

// GET a single community by ID
router.get("/community/:id", async (req, res, next) => {
	try {
		const response = await fetchSingleCom(req.params.id);
		res.status(200).send(response);
	} catch (error) {
		next(error);
	}
});

// POST create a new community
router.post("/create", async (req, res, next) => {
	try {
		const response = await createCom(
			req.body.name,
			req.body.description
		);
		res.status(201).send(response);
	} catch (error) {
		next(error);
	}
});

// POST user joins a community
router.post("/join/:ComId/:UserId", async (req, res, next) => {
	try {
		const response = await joinCom(
			req.params.UserId,
			req.params.ComId
		);
		res.status(200).send(response);
	} catch (error) {
		next(error);
	}
});

// DELETE user leaves a community
router.delete("/leave/:ComId/:UserId", async (req, res, next) => {
	try {
		const response = await leaveCom(
			req.params.UserId,
			req.params.ComId
		);
		res.status(200).send(response);
	} catch (error) {
		next(error);
	}
});

// GET all members of a community
router.get("/members/:ComId", async (req, res, next) => {
	try {
		const response = await fetchComMembers(req.params.ComId);
		res.status(200).send(response);
	} catch (error) {
		next(error);
	}
});

// GET if a user is in a community
router.get("/check/:ComId/:UserId", async (req, res, next) => {
	try {
		const response = await isUserInCom(
			req.params.UserId,
			req.params.ComId
		);
		res.status(200).send({ isMember: response });
	} catch (error) {
		next(error);
	}
});

// GET all communities a user is in
router.get("/user/:UserId", async (req, res, next) => {
	try {
		const response = await fetchUserComs(req.params.UserId);
		res.status(200).send(response);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
