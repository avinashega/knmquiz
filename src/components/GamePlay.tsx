import { useState } from "react";
import { useParams } from "react-router-dom";
import { GameContainer } from "./game/GameContainer";
import { GameStateManager } from "./game/GameStateManager";

export const GamePlay = () => {
  const { gameCode } = useParams();
  const [gameId, setGameId] = useState<string | null>(null);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [isCreator, setIsCreator] = useState(false);
  const [gameStatus, setGameStatus] = useState<string>('waiting');
  const [participants, setParticipants] = useState<Array<{ id: string; name: string; score: number }>>([]);

  const handleGameData = (data: { id: string; status: string }) => {
    setGameId(data.id);
    setGameStatus(data.status);
    
    const isGameCreator = localStorage.getItem(`game_${data.id}_creator`) === 'true';
    setIsCreator(isGameCreator);
    console.log('Is creator:', isGameCreator);
    
    if (!isGameCreator) {
      const storedParticipantId = localStorage.getItem(`game_${data.id}_participant`);
      if (storedParticipantId) {
        setParticipantId(storedParticipantId);
      }
    }
  };

  if (!gameCode) return null;

  return (
    <>
      <GameContainer 
        gameCode={gameCode}
        onGameData={handleGameData}
        onParticipantsData={setParticipants}
      />
      {gameId && (
        <GameStateManager
          gameId={gameId}
          gameStatus={gameStatus}
          participants={participants}
          isCreator={isCreator}
          participantId={participantId}
        />
      )}
    </>
  );
};