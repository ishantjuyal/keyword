import type { NextApiRequest, NextApiResponse } from "next";

// ======== Gemini Setup (Active) ========
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// ======== OpenAI Setup (Commented Out) ========
// import OpenAI from "openai";
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { keyword, intent } = req.body;

  const prompt = `
You are a professional SEO content strategist.
Given the following keyword: "${keyword}" with the intent: "${intent}"

Please generate a detailed content brief with:
1. A suggested SEO-friendly title
2. A section-wise outline (4–6 sections)
3. Suggested calls to action (CTAs)
4. Tone of voice guidance (e.g., casual, expert, persuasive)
5. Word count range

Return this as a structured JSON object with keys:
"title", "outline", "ctas", "tone", "word_count_range"
Return only a valid JSON object, without wrapping it in markdown or backticks. 
`.trim();

  try {
    // ======== Gemini (active) ========
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log("Gemini brief raw:", text);

    // Clean up potential markdown code block
    const cleaned = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    const json = JSON.parse(cleaned);
    return res.status(200).json(json);

    // ======== OpenAI (optional) ========
    // const response = await openai.chat.completions.create({
    //   model: "gpt-4",
    //   messages: [{ role: "user", content: prompt }],
    //   temperature: 0.7,
    // });
    // const raw = response.choices[0].message?.content || "{}";
    // const json = JSON.parse(raw);
    // return res.status(200).json(json);

  } catch (err: any) {
    console.error("❌ Brief API error:", err);
    return res.status(500).json({ error: "Failed to generate brief." });
  }
}
