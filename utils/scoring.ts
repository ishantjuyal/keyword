type EnrichedKeyword = {
  keyword: string;
  intent: string;
  search_volume: number;
  cpc: number;
  competition: number;
};

type ScoredKeyword = EnrichedKeyword & {
  opportunity_score: number;
};

const intentWeights: Record<string, number> = {
  informational: 0.8,
  commercial: 1.0,
  transactional: 1.2,
  navigational: 0.6,
};

export function scoreKeywords(keywords: EnrichedKeyword[]): ScoredKeyword[] {
  const maxVolume = Math.max(...keywords.map(k => k.search_volume || 1));
  const maxCPC = Math.max(...keywords.map(k => k.cpc || 1));
  const maxCompetition = Math.max(...keywords.map(k => k.competition || 1));

  return keywords.map(k => {
    const normalizedVolume = k.search_volume / maxVolume;
    const normalizedCPC = k.cpc / maxCPC;
    const normalizedCompetition = k.competition / maxCompetition;

    const intentWeight = intentWeights[k.intent] || 1;

    const score = (normalizedVolume + normalizedCPC) / (normalizedCompetition + 0.2); // avoid div-by-zero
    const opportunity_score = Math.round(score * intentWeight * 100);

    return {
      ...k,
      opportunity_score,
    };
  });
}
