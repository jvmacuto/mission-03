import { useEffect, useState, useRef } from "react";
import "../styles/chatbot.css";
import axios from "axios";

const Chatbot = () => {
  const [initialPrompt, setInitialPrompt] = useState([]);
  const [userMessages, setUserMessages] = useState([]);
  const [aiMessages, setAiMessages] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  //combine messages from user and ai
  let [combinedMessages, setCombinedMessages] = useState([
    { sender: "bot", text: "Tell me about yourself." },
  ]);

  //update job title on change
  const handleJobTitleChange = (e) => {
    setJobTitle(e.target.value);
  };

  // Function to send message to chatbot
  const sendMessage = (e) => {
    e.preventDefault();
    console.log(jobTitle);
    console.log("Click button ran here!");

    // Check if input is empty
    if (!input.trim()) return;

    //add question count to limit questions
    setQuestionCount(questionCount + 1);

    // Add user message to state and clear input field
    const newUserMessage = {
      sender: "user",
      text: input,
      timestamp: Date.now(),
    };

    //add user message to state
    const newUserMessages = [...userMessages, newUserMessage];
    setUserMessages(newUserMessages);

    //clear input field
    setInput("");

    //send jobtitle and user message to backend
    const payload = {
      jobTitle: jobTitle,
      userMessages: input,
    };

    //send user message to backend 6 times
    if (questionCount < 6) {
      fetch("http://localhost:3000/generateInterviewQuestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.text())
        .then((question) => {
          const newAiMessage = {
            sender: "ai",
            text: question,
            timestamp: Date.now(),
          };
          setAiMessages((prevAiMessages) => [...prevAiMessages, newAiMessage]);
        })
        .catch((err) => console.log(err));
    }

    //stop interview questions and provide feedback
    else if (questionCount === 6) {
      const newAiMessage = {
        sender: "ai",
        text: "Thank you for chatting with me! I will now provide your feedback.",
        timestamp: Date.now(),
      };
      setAiMessages((prevAiMessages) => [...prevAiMessages, newAiMessage]);

      // Combine all user messages into one string
      const combinedUserMessages = userMessages.reduce(
        (acc, message) => acc + " " + message.text,
        ""
      );

      // Send combined user messages to getFeedbackOnAnswer endpoint
      fetch("http://localhost:3000/getFeedbackOnAnswer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userMessages: combinedUserMessages }),
      })
        .then((response) => {
          // Check if the response is JSON
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            return response.json();
          } else {
            return response.text();
          }
        })
        .then((feedback) => {
          const feedbackMessage = {
            sender: "ai",
            text:
              typeof feedback === "string"
                ? feedback
                : JSON.stringify(feedback),
            timestamp: Date.now(),
          };
          setAiMessages((prevAiMessages) => [
            ...prevAiMessages,
            feedbackMessage,
          ]);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Function to toggle chatbot modal
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
  combinedMessages = [...userMessages, ...aiMessages].sort(
    (a, b) => a.timestamp - b.timestamp
  );

  //initial prompt
  const fetchGreetings = async () => {
    try {
      const response = await axios.post("http://localhost:3000/chatbot", {
        userMessages: `Generate an interview question for a ${jobTitle} position. Start with "Tell me about yourself."`,
      });
      setInitialPrompt(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchGreetings();
  }, []);

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
            {initialPrompt && <div className="ai-message">{initialPrompt}</div>}
            {combinedMessages.map((message, index) => (
              <div key={index} className={`${message.sender}-message`}>
                {message.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="submit-message">
            <textarea
              ref={textareaRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
              rows={1}
              style={{ overflow: "hidden", resize: "none" }}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
