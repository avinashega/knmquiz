import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface LeaderboardProps {
  participants: {
    id: string;
    name: string;
    score: number;
  }[];
  currentParticipantId: string;
}

export const Leaderboard = ({ participants, currentParticipantId }: LeaderboardProps) => {
  const navigate = useNavigate();
  // Sort participants by score in descending order
  const sortedParticipants = [...participants].sort((a, b) => b.score - a.score);

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-dutch-orange" />
        <h3 className="text-xl font-bold">Leaderboard</h3>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedParticipants.map((participant, index) => (
            <TableRow 
              key={participant.id}
              className={participant.id === currentParticipantId ? "bg-dutch-orange/10" : ""}
            >
              <TableCell className="font-medium">
                {index + 1}
                {index === 0 && " 🏆"}
                {index === 1 && " 🥈"}
                {index === 2 && " 🥉"}
              </TableCell>
              <TableCell>{participant.name}</TableCell>
              <TableCell className="text-right">{participant.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center">
        <Button 
          onClick={() => navigate('/')}
          className="gap-2"
        >
          Play Another Quiz
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};