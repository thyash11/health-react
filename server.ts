import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Meal Parsing Endpoint
  app.post("/api/parse-meal", async (req, res) => {
    try {
      const { text, mealType, logDate } = req.body;
      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Text description is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "GEMINI_API_KEY environment variable is missing",
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `
You are a precision nutrition AI assistant specializing in meal logging, particularly Indian & international cuisines.
The user described their meal: "${text}".
Meal Type hint: "${mealType || 'auto'}"
Log Date: "${logDate || 'today'}"

Break down this description into individual food items with accurate estimated nutritional values.
Respond STRICTLY with JSON matching this structure:
{
  "items": [
    {
      "foodItem": "Name of food item (e.g. Cooked White Rice, Ghee Podi Idli, Sambar)",
      "category": "Category from: Breakfast, Chutney, Grain, Protein, Dessert, Snack, Bakery, Added Sugar, Fruit, Dal/Curry, Sugary Drink, Added Fat, Vegetable, Beverage, Other",
      "quantity": 150, // estimated quantity in grams or ml
      "unit": "g" // "g" or "ml"
      "calories": 210,
      "protein": 4.5,
      "carbs": 45.0,
      "fat": 1.2,
      "fiber": 1.5,
      "water": 0,
      "notes": "Short note e.g. 1 bowl"
    }
  ],
  "suggestedMeal": "Breakfast | Lunch | Evening Snack | Mid snack | Dinner | Drink | Other"
}

Ensure numbers are plausible floats/integers. Return ONLY valid JSON, no markdown formatting outside JSON.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "{}";
      const parsedData = JSON.parse(responseText);

      return res.json({ success: true, data: parsedData });
    } catch (err: any) {
      console.error("Error parsing meal with Gemini:", err);
      return res.status(500).json({
        error: "Failed to parse meal description using AI.",
        details: err?.message || String(err),
      });
    }
  });

  // AI Health Insight Endpoint
  app.post("/api/health-insights", async (req, res) => {
    try {
      const { userProfile, targets, recentLogs, labTests } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      const prompt = `
You are a medical nutrition and health performance analyst. Analyze this user's profile and data:
User Profile: ${JSON.stringify(userProfile)}
Targets: ${JSON.stringify(targets)}
Recent Logs Summary: ${JSON.stringify(recentLogs)}
Lab Tests: ${JSON.stringify(labTests)}

Provide 3 actionable, empathetic, and evidence-based personalized recommendations:
1) Nutrition & Calorie management
2) Macro & Fiber optimization for blood lipid/glucose safety (noting cholesterol/HDL if present)
3) Behavioral & Meal timing advice (e.g. shifting dinner earlier, walk habit).

Keep the output in structured JSON format:
{
  "summary": "1-2 sentence high level health progress evaluation",
  "recommendations": [
    { "category": "Nutrition", "title": "...", "advice": "..." },
    { "category": "Lipid / Heart Health", "title": "...", "advice": "..." },
    { "category": "Habits & Timing", "title": "...", "advice": "..." }
  ]
}
Return valid JSON only.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ success: true, data: parsed });
    } catch (err: any) {
      console.error("Error generating health insights:", err);
      return res.status(500).json({ error: "Failed to generate health insights" });
    }
  });

  // Vite middleware in dev
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
