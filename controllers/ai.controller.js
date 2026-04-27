const Groq = require("groq-sdk");
const dotenv = require("dotenv");
dotenv.config();

// Initialize the Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// 1. Virtual Tour Guide (Chatbot)
const chatWithGuide = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are Zentra, a highly knowledgeable, friendly, and concise AI travel guide. You help users plan trips, learn about destinations, and offer cultural tips. Keep your answers under 3 paragraphs.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama-3.1-8b-instant", // Fast and highly capable model
      temperature: 0.7,
    });

    return res.status(200).json({
      reply:
        chatCompletion.choices[0]?.message?.content ||
        "I'm sorry, I couldn't process that request.",
    });
  } catch (err) {
    return res.status(500).json({ message: "AI Error", error: err.message });
  }
};

// 2. Smart Itinerary Generator (Returns strictly formatted JSON)
const generateItinerary = async (req, res) => {
  try {
    const { destination, days, budget, interests } = req.body;

    if (!destination || !days) {
      return res
        .status(400)
        .json({ error: "Destination and days are required." });
    }

    const prompt = `
      Create a ${days}-day travel itinerary for ${destination}. 
      The budget is ${budget || "moderate"} and the traveler is interested in: ${interests || "general sightseeing"}.
      
      You MUST respond ONLY with a valid JSON array. Do not include any conversational text, markdown formatting like \`\`\`json, or explanations. 
      The JSON array must contain objects with the following keys: "day" (number), "title" (string), and "activities" (array of 3 short strings).
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a JSON-only API. Only output raw JSON.",
        },
        { role: "user", content: prompt },
      ],
      model: "llama-3.1-8b-instant", // Mixtral is exceptionally good at following strict JSON formats
      temperature: 0.2, // Low temperature for consistent formatting
    });

    // Parse the stringified JSON returned by Groq into an actual JavaScript object
    const itineraryJSON = JSON.parse(completion.choices[0]?.message?.content);

    return res.status(200).json({
      message: "Itinerary generated successfully",
      itinerary: itineraryJSON,
    });
  } catch (err) {
    return res.status(500).json({
      message:
        "Failed to generate itinerary. The AI might have returned malformed data.",
      error: err.message,
    });
  }
};

module.exports = { chatWithGuide, generateItinerary };
