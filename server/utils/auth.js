const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.SECRET;
const exp = "72h";

module.exports = {
    // returns signed token
	signToken: function ({ _id, username }) {
		const payload = { _id, username };

		return jwt.sign({ data: payload }, secret, { expiresIn: exp });
	},

	// read and respond to presence/absence of token
	authMiddleware: function ({ req, res }) {
		let token = req.body.token || req.query.token || req.headers.authorization;

		if (req.headers.authorization) {
			token = token.split(" ").pop().trim();
		}

		if (!token) {
			// return res.status(400).json({ message: 'No token.' });
			req.user = null;
			return req;
		}

		// verify and get user data
		try {
			const { data } = jwt.verify(token, secret, { maxAge: exp });
			req.user = data;
		} catch {
			return res.status(401).json({ message: "Invalid token." });
		}

		return req;
	}
};
