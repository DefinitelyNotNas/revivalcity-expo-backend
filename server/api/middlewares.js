const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// Token Verification Middleware
const verifyToken = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res
				.status(401)
				.json({ success: false, message: "No token provided" });
		}

		const token = authHeader.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		req.userId = decoded.id;
		next();
	} catch (error) {
		console.error("Auth error:", error);
		res
			.status(401)
			.json({ success: false, message: "Invalid or expired token" });
	}
};

const adminAuth = (req, res, next) => {
	if (req.user && req.user.role === "admin") {
		next();
	} else {
		res.status(403).send("Access denied");
	}
};

module.exports = { verifyToken, adminAuth };
