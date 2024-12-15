import { useState } from "react";
import { allQuestions } from "@/data/quizData";
import { QuizCard } from "@/components/QuizCard";
import { LanguageSelector } from "@/components/LanguageSelector";

const Index = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'dutch' | 'english'>('dutch');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Dutch Quiz Game</h1>
        <div className="text-center mb-8">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            onClick={() => setShowDemo(!showDemo)}
          >
            {showDemo ? "Hide Demo" : "Show Demo"}
          </button>
        </div>

        {showDemo && (
          <div className="space-y-4">
            <LanguageSelector
              language={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
            <QuizCard
              question={allQuestions[0]}
              language={selectedLanguage}
              onNext={() => {}}
              onScore={() => {}}
              timePerQuestion={30}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;