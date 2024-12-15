import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "./ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GameConfigForm } from "./game/GameConfigForm";
import { GameLobby } from "./game/GameLobby";

interface Participant {
  id: string;
  name: string;
}

export const GameCreator = () => {
  const navigate = useNavigate();
  const [gameCode, setGameCode] = useState<string>("");
  const [gameId, setGameId] = useState<string>("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const { toast } = useToast();

  const handleGameCreated = (code: string, id: string) => {
    setGameCode(code);
    setGameId(id);
  };

  const startGame = async () => {
    if (participants.length < 1) {
      toast({
        title: "Error",
        description: "Wait for participants to join",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('games')
        .update({ 
          status: 'playing',
          started_at: new Date().toISOString()
        })
        .eq('id', gameId);

      if (error) throw error;
      
      toast({
        title: "Starting Game",
        description: "The quiz will begin shortly...",
      });

      navigate(`/game/${gameCode}`);
    } catch (error) {
      console.error('Error starting game:', error);
      toast({
        title: "Error",
        description: "Failed to start game. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Multiplayer Quiz</h2>
      
      {!gameCode ? (
        <GameConfigForm onGameCreated={handleGameCreated} />
      ) : (
        <GameLobby
          gameId={gameId}
          gameCode={gameCode}
          participants={participants}
          onParticipantsChange={setParticipants}
          onStartGame={startGame}
          isCreator={true}
        />
      )}
    </Card>
  );
};