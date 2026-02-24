import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '../services/firebase';
import { createUserProfile, getUserProfile } from '../services/firestoreService';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const getErrorMessage = (error: FirebaseError): string => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'Account with this email already exists.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    default:
      return 'Something went wrong. Please try again.';
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const signup = async (email: string, password: string, name: string): Promise<void> => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfile(result.user.uid, email, name);
      const userProfile = await getUserProfile(result.user.uid);
      setCurrentUser(userProfile);
    } catch (err) {
      const message = err instanceof FirebaseError ? getErrorMessage(err) : 'Signup failed.';
      setError(message);
      throw new Error(message);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userProfile = await getUserProfile(result.user.uid);
      setCurrentUser(userProfile);
    } catch (err) {
      const message = err instanceof FirebaseError ? getErrorMessage(err) : 'Login failed.';
      setError(message);
      throw new Error(message);
    }
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
    setCurrentUser(null);
  };

  const clearError = () => setError(null);

  const refreshUser = async (): Promise<void> => {
    if (auth.currentUser) {
      const userProfile = await getUserProfile(auth.currentUser.uid);
      setCurrentUser(userProfile);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userProfile = await getUserProfile(firebaseUser.uid);
          setCurrentUser(userProfile);
        } catch (err) {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    error,
    signup,
    login,
    logout,
    clearError,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
