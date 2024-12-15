import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2, Play } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { supabase } from "@/integrations/supabase/client";

interface GameConfig {
  numQuestions: number;
  timePerQuestion: number;
}

interface Participant {
  id: string;
  name: string;
}

export const GameCreator = () => {
  const navigate = useNavigate();
  const [gameConfig, setGameConfig] = useState<GameConfig>({
    numQuestions: 10,
    timePerQuestion: 30,
  });
  const [gameCode, setGameCode] = useState<string>("");
  const [gameId, setGameId] = useState<string>("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!gameId) return;

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'participants',
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          const newParticipant = payload.new as any;
          setParticipants(prev => [...prev, {
            id: newParticipant.id,
            name: newParticipant.name
          }]);
          
          toast({
            title: "New Player Joined!",
            description: `${newParticipant.name} has joined the game.`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, toast]);

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

      setGameCode(code);
      setGameId(game.id);
      
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

  const copyGameCode = () => {
    navigator.clipboard.writeText(gameCode);
    toast({
      title: "Copied!",
      description: "Game code copied to clipboard",
    });
  };

  const shareGameLink = async () => {
    const gameLink = `${window.location.origin}/game/${gameCode}`;
    
    try {
      // Check if the Web Share API is supported and if we're in a secure context
      if (navigator.share && window.isSecureContext) {
        await navigator.share({
          title: "Join my KNM Quiz!",
          text: "Click to join the quiz game",
          url: gameLink,
        });
      } else {
        // Fallback to copying to clipboard if sharing is not available
        await navigator.clipboard.writeText(gameLink);
        toast({
          title: "Copied!",
          description: "Game link copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to copying to clipboard if sharing fails
      try {
        await navigator.clipboard.writeText(gameLink);
        toast({
          title: "Copied!",
          description: "Game link copied to clipboard",
        });
      } catch (clipboardError) {
        toast({
          title: "Error",
          description: "Could not share or copy the game link",
          variant: "destructive",
        });
      }
    }
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

      // Navigate to the game
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

        {!gameCode ? (
          <Button onClick={handleCreateGame} className="w-full">
            Create Game
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-center font-mono text-2xl">{gameCode}</p>
            </div>
            
            <div className="flex justify-center">
              <QRCodeSVG
                value={`${window.location.origin}/game/${gameCode}`}
                size={200}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={copyGameCode} className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
              <Button onClick={shareGameLink} className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Share Link
              </Button>
            </div>

            {participants.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Participants ({participants.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>
                          {participant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{participant.name}</span>
                    </div>
                  ))}
                </div>
                <Button onClick={startGame} className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Start Game
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
