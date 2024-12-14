import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Questions from "@/pages/Questions";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/questions" element={<Questions />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;