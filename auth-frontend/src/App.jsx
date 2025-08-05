import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";

const App = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Redirect base path to login or home */}
        <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/login" />} />

        {/* Public Routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/home" />} />

        {/* Protected Routes */}
        <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
