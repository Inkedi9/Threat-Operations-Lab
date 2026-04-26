import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Simulator from "./pages/Simulator";
import Results from "./pages/Results";
import About from "./pages/About";

export default function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.025),transparent_28%),radial-gradient(circle_at_85%_10%,rgba(148,163,184,0.045),transparent_24%),linear-gradient(135deg,#05070b,#0b0f16_45%,#05070b)] text-slate-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulator" element={<Simulator />} />
        <Route path="/results" element={<Results />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}