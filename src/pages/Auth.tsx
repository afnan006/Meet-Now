import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuthStore } from '../lib/store';
import { Button } from '../components/Button';
import { LogIn } from 'react-feather';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      localStorage.setItem('user', JSON.stringify(result.user)); // Store user in localStorage
      navigate('/dashboard');
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSignIn = () => {
    const recaptchaContainer = document.getElementById('recaptcha-container'); // Get the DOM element for reCAPTCHA
    const recaptchaVerifier = new RecaptchaVerifier(recaptchaContainer, {}, auth); // Use the element and the auth instance
    const phoneNumber = '+1234567890'; // Replace with dynamic phone number input

    signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
      .then((confirmationResult) => {
        const code = prompt('Enter OTP');
        if (code) {  // Ensure the code is not null
          return confirmationResult.confirm(code);
        } else {
          console.error('No code entered');
        }
      })
      .catch((error) => {
        console.error('Error during phone sign-in', error);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center">Sign In</h1>
        <Button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2"
        >
          <LogIn className="h-5 w-5" />
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </Button>
        <Button
          onClick={handlePhoneSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2"
        >
          {loading ? 'Signing in...' : 'Sign in with Phone'}
        </Button>
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default Auth;
