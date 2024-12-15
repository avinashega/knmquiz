import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QuizGameplayProps {
  gameId: string;
  participantId: string;
}

interface GameState {
  currentQuestion: number;
  timeRemaining: number;
  status: string;
}

export const QuizGameplay = ({ gameId, participantId }: QuizGameplayProps) => {
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 0,
    timeRemaining: 30,
    status: 'waiting'
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
          
          if (game.status === 'started' && !prevState.status !== 'started') {
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

  if (gameState.status === 'waiting') {
    return (
      <Card className="p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Waiting for Game to Start</h2>
        <p className="text-center text-gray-600">The host will start the game soon...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">
            Question {gameState.currentQuestion + 1}
          </span>
          <span className="text-sm font-medium">
            Time: {gameState.timeRemaining}s
          </span>
        </div>

        <Progress value={(gameState.timeRemaining / 30) * 100} />

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-center">
            Sample Question {gameState.currentQuestion + 1}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['A', 'B', 'C', 'D'].map((option) => (
              <Button
                key={option}
                variant="outline"
                className="p-4 h-auto text-left"
                onClick={() => {
                  toast({
                    title: "Answer Submitted",
                    description: `You selected option ${option}`,
                  });
                }}
              >
                Option {option}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};