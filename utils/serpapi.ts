const SERP_API_KEY = process.env.SERPAPI_KEY;

type KeywordWithIntent = {
  keyword: string;
  intent: string;
};

type EnrichedKeyword = {
  keyword: string;
  intent: string;
  search_volume: number;
  cpc: number;
  competition: number;
};

export async function enrichKeywords(
  keywords: KeywordWithIntent[],
  region: string
): Promise<EnrichedKeyword[]> {
  const enriched: EnrichedKeyword[] = [];

  for (const { keyword, intent } of keywords) {
    try {
      const response = await fetch(
        `https://serpapi.com/search.json?engine=google_autocomplete&q=${encodeURIComponent(
          keyword
        )}&location=${encodeURIComponent(region)}&api_key=${SERP_API_KEY}`
      );

      const mockMetrics = {
        search_volume: Math.floor(Math.random() * 1000) + 100,
        cpc: parseFloat((Math.random() * 5).toFixed(2)),
        competition: parseFloat(Math.random().toFixed(2)),
      };

      enriched.push({
        keyword,
        intent,
        ...mockMetrics,
      });
    } catch (err) {
      console.warn(`Failed to fetch metrics for "${keyword}", skipping.`);
    }
  }

  return enriched;
}