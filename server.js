const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Health check route
app.get("/", (req, res) => {
  res.send("🚀 Gemini Chatbot API is running.");
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      error: "AI service error",
      details: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port} or on your deployed URL`);
});
