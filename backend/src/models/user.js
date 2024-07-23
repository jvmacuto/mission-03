const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"], // Email validation
  },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);

// these code to store the output (answer and feedback to database)
// const interviewSchema = new mongoose.Schema({
//   jobTitle: String,
//   company: String,
//   question: String,
//   answer: String,
//   feedback: String,
//   createdAt: { type: Date, default: Date.now } // Timestamp for tracking
// });

// const Interview = mongoose.model('Interview', interviewSchema);
