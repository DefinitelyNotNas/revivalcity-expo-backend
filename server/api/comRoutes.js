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
const { verifyToken } = require("./middlewares");

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
router.post("/create", verifyToken, async (req, res, next) => {
	try {
		const { name, description } = req.body;
		if (!name?.trim()) {
			return res
				.status(400)
				.json({ success: false, message: "Name is required" });
		}
		const community = await createCom(
			name,
			description /*, req.userId */
		);
		res.status(201).json({ success: true, data: community });
	} catch (error) {
		next(error);
	}
});

// POST user joins a community (userId in body)
router.post("/join/:ComId", verifyToken, async (req, res, next) => {
	try {
		const response = await joinCom(req.userId, req.params.ComId);
		res.status(200).send(response);
	} catch (error) {
		next(error);
	}
});

// DELETE user leaves a community (userId in body)
router.delete(
	"/leave/:ComId",
	verifyToken,
	async (req, res, next) => {
		try {
			const response = await leaveCom(
				req.body.userId,
				req.params.ComId
			);
			res.status(200).send(response);
		} catch (error) {
			next(error);
		}
	}
);

// GET all members of a community
router.get("/members/:ComId", async (req, res, next) => {
	try {
		const response = await fetchComMembers(req.params.ComId);
		res.status(200).send(response);
	} catch (error) {
		next(error);
	}
});

// GET check if a user is in a community (userId in body)
router.get("/check/:ComId", async (req, res, next) => {
	try {
		const response = await isUserInCom(
			req.body.userId,
			req.params.ComId
		);
		res.status(200).send({ isMember: response });
	} catch (error) {
		next(error);
	}
});

// GET all communities a user is in
router.get("/user/:UserId", verifyToken, async (req, res, next) => {
	try {
		const response = await fetchUserComs(req.UserId);
		res.status(200).send(response);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
