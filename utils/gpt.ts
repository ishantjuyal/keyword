// ======== OpenAI (Commented out) ========
// import OpenAI from "openai";
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

// ======== Gemini Setup (Active) ========
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

type FormData = {
  business_description: string;
  website_url?: string;
  competitors?: string;
  target_audience?: string;
  audience_problem?: string;
  your_solution?: string;
  goal?: string;
  region?: string;
};

export async function getSeedKeywords(input: FormData) {
  const {
    business_description,
    target_audience = "N/A",
    audience_problem = "N/A",
    your_solution = "N/A",
    competitors = "N/A",
    goal = "N/A",
    region = "N/A",
  } = input;

  const prompt = `
You are an expert SEO strategist.

Here is a description of a business:
"${business_description}"

Target audience: ${target_audience}
Biggest problem faced by the audience: ${audience_problem}
Solution the business provides: ${your_solution}
Competitors: ${competitors}
Goal: ${goal}
Region: ${region}

Please output a list of 8–12 SEO-relevant seed topics or short-tail keywords that this business should target.
For each keyword, also classify the intent as one of the following:
- informational
- commercial
- navigational
- transactional

Return only a valid JSON array like:
[
  { "keyword": "example", "intent": "informational" }
]

Return only valid JSON, and do not wrap it in markdown-style code blocks.
`.trim();

  try {
    // ======== Gemini (active) ========
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log("Gemini raw response:", text);

    // Remove code block wrapper if present
    const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")   // remove opening ```json (case insensitive)
    .replace(/\s*```$/, "")             // remove trailing ```
    .trim();
    try {
      return JSON.parse(cleaned);
    } catch (err) {
      console.error("❌ JSON parse failed. Raw Gemini output:\n", text);
      console.error("🧼 After cleaning:\n", cleaned);
      return [];
    }

    // ======== OpenAI (optional) ========
    // const response = await openai.chat.completions.create({
    //   model: "gpt-4",
    //   messages: [{ role: "user", content: prompt }],
    //   temperature: 0.7,
    // });
    // const raw = response.choices[0].message?.content || "[]";
    // console.log("OpenAI raw response:", raw);
    // return JSON.parse(raw);

  } catch (err) {
    console.error("Keyword generation error:", err);
    return [];
  }
}