import { useState } from "react";
import { GameCreator } from "@/components/GameCreator";
import { QuizCard } from "@/components/QuizCard";
import { allQuestions } from "@/data/quizData";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LanguageSelector";

const Index = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'dutch' | 'english'>('english');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Dutch Language Quiz
        </h1>

        <GameCreator />

        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => setShowDemo(!showDemo)}
            className="mb-4"
          >
            {showDemo ? "Hide Demo" : "Try Demo Question"}
          </Button>

          {showDemo && (
            <div className="space-y-4">
              <LanguageSelector
                selectedLanguage={selectedLanguage}
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
    </div>
  );
};

export default Index;