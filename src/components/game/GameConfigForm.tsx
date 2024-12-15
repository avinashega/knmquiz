import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

interface GameConfig {
  numQuestions: number;
  timePerQuestion: number;
}

interface GameConfigFormProps {
  onGameCreated: (numQuestions: number, timePerQuestion: number) => void;
}

export const GameConfigForm = ({ onGameCreated }: GameConfigFormProps) => {
  const [gameConfig, setGameConfig] = useState<GameConfig>({
    numQuestions: 10,
    timePerQuestion: 30,
  });
  const { toast } = useToast();

  const handleCreateGame = () => {
    if (gameConfig.numQuestions < 1 || gameConfig.numQuestions > 50) {
      toast({
        title: "Invalid Configuration",
        description: "Number of questions must be between 1 and 50",
        variant: "destructive",
      });
      return;
    }

    if (gameConfig.timePerQuestion < 10 || gameConfig.timePerQuestion > 120) {
      toast({
        title: "Invalid Configuration",
        description: "Time per question must be between 10 and 120 seconds",
        variant: "destructive",
      });
      return;
    }

    onGameCreated(gameConfig.numQuestions, gameConfig.timePerQuestion);
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