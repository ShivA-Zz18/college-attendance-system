import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TeacherDashboard from './pages/TeacherDashboard'; // 1. Import the new dashboard page
import ProtectedRoute from './components/ProtectedRoute'; // 2. Import the protected route component
import { AuthContext } from './context/AuthContext';    // 3. Import the auth context

function App() {
  const { user, loading } = useContext(AuthContext);

  // While the app is verifying the token, we can show a loading screen
  if (loading) {
    return <div>Loading Application...</div>;
  }

  return (
    <Routes>
      {/* Public routes that anyone can access */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* --- Protected Teacher Route --- */}
      {/* 4. This route is wrapped in our ProtectedRoute component. */}
      {/* Only logged-in users with the role 'teacher' can access it. */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      {/* We will add protected routes for students and admins here later */}


      {/* --- Root Redirect Logic --- */}
      {/* 5. This handles what happens when a user goes to the main "/" URL */}
      <Route
        path="/"
        element={
          !user ? (
            <Navigate to="/login" /> // If not logged in, go to login page
          ) : user.role === 'teacher' ? (
            <Navigate to="/teacher/dashboard" /> // If logged-in teacher, go to their dashboard
          ) : (
            // We'll add the student dashboard redirect here later
            <Navigate to="/login" /> // Fallback for now
          )
        }
      />
    </Routes>
  );
}

export default App;

