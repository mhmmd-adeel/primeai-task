import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext"; // assuming AuthContext is in src/context
import ProtectedRoute from "./components/ProtectedRoute"; // assuming ProtectedRoute is in src/components

// 👇 Correct paths for pages (assuming pages folder is next to App.jsx in src/)
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage"; 
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          {/* Default route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;