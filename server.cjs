var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_url = require("url");
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_meta = {};
import_dotenv.default.config();
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = import_path.default.dirname(__filename);
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.post("/api/parse-meal", async (req, res) => {
    try {
      const { text, mealType, logDate } = req.body;
      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Text description is required" });
      }
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "GEMINI_API_KEY environment variable is missing"
        });
      }
      const ai = new import_genai.GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      const prompt = `
You are a precision nutrition AI assistant specializing in meal logging, particularly Indian & international cuisines.
The user described their meal: "${text}".
Meal Type hint: "${mealType || "auto"}"
Log Date: "${logDate || "today"}"

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
          responseMimeType: "application/json"
        }
      });
      const responseText = response.text || "{}";
      const parsedData = JSON.parse(responseText);
      return res.json({ success: true, data: parsedData });
    } catch (err) {
      console.error("Error parsing meal with Gemini:", err);
      return res.status(500).json({
        error: "Failed to parse meal description using AI.",
        details: err?.message || String(err)
      });
    }
  });
  app.post("/api/health-insights", async (req, res) => {
    try {
      const { userProfile, targets, recentLogs, labTests } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
      }
      const ai = new import_genai.GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
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
          responseMimeType: "application/json"
        }
      });
      const parsed = JSON.parse(response.text || "{}");
      return res.json({ success: true, data: parsed });
    } catch (err) {
      console.error("Error generating health insights:", err);
      return res.status(500).json({ error: "Failed to generate health insights" });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
