import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GameLobby } from "./game/GameLobby";

interface Participant {
  id: string;
  name: string;
}

export const GameJoiner = () => {
  const navigate = useNavigate();
  const [participantName, setParticipantName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [gameId, setGameId] = useState("");
  const { gameCode } = useParams();
  const { toast } = useToast();

  const handleJoinGame = async () => {
    if (!participantName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    setIsJoining(true);
    try {
      // First get the game by code
      const { data: game, error: gameError } = await supabase
        .from('games')
        .select()
        .eq('code', gameCode)
        .single();

      if (gameError || !game) {
        throw new Error('Game not found');
      }

      if (game.status !== 'waiting') {
        throw new Error('Game has already started');
      }

      // Join the game
      const { data: participant, error: joinError } = await supabase
        .from('participants')
        .insert({
          game_id: game.id,
          name: participantName
        })
        .select()
        .single();

      if (joinError) throw joinError;

      // Store participant ID in localStorage
      localStorage.setItem(`game_${game.id}_participant`, participant.id);

      setGameId(game.id);
      setHasJoined(true);
      
      toast({
        title: "Joined!",
        description: "Waiting for the game to start...",
      });
    } catch (error: any) {
      console.error('Error joining game:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to join game",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  if (hasJoined) {
    return (
      <Card className="p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Waiting for Game to Start</h2>
        <GameLobby
          gameId={gameId}
          gameCode={gameCode || ""}
          participants={participants}
          onParticipantsChange={setParticipants}
          onStartGame={() => {}}
          isCreator={false}
        />
      </Card>
    );
  }

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
            disabled={isJoining}
          />
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-center font-mono text-xl">Game Code: {gameCode}</p>
        </div>

        <Button 
          onClick={handleJoinGame} 
          className="w-full"
          disabled={isJoining}
        >
          {isJoining ? "Joining..." : "Join Game"}
        </Button>
      </div>
    </Card>
  );
};