import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Sales from "./pages/Sales";
import Predict from "./pages/Predict";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

export default function App() {
  
  return (
    <Routes>
      <Route path="/" element={<h1>Hello World!</h1>} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
      <Route path="/predict" element={<ProtectedRoute><Predict /></ProtectedRoute>} />
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}
