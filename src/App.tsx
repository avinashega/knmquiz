import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Questions from "@/pages/Questions";
import { GameJoiner } from "@/components/GameJoiner";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/game/:gameCode" element={<GameJoiner />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;