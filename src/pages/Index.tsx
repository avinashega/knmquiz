import { useState } from "react";
import { allQuestions } from "@/data/quizData";
import { QuizCard } from "@/components/QuizCard";
import { LanguageSelector } from "@/components/LanguageSelector";
import { GameCreator } from "@/components/GameCreator";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Brain } from "lucide-react";

const Index = () => {
  const [showPractice, setShowPractice] = useState(false);
  const [showMultiplayer, setShowMultiplayer] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'dutch' | 'english'>('dutch');

  if (showPractice) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Button 
            onClick={() => setShowPractice(false)} 
            className="mb-4"
            variant="outline"
          >
            ← Back
          </Button>
          <div className="space-y-4">
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
            <QuizCard
              question={allQuestions[0]}
              selectedLanguage={selectedLanguage}
              onNext={() => {}}
              onScore={() => {}}
              timePerQuestion={30}
            />
          </div>
        </div>
      </div>
    );
  }

  if (showMultiplayer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => setShowMultiplayer(false)} 
          className="mb-4"
          variant="outline"
        >
          ← Back
        </Button>
        <GameCreator />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Dutch Quiz Game</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowPractice(true)}>
            <Brain className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Practice Mode</h2>
            <p className="text-gray-600">Practice Dutch questions at your own pace</p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowMultiplayer(true)}>
            <Users className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Multiplayer Mode</h2>
            <p className="text-gray-600">Challenge friends in real-time quizzes</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;