const express = require("express");

const aiRoutes = require("./routes/aiRoutes");

const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getHelloGreeting } = require("./controllers/aiController");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Middleware
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Database connection
/*if (process.env.NODE_ENV !== "test") {
  mongoose.connect("mongodb://localhost:27017/yourdbname", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}*/
//commented for testing purposes

app.use("/", aiRoutes.router);
//aiRoutes
//app.use("/", aiRoutes.router);

//chatbot endpoint to display user input
/*app.post("/chatbot", (req, res) => {
  //display hello if body is true
  console.log(req.body);
  if (req.body) {
    res.send("Hello");
  }
});*/ //commented to get req.body from front end

const PORT = 3000; // Ensure this is set to 3000
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
