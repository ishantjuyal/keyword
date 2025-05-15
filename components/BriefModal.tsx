import React, { useEffect, useState } from "react";

type Props = {
  keyword: string;
  intent: string;
  onClose: () => void;
};

const BriefModal: React.FC<Props> = ({ keyword, intent, onClose }) => {
  const [brief, setBrief] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrief = async () => {
      try {
        const res = await fetch("/api/brief", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keyword, intent }),
        });
        const data = await res.json();
        setBrief(data);
      } catch (err) {
        setBrief({ error: "Failed to fetch brief." });
      } finally {
        setLoading(false);
      }
    };

    fetchBrief();
  }, [keyword, intent]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white max-w-2xl w-full p-6 rounded shadow-lg relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-2 right-3 text-xl font-bold">
          ×
        </button>
        <h2 className="text-xl font-semibold mb-2">Content Brief</h2>

        {loading && <p>Loading...</p>}

        {!loading && brief && !brief.error && (
          <div className="space-y-4 text-sm">
            {brief.title && (
              <div>
                <strong>Title:</strong> <div className="text-gray-800">{brief.title}</div>
              </div>
            )}
            {brief.tone && (
              <div>
                <strong>Tone:</strong> <div className="text-gray-700">{brief.tone}</div>
              </div>
            )}
            {brief.word_count_range && (
              <div>
                <strong>Word Count:</strong> {brief.word_count_range}
              </div>
            )}

            {Array.isArray(brief.outline) && (
              <div>
                <strong>Outline:</strong>
                <div className="mt-2 space-y-3">
                  {brief.outline.map((item: any, idx: number) => {
                    if (typeof item === "string") {
                      return <div key={idx}>• {item}</div>;
                    } else if (item.section_title && item.section_description) {
                      return (
                        <div key={idx}>
                          <h4 className="font-semibold">{item.section_title}</h4>
                          <p className="text-gray-700">{item.section_description}</p>
                        </div>
                      );
                    } else {
                      return <div key={idx}>{JSON.stringify(item)}</div>;
                    }
                  })}
                </div>
              </div>
            )}

            {Array.isArray(brief.ctas) && (
              <div>
                <strong>CTAs:</strong>
                <ul className="list-disc list-inside mt-1">
                  {brief.ctas.map((cta: string, idx: number) => (
                    <li key={idx}>{cta}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {!loading && brief?.error && (
          <p className="text-red-500 mt-4">{brief.error}</p>
        )}
      </div>
    </div>
  );
};

export default BriefModal;