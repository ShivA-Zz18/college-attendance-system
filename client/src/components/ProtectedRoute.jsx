    import React, { useContext } from 'react';
    import { Navigate } from 'react-router-dom';
    import { AuthContext } from '../context/AuthContext';

    const ProtectedRoute = ({ children, allowedRoles }) => {
      const { user, loading } = useContext(AuthContext);

      if (loading) {
        return <div>Loading...</div>; // Or a spinner component
      }

      if (!user) {
        return <Navigate to="/login" />;
      }
      
      if (allowedRoles && !allowedRoles.includes(user.role)) {
          // If the user's role is not allowed, redirect to a generic home page or an unauthorized page
          return <Navigate to="/" />; 
      }

      return children;
    };

    export default ProtectedRoute;
    
