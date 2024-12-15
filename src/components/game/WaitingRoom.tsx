import { Card } from "@/components/ui/card";

interface WaitingRoomProps {
  participants: Array<{ id: string; name: string; score: number }>;
}

export const WaitingRoom = ({ participants }: WaitingRoomProps) => {
  return (
    <Card className="container mx-auto px-4 py-8 max-w-md mt-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Waiting for the game to start...</h2>
        <p className="text-gray-600 mb-4">The quiz will begin when the host starts the game.</p>
        
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Current Players:</h3>
          <div className="space-y-2">
            {participants.map((participant) => (
              <div 
                key={participant.id}
                className="bg-gray-50 p-2 rounded-lg"
              >
                {participant.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};