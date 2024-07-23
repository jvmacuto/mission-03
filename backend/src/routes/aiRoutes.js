const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

//print req.body
router.post("/chatbot", aiController.getHelloGreeting);
router.post("/generateInterviewQuestions", aiController.generateInterviewQuestions);
router.post("/getFeedbackOnAnswer", aiController.getFeedbackOnAnswer);

module.exports = { router };
