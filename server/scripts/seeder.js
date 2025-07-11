require("dotenv").config();
const axios = require("axios");

const PC_API_BASE =
	"https://api.planningcenteronline.com/calendar/v2";
const YOUR_API_BASE =
	process.env.API_BASE_URL || "http://localhost:3000/api";

const seedEvents = async () => {
	try {
		// 1. Fetch from Church Center
		const pcResponse = await axios.get(`${PC_API_BASE}/events`, {
			auth: {
				username: process.env.PCO_KEY,
				password: process.env.PCO_SECRET,
			},
		});

		const events = pcResponse.data.data;

		// 2. Loop and send to your own API
		for (const event of events) {
			const formatted = {
				title: event.attributes.name,
				description: event.attributes.description,
				location: event.attributes.location,
				image_url: event.attributes.image_url || "", // adjust if needed
			};

			await axios.post(`${YOUR_API_BASE}/events`, formatted);
			console.log(`Seeded event: ${formatted.title}`);
		}

		console.log("✅ All events seeded.");
	} catch (err) {
		console.error(
			"Seeding failed:",
			err.response?.data || err.message
		);
	}
};

seedEvents();
