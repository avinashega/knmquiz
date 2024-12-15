import { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2, Play } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { supabase } from "@/integrations/supabase/client";

interface Participant {
  id: string;
  name: string;
}

interface GameLobbyProps {
  gameId: string;
  gameCode: string;
  participants: Participant[];
  onParticipantsChange: (participants: Participant[]) => void;
  onStartGame: () => void;
  isCreator?: boolean;
}

export const GameLobby = ({ 
  gameId, 
  gameCode, 
  participants, 
  onParticipantsChange,
  onStartGame,
  isCreator = false 
}: GameLobbyProps) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!gameId) return;

    // Subscribe to real-time updates for new participants
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
          onParticipantsChange([...participants, {
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
  }, [gameId, participants, onParticipantsChange, toast]);

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
      if (navigator.share && window.isSecureContext) {
        await navigator.share({
          title: "Join my KNM Quiz!",
          text: "Click to join the quiz game",
          url: gameLink,
        });
      } else {
        await navigator.clipboard.writeText(gameLink);
        toast({
          title: "Copied!",
          description: "Game link copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
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

  return (
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

      <div className="space-y-2">
        <h3 className="font-semibold">Waiting Room ({participants.length})</h3>
        <div className="flex flex-wrap gap-2">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1"
            >
              <Avatar className="h-6 w-6">
                <AvatarFallback>
                  {participant.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{participant.name}</span>
            </div>
          ))}
        </div>
        {isCreator && participants.length > 0 && (
          <Button onClick={onStartGame} className="w-full mt-4">
            <Play className="w-4 h-4 mr-2" />
            Start Game
          </Button>
        )}
      </div>
    </div>
  );
};