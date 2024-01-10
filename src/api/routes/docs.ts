import express from "express";

const router = express.Router();
const swaggerSpec = require("../swagger");

router.get("/", async (req, res) => {
	res.setHeader("Content-type", "application/json");
	res.send(swaggerSpec);
});

module.exports = router;
