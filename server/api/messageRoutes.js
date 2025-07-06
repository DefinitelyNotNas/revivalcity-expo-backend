const express = require("express");
const router = express.Router();
const { client } = require("../db/index");

router.get("/:communityId", async (req, res) => {
	const { communityId } = req.params;

	try {
		const { rows } = await client.query(
			"SELECT * FROM messages WHERE community_id = $1 ORDER BY created_at ASC",
			[communityId]
		);
		res.json(rows);
	} catch (err) {
		console.error("DB query error in /messages route:", err);
		res.status(500).send("Internal Server Error");
	}
});

module.exports = router;
