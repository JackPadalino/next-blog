const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY);

const gemini = genAI.getGenerativeModel({ model: "embedding-001" });

export default gemini;
