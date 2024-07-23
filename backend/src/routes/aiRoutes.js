const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");


//print req.body
router.post("/chatbot", aiController.getHelloGreeting);

module.exports = { router };
