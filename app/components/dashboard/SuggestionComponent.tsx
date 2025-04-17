import { X, Zap, AlertCircle } from "lucide-react";

const suggestions = [
  {
    icon: <Zap className="text-white" />,
    title: "High energy consumption",
    description: "The office has consume 15% more energy compare to last week",
  },
  {
    icon: <AlertCircle className="text-white" />,
    title: "Unbalanced Energy supply",
    description: "Grid energy proportion 16% more than solar energy",
  },
];

const SuggestionsCard = () => {
  return (
    <div className="bg-[#1E1E1E] rounded-2xl shadow-xl p-4 w-full max-w-sm h-[200px] overflow-hidden flex flex-col">
      <h2 className="text-white text-xl font-semibold mb-4">Suggestion</h2>
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 scroll-custom">
        {suggestions.map((s, idx) => (
          <div
            key={idx}
            className="border border-primary-tint-500 bg-primary-neon-tint-400 rounded-xl p-3 flex items-start justify-between text-white gap-3"
          >
            <div className="flex-shrink-0 mt-1">{s.icon}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-[15px]">{s.title}</h3>
              <p className="text-[12px] font-light text-gray-300">{s.description}</p>
            </div>
            <button className="flex-shrink-0 text-white hover:text-red-400 transition">
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionsCard;
