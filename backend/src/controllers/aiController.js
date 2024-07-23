const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config(); // Load environment variables
console.log(process.env.API_KEY);
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//function to display basic prompt using gemini-1.5-flash model
const getHelloGreeting = async (req, res) => {
  const prompt = req.body.userMessages;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  //send response to frontend
  res.send(text);
};

const generateInterviewQuestions = async (req, res) => {
  try {
    const { jobTitle, company } = req.body;

    // Initial prompt
    let prompt = `Generate an interview question for a ${jobTitle} position at ${company}. Start with "Tell me about yourself."`;

    // Array to store questions and answers
    const interviewData = [
      { question: "Tell me about yourself.", answer: null },
    ];

    // Loop to generate questions and handle answers
    for (let i = 0; i < 5; i++) {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const question = response.text().trim();

      // Add the new question to the interview data
      interviewData.push({ question: question, answer: null });

      // Send the question to the user (via Postman or other interface)
      res.json({
        question: question,
        expectedAnswer: `Please provide your answer to this question. \n\n **Next Request Body:**\n\`\`\`json\n{"jobTitle": "${jobTitle}", "company": "${company}", "answer": "YOUR_ANSWER" }\n\`\`\` `,
      });

      // Wait for the user's answer
      // (This would typically involve a user interface or asynchronous communication)
      await new Promise((resolve) => {
        // Wait for the next request
        req.on("data", (chunk) => {
          const data = JSON.parse(chunk);
          const candidateAnswer = data.answer;

          // Update the prompt with the candidate's answer
          prompt = `You are interviewing for a ${jobTitle} position at ${company}. The last question was: "${question}". The candidate responded: "${candidateAnswer}". Please ask the next interview question based on this information.`;

          // Store the answer in the interviewData array
          interviewData[i + 1].answer = candidateAnswer;

          resolve(); // Resolve the promise after getting the answer
        });
      });
    }

    // After the loop, return the complete interview data
    res.json({ interviewData });
  } catch (error) {
    console.error("Error generating interview questions:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const getFeedbackOnAnswer = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const prompt = `Given the interview question "${question}", provide feedback on the following answer: "${answer}". Focus on how the answer could be improved in terms of clarity, relevance, and impact.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const feedback = response.text();
    res.json({ feedback });
  } catch (error) {
    console.error("Error getting feedback on answer:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  generateInterviewQuestions,
  getFeedbackOnAnswer,
  getHelloGreeting,
};
