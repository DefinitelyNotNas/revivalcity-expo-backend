const express = require("express");
const router = express.Router();

const {
	fetchAllEvents,
	addEvent,
	deleteEvent,
	getEventById,
	fetchUpcomingEvents,
	registerForEvent,
} = require("../db/events");
