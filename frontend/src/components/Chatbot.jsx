import { useEffect, useState, useRef } from "react";
import "../styles/chatbot.css";
import axios from "axios";

const Chatbot = () => {
  const [userMessages, setUserMessages] = useState([]);
  const [aiMessages, setAiMessages] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);

  //update job title on change
  const handleJobTitleChange = (e) => {
    setJobTitle(e.target.value);
  };

  // Function to send message to chatbot
  const sendMessage = (e) => {
    e.preventDefault();
    console.log(jobTitle);
    console.log("Click button ran here!");
    if (!input.trim()) return;

    // Add user message to state and clear input field
    const newUserMessage = {
      sender: "user",
      text: input,
      timestamp: Date.now(),
    };
    const newUserMessages = [...userMessages, newUserMessage];
    setUserMessages(newUserMessages);
    setInput("");

    //send jobtitle and user message to backend
    const payload = {
      jobTitle: jobTitle,
      userMessages: input,
    };
    axios
      .post("http://localhost:3000/chatbot", payload)
      .then((res) => {
        const newAiMessage = {
          sender: "ai",
          text: res.data,
          timestamp: Date.now(),
        };
        const newAiMessages = [...aiMessages, newAiMessage];
        setAiMessages(newAiMessages);
      })
      .catch((err) => console.log(err));
  };

  // Function to toggle chatbot
  const toggleChatbot = () => {
    setIsExpanded(!isExpanded);
    const chatbot = document.getElementById("chatbot-container");
    if (isExpanded) {
      chatbot.classList.remove("expanded");
    } else {
      chatbot.classList.add("expanded");
    }
  };

  //combine messages
  const combinedMessages = [...userMessages, ...aiMessages].sort(
    (a, b) => a.timestamp - b.timestamp
  );

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [combinedMessages]);
  return (
    <>
      {!isExpanded && (
        <div id="chatbot-modal" onClick={toggleChatbot}>
          Click to Chat
        </div>
      )}

      {isExpanded && (
        <div className="chatbot-container expanded">
          <div className="chat-header">
            <span>Chat with us!</span>
            <div className="control-buttons">
              <button className="control-button" onClick={toggleChatbot}>
                _
              </button>
            </div>
          </div>
          <div className="chat-title">
            <p>Job Title:</p>
            <input
              type="text"
              placeholder="Enter your job name..."
              value={jobTitle}
              onChange={handleJobTitleChange}
            />
          </div>
          {/* Render messages and input field for new messages here */}
          <div className="messages-container">
            {combinedMessages.map((message, index) => (
              <div key={index} className={`${message.sender}-message`}>
                {message.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="submit-message">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage(e);
                }
              }}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
