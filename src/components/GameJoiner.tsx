import { useState } from "react";
import { useParams } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useToast } from "./ui/use-toast";

export const GameJoiner = () => {
  const [participantName, setParticipantName] = useState("");
  const { gameCode } = useParams();
  const { toast } = useToast();

  const handleJoinGame = () => {
    if (!participantName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    // In a future implementation, this would connect to a real-time backend
    toast({
      title: "Joined!",
      description: "Waiting for the game to start...",
    });
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Join Quiz Game</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Your Name</label>
          <Input
            type="text"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-center font-mono text-xl">Game Code: {gameCode}</p>
        </div>

        <Button onClick={handleJoinGame} className="w-full">
          Join Game
        </Button>
      </div>
    </Card>
  );
};