const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// Token Verification Middleware
const verifyToken = (req, res, next) => {
	try {
		const token = req.headers.authorization?.split(" ")[1];
		if (!token)
			return res.status(401).json({ error: "No token provided" });

		const decoded = jwt.verify(token, JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		res.status(401).json({ error: "Invalid or expired token" });
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
