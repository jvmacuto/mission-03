const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config(); // Load environment variables
console.log(process.env.API_KEY);
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//function to display basic prompt using gemini-1.5-flash model
const getHelloGreeting = async (req, res) => {
  const initialPrompt = req.body.userMessages;
  const result = await model.generateContent(initialPrompt);
  const response = await result.response;
  const text = response.text();

  //send response to frontend
  res.send(text);
};

const generateInterviewQuestions = async (req, res) => {
  try {
    const { jobTitle, userMessages } = req.body;

    // Generate a single interview question
    const prompt = `Generate an interview question for a ${jobTitle} position based on the following user input: ${userMessages}, in one sentence. Remove any backticks and braces`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // Send the question to the frontend
    res.send(text);
  } catch (error) {
    console.error("Error generating interview question:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getFeedbackOnAnswer = async (req, res) => {
  //get job title and usermessage
  const { jobTitle, userMessages } = req.body;
  //generate prompt based on user jobtitle and usermessage
  const prompt = `Provide feedback on the following user response for a ${jobTitle} position: ${userMessages}.`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();

  //send response to frontend
  res.send(text);
};

module.exports = {
  generateInterviewQuestions,
  getFeedbackOnAnswer,
  getHelloGreeting,
};
