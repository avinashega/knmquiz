import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GameConfig {
  numQuestions: number;
  timePerQuestion: number;
}

interface GameConfigFormProps {
  onGameCreated: (gameCode: string, gameId: string) => void;
}

export const GameConfigForm = ({ onGameCreated }: GameConfigFormProps) => {
  const [gameConfig, setGameConfig] = useState<GameConfig>({
    numQuestions: 10,
    timePerQuestion: 30,
  });
  const { toast } = useToast();

  const handleCreateGame = async () => {
    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const { data: game, error } = await supabase
        .from('games')
        .insert({
          code: code,
          num_questions: gameConfig.numQuestions,
          time_per_question: gameConfig.timePerQuestion
        })
        .select()
        .single();

      if (error) throw error;

      onGameCreated(code, game.id);
      
      toast({
        title: "Game Created!",
        description: "Share the code or QR code with participants.",
      });
    } catch (error) {
      console.error('Error creating game:', error);
      toast({
        title: "Error",
        description: "Failed to create game. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Number of Questions
        </label>
        <Input
          type="number"
          value={gameConfig.numQuestions}
          onChange={(e) =>
            setGameConfig({
              ...gameConfig,
              numQuestions: parseInt(e.target.value) || 10,
            })
          }
          min="1"
          max="50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Time per Question (seconds)
        </label>
        <Input
          type="number"
          value={gameConfig.timePerQuestion}
          onChange={(e) =>
            setGameConfig({
              ...gameConfig,
              timePerQuestion: parseInt(e.target.value) || 30,
            })
          }
          min="10"
          max="120"
        />
      </div>

      <Button onClick={handleCreateGame} className="w-full">
        Create Game
      </Button>
    </div>
  );
};