import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { allQuestions, shuffleQuestions } from "@/data/quizData";
import { QuizQuestion } from "@/types/quiz";

interface QuizGameplayProps {
  gameId: string;
  participantId: string;
}

interface GameState {
  currentQuestion: number;
  timeRemaining: number;
  status: string;
  questions: QuizQuestion[];
}

export const QuizGameplay = ({ gameId, participantId }: QuizGameplayProps) => {
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 0,
    timeRemaining: 30,
    status: 'waiting',
    questions: shuffleQuestions(allQuestions).slice(0, 10)
  });
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to game state changes
    const channel = supabase
      .channel('game-state')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${gameId}`,
        },
        (payload) => {
          const game = payload.new as any;
          setGameState(prevState => ({
            ...prevState,
            status: game.status
          }));
          
          if (game.status === 'started' && prevState.status !== 'started') {
            toast({
              title: "Game Started!",
              description: "The quiz has begun.",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, toast]);

  // Timer effect
  useEffect(() => {
    if (gameState.status !== 'started') return;

    const timer = setInterval(() => {
      setGameState(prevState => ({
        ...prevState,
        timeRemaining: Math.max(0, prevState.timeRemaining - 1)
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.status]);

  const handleAnswer = async (answer: string) => {
    const currentQuestion = gameState.questions[gameState.currentQuestion];
    const isCorrect = answer === currentQuestion.optionsEnglish[currentQuestion.correctOptionIndex];
    
    if (isCorrect) {
      // Update score in database
      await supabase
        .from('participants')
        .update({ score: supabase.sql`score + 1` })
        .eq('id', participantId);
    }

    toast({
      title: isCorrect ? "Correct!" : "Incorrect",
      description: isCorrect ? "You got it right!" : "Better luck next time!",
      variant: isCorrect ? "default" : "destructive",
    });

    // Move to next question
    setGameState(prev => ({
      ...prev,
      currentQuestion: prev.currentQuestion + 1,
      timeRemaining: 30
    }));
  };

  if (gameState.status === 'waiting') {
    return (
      <Card className="p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Waiting for Game to Start</h2>
        <p className="text-center text-gray-600">The host will start the game soon...</p>
      </Card>
    );
  }

  const currentQuestion = gameState.questions[gameState.currentQuestion];
  if (!currentQuestion) {
    return (
      <Card className="p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Quiz Complete!</h2>
        <p className="text-center text-gray-600">Wait for final results...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">
            Question {gameState.currentQuestion + 1} of {gameState.questions.length}
          </span>
          <span className="text-sm font-medium">
            Time: {gameState.timeRemaining}s
          </span>
        </div>

        <Progress value={(gameState.timeRemaining / 30) * 100} />

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-center">
            {currentQuestion.questionEnglish}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.optionsEnglish.map((option) => (
              <Button
                key={option}
                variant="outline"
                className="p-4 h-auto text-left"
                onClick={() => handleAnswer(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};