import React, { useState } from "react";
import Head from "next/head";
import Form from "../components/Form";
import KeywordCard from "../components/KeywordCard";
import BriefModal from "../components/BriefModal";

type Keyword = {
  keyword: string;
  intent: string;
  search_volume: number;
  cpc: number;
  competition: number;
  opportunity_score: number;
};

export default function Home() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);

  const handleFormSubmit = async (formData: any) => {
    setLoading(true);
    setKeywords([]);

    try {
      const res = await fetch("/api/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (Array.isArray(data.keywords)) {
      setKeywords(data.keywords);
      } else {
      console.error("Invalid response from /api/keywords:", data);
      setKeywords([]);
      }
    } catch (err) {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBrief = (keyword: string, intent: string) => {
    setSelectedKeyword(keyword);
    setSelectedIntent(intent);
  };

  const closeModal = () => {
    setSelectedKeyword(null);
    setSelectedIntent(null);
  };

  return (
    <>
      <Head>
        <title>Keyword Discovery Tool</title>
      </Head>
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">AI Keyword Discovery</h1>
        <Form onSubmitForm={handleFormSubmit} />

        {loading && <p className="mt-6 text-blue-500">⏳ Generating keywords…</p>}

        {Array.isArray(keywords) && keywords.length > 0 && (
        <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-sm text-left border border-gray-200 rounded overflow-hidden shadow">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                <tr>
                <th className="px-4 py-2">Keyword</th>
                <th className="px-4 py-2">Intent</th>
                <th className="px-4 py-2">Volume</th>
                <th className="px-4 py-2">CPC ($)</th>
                <th className="px-4 py-2">Competition</th>
                <th className="px-4 py-2">Opportunity Score</th>
                {/* <th className="px-4 py-2">Action</th> */}
                </tr>
            </thead>
            <tbody className="divide-y">
                {[...keywords]
                .sort((a, b) => b.opportunity_score - a.opportunity_score)
                .map((k, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{k.keyword}</td>
                    <td className="px-4 py-2 capitalize">{k.intent}</td>
                    <td className="px-4 py-2">{k.search_volume}</td>
                    <td className="px-4 py-2">${k.cpc.toFixed(2)}</td>
                    <td className="px-4 py-2">{k.competition.toFixed(2)}</td>
                    <td className="px-4 py-2 font-semibold text-green-700">{k.opportunity_score}</td>
                    {/* <td className="px-4 py-2">
                        <button
                        className="text-blue-600 hover:underline"
                        onClick={() => handleGenerateBrief(k.keyword, k.intent)}
                        >
                        Generate Brief
                        </button>
                    </td> */}
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
        )}
      </main>

      {selectedKeyword && selectedIntent && (
        <BriefModal
          keyword={selectedKeyword}
          intent={selectedIntent}
          onClose={closeModal}
        />
      )}
    </>
  );
}
