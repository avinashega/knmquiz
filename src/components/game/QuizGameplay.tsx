import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizProgress } from "@/components/QuizProgress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { allQuestions, shuffleQuestions } from "@/data/quizData";
import { QuizQuestion } from "@/types/quiz";

interface QuizGameplayProps {
  gameId: string;
  participantId: string;
}

export const QuizGameplay = ({ gameId, participantId }: QuizGameplayProps) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initializeQuiz = async () => {
      const { data: game } = await supabase
        .from('games')
        .select('num_questions')
        .eq('id', gameId)
        .single();

      if (game) {
        const shuffled = shuffleQuestions(allQuestions);
        setQuestions(shuffled.slice(0, game.num_questions));
      }
    };

    initializeQuiz();

    const channel = supabase
      .channel('game-status')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${gameId}`,
        },
        (payload) => {
          if (payload.new.status === 'playing') {
            setGameStarted(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId]);

  const handleOptionSelect = async (optionIndex: number) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(optionIndex);
    
    const isCorrect = optionIndex === questions[currentQuestionIndex].correctOptionIndex;
    if (isCorrect) {
      setScore(s => s + 1);
      
      // Update score in database
      await supabase
        .from('participants')
        .update({ score: score + 1 })
        .eq('id', participantId);

      toast({
        title: "Correct!",
        description: "Good job!",
      });
    } else {
      toast({
        title: "Incorrect",
        description: "Better luck next time!",
        variant: "destructive",
      });
    }

    // Move to next question after a delay
    setTimeout(() => {
      setSelectedOption(null);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(i => i + 1);
      }
    }, 2000);
  };

  if (!gameStarted) {
    return (
      <Card className="p-6 max-w-2xl mx-auto mt-8">
        <h2 className="text-2xl font-bold text-center mb-4">Waiting for the game to start...</h2>
        <p className="text-center text-gray-600">The quiz will begin when the host starts the game.</p>
      </Card>
    );
  }

  if (!questions.length) {
    return (
      <Card className="p-6 max-w-2xl mx-auto mt-8">
        <p className="text-center">Loading questions...</p>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      <QuizProgress
        current={currentQuestionIndex}
        total={questions.length}
        score={score}
      />

      <Card className="p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">
          {currentQuestion.questionEnglish}
        </h2>

        <div className="space-y-3">
          {currentQuestion.optionsEnglish.map((option, index) => (
            <Button
              key={index}
              className={`w-full justify-start text-left ${
                selectedOption === index
                  ? index === currentQuestion.correctOptionIndex
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                  : ""
              }`}
              variant={selectedOption === null ? "outline" : "secondary"}
              onClick={() => handleOptionSelect(index)}
              disabled={selectedOption !== null}
            >
              {option}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};