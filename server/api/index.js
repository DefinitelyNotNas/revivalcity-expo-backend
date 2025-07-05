// ROUTES

const express = require("express");
const router = express.Router();

// Use the routes defined in the other route files
router.use("/users", require("./userRoutes.js"));
router.use("/events", require("./eventRoutes.js"));
router.use("/communities", require("./comRoutes.js"));
router.use("/messages", require("./messageRoutes.js"));
router.use("/sermons", require("./sermonRoutes.js"));
router.use("/admin", require("./adminRoutes.js"));

// Base route for the API

router.get("/", (req, res) => {
	res.send("Hello World From Router api/index.js");
});

module.exports = router;
