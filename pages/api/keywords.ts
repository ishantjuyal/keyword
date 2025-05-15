import type { NextApiRequest, NextApiResponse } from "next";
import { getSeedKeywords } from "../../utils/gpt";
import { enrichKeywords } from "../../utils/serpapi";
import { scoreKeywords } from "../../utils/scoring";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const input = req.body;

    // 1. Generate GPT keywords
    const seedKeywords = await getSeedKeywords(input);

    if (!Array.isArray(seedKeywords) || seedKeywords.length === 0) {
    console.error("GPT returned invalid or empty seed keywords:", seedKeywords);
    return res.status(500).json({ keywords: [] });
    }

    // 2. Get keyword metrics from SerpAPI
    const enrichedKeywords = await enrichKeywords(seedKeywords, input.region || "United States");

    // 3. Score the keywords
    const scored = scoreKeywords(enrichedKeywords);

    return res.status(200).json({ keywords: scored });
  } catch (error: any) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Something went wrong." });
  }
}