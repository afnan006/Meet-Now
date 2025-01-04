import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useAuthStore } from './lib/store';
import { AuthGuard } from './components/AuthGuard';
import Auth from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Meeting } from './pages/Meeting';
import LoginPage from './pages/LoginPage';  // Import the LoginPage component

function App() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [setUser]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Route for the login/signup page */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Existing route for Auth
        <Route path="/auth" element={<Auth />} /> */}
        
        {/* Authenticated routes */}
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/meeting/:id"
          element={
            <AuthGuard>
              <Meeting />
            </AuthGuard>
          }
        />
        
        {/* Default route to the login page */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
