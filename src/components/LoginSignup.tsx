import React, { useState } from 'react';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase'; 
import { FaGoogle } from 'react-icons/fa'; // Importing the Google icon from react-icons

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const navigate = useNavigate();
  
  const googleProvider = new GoogleAuthProvider();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Logged in user:', userCredential.user);
        setIsLoggedIn(true);
        setTimeout(() => navigate('/dashboard'), 2000); // Delay navigation for animation
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Signed up user:', userCredential.user);
        setIsLoggedIn(true);
        setTimeout(() => navigate('/dashboard'), 2000); // Delay navigation for animation
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      console.log('Logged in with Google:', userCredential.user);
      setIsLoggedIn(true);
      setTimeout(() => navigate('/dashboard'), 2000); // Delay navigation for animation
    } catch (error) {
      console.error('Google authentication error:', error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-rose-50 via-pink-200 to-indigo-100 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className={`w-full max-w-lg bg-white p-8 sm:p-10 rounded-xl shadow-2xl overflow-hidden transform transition-all ${isLoggedIn ? 'scale-105' : 'scale-100'} duration-300 ease-in-out`}>
        <h2 className={`text-center text-4xl font-bold text-rose-600 mb-4 ${isLoggedIn ? 'animate__animated animate__fadeIn animate__delay-1s' : ''}`}>Meet Now</h2>
        <h3 className="text-center text-lg font-medium text-gray-600 mb-8">Your new spot for chill zone work</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-rose-600">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-rose-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 transition duration-200 transform hover:scale-105 hover:border-rose-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-rose-600">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 border border-rose-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 transition duration-200 transform hover:scale-105 hover:border-rose-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-center items-center mt-4">
            <Button
              type="submit"
              className="w-full bg-rose-600 text-white py-3 rounded-md hover:bg-rose-700 hover:scale-105 transition-transform duration-300"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </Button>
          </div>

          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-rose-600 hover:text-rose-700 text-sm text-center"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
            </button>
          </div>
        </form>

        <div className="my-8 flex items-center justify-between">
          <div className="border-t border-rose-300 w-full"></div>
          <span className="text-rose-600 mx-2">OR</span>
          <div className="border-t border-rose-300 w-full"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center bg-rose-600 text-white py-3 rounded-md hover:bg-rose-700 hover:scale-105 transition-transform duration-300"
        >
          <FaGoogle className="w-6 h-6 mr-2 transition-all duration-300 transform hover:scale-110" />
          Sign in with Google
        </button>

        {/* Success Login Animation (after login/signup) */}
        {isLoggedIn && (
          <div className="absolute inset-0 bg-rose-100 flex justify-center items-center transition-opacity opacity-0 animate__animated animate__fadeIn animate__delay-2s">
            <h1 className="text-3xl font-bold text-rose-600">Welcome Back!</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;
