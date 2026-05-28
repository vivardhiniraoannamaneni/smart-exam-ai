import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: '.env' });

console.log("ENV:", process.env);
console.log("KEY:", process.env.GEMINI_API_KEY);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize the recommended server-side Gemini API client
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});
}

const ai = new GoogleGenAI({
  apiKey,
});

// Helper response handler
const fallbackErrorResponse = (res: any, error: any, customMsg: string) => {
  console.error(customMsg, error);
  res.status(500).json({ error: customMsg, details: error?.message || error });
};

// 1. AI Doubt Solver Endpoint
app.post("/api/ask", async (req, res) => {
  try {
    const { question, history } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required." });
    }

    // Format optional conversation history for the AI
    let contextPrompt = "";
    if (history && Array.isArray(history) && history.length > 0) {
      contextPrompt = "Previous Conversation History:\n" + history.map(h => `${h.sender === "user" ? "Student" : "Assistant"}: ${h.text}`).join("\n") + "\n\n";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `${contextPrompt}Please answer the following exam-prep or conceptual student question clearly, simply, and with helpful explanations:\nQuestion: ${question}`,
      config: {
        systemInstruction: "You are an elite, encouraging AI Exam Assistant. Always structure response with markdown, clear headings, bold terms, and optional short bullet points. Be precise.",
      }
    });

    res.json({ answer: response.text || "No response generated." });
  } catch (error) {
    fallbackErrorResponse(res, error, "AI Doubt Solver error");
  }
});

// 2. AI Mind Map Generation
app.post("/api/generate-mindmap", async (req, res) => {
  try {
    const { notes, topic } = req.body;
    const searchSource = notes ? `custom studying notes:\n"${notes}"` : `the general topic: "${topic || "High School Science"}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Create a comprehensive, logical study mind map representing core subtopics and key definitions based on ${searchSource}. Avoid deeply nested trees, keep nodes clean and hierarchically linked.`,
      config: {
        systemInstruction: "You are a visual design learning strategist. Create an actionable list of interconnected mind map nodes representing concept paths.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "Unique alphanumeric slug/id, e.g. 'root', 'joins', 'deadlock'" },
              label: { type: Type.STRING, description: "Short descriptive label for the node, e.g. SQL Joins" },
              parentId: { type: Type.STRING, description: "Parent id. Should be null or empty string for the root main topic node." },
              notes: { type: Type.STRING, description: "Single-sentence concise explanation or study tip for this node." }
            },
            required: ["id", "label"]
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text || "[]");
    res.json({ nodes: parsedData });
  } catch (error) {
    fallbackErrorResponse(res, error, "AI Mind Map generator error");
  }
});

// 3. Key Point Extractor
app.post("/api/generate-keypoints", async (req, res) => {
  try {
    const { notes, topic } = req.body;
    const searchSource = notes ? `custom studying notes:\n"${notes}"` : `the general study topic: "${topic || "General revision"}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Extract the most critical learning takeaways and foundational concepts based on ${searchSource}. Provide 3 to 6 high-yield key items.`,
      config: {
        systemInstruction: "You are an academic summary expert. Distil notes into high-impact point summaries.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "Unique string id" },
              point: { type: Type.STRING, description: "The core takeaway sentence, short and snappy." },
              explanation: { type: Type.STRING, description: "A high-yield detail/example helping understand the takeaway." }
            },
            required: ["id", "point", "explanation"]
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text || "[]");
    res.json({ keyPoints: parsedData });
  } catch (error) {
    fallbackErrorResponse(res, error, "Key Point Extractor error");
  }
});

// 4. Formula Extractor
app.post("/api/generate-formulas", async (req, res) => {
  try {
    const { notes, topic } = req.body;
    const searchSource = notes ? `custom studying notes:\n"${notes}"` : `theme/course: "${topic || "Physics & Math Formulas"}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate or extract formulas, math expressions, equations, rules, or cheatsheet definitions for ${searchSource}. Return 3 to 6 critical formulas.`,
      config: {
        systemInstruction: "You are a quantitative study guide compiler. Identify formulas, mathematical rules, physics models, or quick rule mappings.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "Formula slug" },
              name: { type: Type.STRING, description: "Formula or rule name, e.g. Newton's Second Law" },
              expression: { type: Type.STRING, description: "The mathematical, chemical, logical or syntactic expression, e.g. F = m * a" },
              description: { type: Type.STRING, description: "Short explanation of variables or context of usage." }
            },
            required: ["id", "name", "expression", "description"]
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text || "[]");
    res.json({ formulas: parsedData });
  } catch (error) {
    fallbackErrorResponse(res, error, "Formula Extractor error");
  }
});

// 5. One Night Before Exam Mode (Quick Cheat Sheets + Mock Questions)
app.post("/api/one-night-mode", async (req, res) => {
  try {
    const { notes, topic } = req.body;
    const searchSource = notes ? `custom studying notes:\n"${notes}"` : `subject theme: "${topic || "Computer Science Overview"}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Compile a quick "one night before" crash sheet based on ${searchSource}. You must output a structured cheat sheet object containing important predicted mock questions, critical rapid formulas/laws, and highly memorable revision points.`,
      config: {
        systemInstruction: "You are an expert tutor providing a night-before hyper-focused survival study bundle. Extract pure high-yield core materials.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            importantQuestions: {
              type: Type.ARRAY,
              description: "Top 3 predicted high-probability exam questions with very crisp, simple short answers.",
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING }
                },
                required: ["question", "answer"]
              }
            },
            formulaSheet: {
              type: Type.ARRAY,
              description: "Must-memorize dynamic formula or rules list.",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  expression: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["id", "name", "expression", "description"]
              }
            },
            quickRevision: {
              type: Type.ARRAY,
              description: "Short, punching revision punch lines (max 4). Only include essential tips or memory tricks.",
              items: { type: Type.STRING }
            }
          },
          required: ["importantQuestions", "formulaSheet", "quickRevision"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error) {
    fallbackErrorResponse(res, error, "One Night Mode error");
  }
});


// Vite middleware for dev server integration, static assets serving in prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical server bootstrap error:", err);
});
