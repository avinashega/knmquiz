import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { QuizQuestion } from "@/types/quiz";
import { useToast } from "@/hooks/use-toast";

interface QuizCardProps {
  question: QuizQuestion;
  language: 'dutch' | 'english';
  onNext: () => void;
  onScore: () => void;
}

export const QuizCard = ({ question, language, onNext, onScore }: QuizCardProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (selectedOption === null) {
      toast({
        title: "Please select an answer",
        variant: "destructive",
        duration: 1500,
      });
      return;
    }

    if (selectedOption === question.correctOptionIndex) {
      onScore();
      toast({
        title: "Correct!",
        description: "Well done! Keep going!",
        duration: 1500,
      });
    } else {
      toast({
        title: "Not quite right",
        description: language === 'dutch' ? question.answerDutch : question.answerEnglish,
        variant: "destructive",
        duration: 3000,
      });
    }
    
    setSelectedOption(null);
    onNext();
  };

  const options = language === 'dutch' ? question.optionsDutch : question.optionsEnglish;

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fadeIn">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center text-dutch-blue">
          {language === 'dutch' ? question.questionDutch : question.questionEnglish}
        </h2>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={selectedOption?.toString()}
          onValueChange={(value) => setSelectedOption(parseInt(value))}
          className="space-y-4"
        >
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="text-left">{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-center pt-6">
        <Button
          onClick={handleSubmit}
          className="bg-dutch-orange hover:bg-dutch-orange/90 w-full max-w-xs"
        >
          Submit Answer
        </Button>
      </CardFooter>
    </Card>
  );
};