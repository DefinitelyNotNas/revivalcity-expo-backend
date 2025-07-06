const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { client } = require("../db/index");
const JWT_SECRET = process.env.JWT_SECRET;

const { verifyToken } = require("./middlewares");

// Register Route
router.post("/register", async (req, res) => {
	try {
		const { name, email, password } = req.body;
		if (!name || !email || !password) {
			return res
				.status(400)
				.json({ error: "All fields are required" });
		}
		const hashed = await bcrypt.hash(password, 10);
		const existing = await client.query(
			`SELECT id FROM users WHERE email = $1`,
			[email]
		);
		if (existing.rows.length) {
			return res
				.status(400)
				.json({ error: "Email already registered" });
		}

		await client.query(
			`INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`,
			[name, email, hashed]
		);

		res.status(201).json({ message: "User registered" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Registration failed" });
	}
});

// Login Route
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		const { rows } = await client.query(
			`SELECT id, name, email, password FROM users WHERE email = $1
            `,
			[email]
		);

		const user = rows[0];
		if (!user)
			return res.status(400).json({ error: "Invalid credentials" });

		const match = await bcrypt.compare(password, user.password);
		if (!match)
			return res.status(400).json({ error: "Invalid credentials" });

		const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
			expiresIn: "7d",
		});

		res.json({
			token,
			user: { id: user.id, name: user.name, email: user.email },
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Login failed" });
	}
});

// Get current user
router.get("/me", verifyToken, async (req, res, next) => {
	try {
		const SQL = `SELECT id, name, email FROM users WHERE id = $1
        `;
		const user = await client.query(SQL, [req.userId]);
		res.json(user.rows[0]);
	} catch (err) {
		console.error("Error fetching user", err.message);
		res.status(500).send({ error: "Unable to fetch user info" });
	}
});

module.exports = router;
