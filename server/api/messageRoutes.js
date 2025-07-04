const express = require("express");
const router = express.Router();
const client = require("../db"); // your pg client

router.get("/:communityId", async (req, res) => {
  const { communityId } = req.params;
  const { rows } = await client.query(
    "SELECT * FROM messages WHERE community_id = $1 ORDER BY created_at ASC",
    [communityId]
  );
  res.json(rows);
});

module.exports = router;
