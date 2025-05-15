import React from "react";

type Props = {
  keyword: string;
  intent: string;
  search_volume: number;
  cpc: number;
  competition: number;
  opportunity_score: number;
  onGenerateBrief: (keyword: string, intent: string) => void;
};

const KeywordCard: React.FC<Props> = ({
  keyword,
  intent,
  search_volume,
  cpc,
  competition,
  opportunity_score,
  onGenerateBrief,
}) => {
  return (
    <div className="border p-4 rounded shadow-sm space-y-2">
      <h3 className="text-lg font-semibold">{keyword}</h3>
      <div className="text-sm text-gray-600 capitalize">Intent: {intent}</div>
      <div className="text-sm">🔎 Volume: {search_volume}</div>
      <div className="text-sm">💰 CPC: ${cpc}</div>
      <div className="text-sm">⚔️ Competition: {competition}</div>
      <div className="text-sm font-bold">
        🔥 Opportunity Score: {opportunity_score}
      </div>
      <button
        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm"
        onClick={() => onGenerateBrief(keyword, intent)}
      >
        Generate Content Brief
      </button>
    </div>
  );
};

export default KeywordCard;