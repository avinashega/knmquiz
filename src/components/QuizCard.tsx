import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { QuizQuestion } from "@/types/quiz";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Languages } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface QuizCardProps {
  question: QuizQuestion;
  language: 'dutch' | 'english';
  onNext: () => void;
  onScore: () => void;
}

export const QuizCard = ({ question, language, onNext, onScore }: QuizCardProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<{ text: string; index: number }[]>([]);
  const { toast } = useToast();

  // Reset state and shuffle options when question changes
  useEffect(() => {
    const options = language === 'dutch' ? question.optionsDutch : question.optionsEnglish;
    const optionsWithIndices = options.map((text, index) => ({ text, index }));
    const shuffled = [...optionsWithIndices].sort(() => Math.random() - 0.5);
    setShuffledOptions(shuffled);
    setSelectedOption(null);
    setHasAnswered(false);
  }, [question, language]);

  const handleSubmit = () => {
    if (selectedOption === null) {
      toast({
        title: "Please select an answer",
        variant: "destructive",
        duration: 1500,
      });
      return;
    }

    setHasAnswered(true);

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
  };

  const handleNext = () => {
    setSelectedOption(null);
    setHasAnswered(false);
    onNext();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fadeIn">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-dutch-blue">
            {language === 'dutch' ? question.questionDutch : question.questionEnglish}
          </h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="focus:ring-2 focus:ring-offset-2 focus:ring-dutch-blue"
              >
                <Languages className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4">
              <p className="text-sm">
                {language === 'dutch' ? question.questionEnglish : question.questionDutch}
              </p>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={selectedOption?.toString()}
          onValueChange={(value) => !hasAnswered && setSelectedOption(parseInt(value))}
          className="space-y-4"
        >
          {shuffledOptions.map(({ text, index }) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={index.toString()} 
                id={`option-${index}`} 
                disabled={hasAnswered}
                className={cn(
                  hasAnswered && "opacity-50"
                )}
              />
              <Label 
                htmlFor={`option-${index}`} 
                className={cn(
                  "text-left flex-1 p-2 rounded cursor-pointer",
                  hasAnswered && selectedOption === index && index === question.correctOptionIndex && "bg-green-100 text-green-800",
                  hasAnswered && selectedOption === index && index !== question.correctOptionIndex && "bg-red-100 text-red-800",
                  hasAnswered && selectedOption !== index && index === question.correctOptionIndex && "bg-green-100 text-green-800"
                )}
              >
                {text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-center pt-6 space-x-4">
        {!hasAnswered ? (
          <Button
            onClick={handleSubmit}
            className="bg-dutch-orange hover:bg-dutch-orange/90 w-full max-w-xs"
          >
            Submit Answer
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="bg-dutch-blue hover:bg-dutch-blue/90 w-full max-w-xs"
          >
            Next Question
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};