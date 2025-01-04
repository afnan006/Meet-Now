// src/pages/LoginPage.tsx

import React from 'react';
import LoginSignup from '../components/LoginSignup';  // Import the component we created earlier

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <LoginSignup />
    </div>
  );
};

export default LoginPage;
