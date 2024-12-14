import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { QuizQuestion } from "@/types/quiz";
import { useToast } from "@/hooks/use-toast";

interface QuizCardProps {
  question: QuizQuestion;
  language: 'dutch' | 'english';
  onNext: () => void;
  onScore: () => void;
}

export const QuizCard = ({ question, language, onNext, onScore }: QuizCardProps) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const { toast } = useToast();

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleResponse = (correct: boolean) => {
    if (correct) {
      onScore();
      toast({
        title: "Correct!",
        description: "Well done! Keep going!",
        duration: 1500,
      });
    } else {
      toast({
        title: "Not quite right",
        description: "Keep practicing!",
        variant: "destructive",
        duration: 1500,
      });
    }
    setShowAnswer(false);
    onNext();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fadeIn">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center text-dutch-blue">
          {language === 'dutch' ? question.questionDutch : question.questionEnglish}
        </h2>
      </CardHeader>
      <CardContent className="text-center">
        {showAnswer ? (
          <p className="text-lg">
            {language === 'dutch' ? question.answerDutch : question.answerEnglish}
          </p>
        ) : (
          <Button onClick={handleShowAnswer} className="bg-dutch-orange hover:bg-dutch-orange/90">
            Show Answer
          </Button>
        )}
      </CardContent>
      {showAnswer && (
        <CardFooter className="flex justify-center space-x-4">
          <Button
            onClick={() => handleResponse(false)}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50"
          >
            Incorrect
          </Button>
          <Button
            onClick={() => handleResponse(true)}
            className="bg-green-500 hover:bg-green-600"
          >
            Correct
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};