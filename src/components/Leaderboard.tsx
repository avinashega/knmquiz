import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy } from "lucide-react";

interface LeaderboardProps {
  participants: {
    id: string;
    name: string;
    score: number;
  }[];
  currentParticipantId: string;
}

export const Leaderboard = ({ participants, currentParticipantId }: LeaderboardProps) => {
  // Sort participants by score in descending order
  const sortedParticipants = [...participants].sort((a, b) => b.score - a.score);

  return (
    <div className="w-full">
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
    </div>
  );
};