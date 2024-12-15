import { useState } from "react";
import { allQuestions } from "@/data/quizData";
import { QuizCard } from "@/components/QuizCard";
import { LanguageSelector } from "@/components/LanguageSelector";
import { GameCreator } from "@/components/GameCreator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<'dutch' | 'english'>('dutch');

  const handleNextQuestion = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setCurrentQuestionIndex(0); // Reset to first question when reaching the end
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <img 
            src="/knm-logo.png" 
            alt="KNM Quiz Logo" 
            className="h-24 mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold text-center mb-4">KNM Quiz</h1>
          <p className="text-gray-600">Test your knowledge of Dutch society</p>
        </div>

        <Tabs defaultValue="practice" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="practice">Practice Mode</TabsTrigger>
            <TabsTrigger value="multiplayer">Multiplayer Mode</TabsTrigger>
          </TabsList>

          <TabsContent value="practice">
            <Card className="p-6">
              <LanguageSelector
                onSelectLanguage={setSelectedLanguage}
              />
              <div className="mt-6">
                <QuizCard
                  question={allQuestions[currentQuestionIndex]}
                  language={selectedLanguage}
                  onNext={handleNextQuestion}
                  onScore={() => {}}
                  timePerQuestion={30}
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="multiplayer">
            <GameCreator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;