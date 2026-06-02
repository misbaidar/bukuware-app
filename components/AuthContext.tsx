"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

type Role = "admin" | "member" | null;

type UserState = {
  uid: string;
  email: string | null;
  displayName?: string | null;
  role?: Role;
} | null;

type AuthContextType = {
  user: UserState;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserState>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Fetch role and extra profile data from Firestore
      try {
        const userRef = doc(db, "users", fbUser.uid);
        const snap = await getDoc(userRef);
        const role: Role = snap.exists() ? (snap.data().role as Role) : "member";

        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || (snap.exists() ? snap.data().displayName : null),
          role,
        });
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setUser({ uid: fbUser.uid, email: fbUser.email, displayName: fbUser.displayName || null, role: null });
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    setLoading(true);
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }

    // Create Firestore user doc with default role 'member'
    const userRef = doc(db, "users", cred.user.uid);
    await setDoc(userRef, {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: displayName || cred.user.displayName || null,
      role: "member",
      createdAt: serverTimestamp(),
    });

    setLoading(false);
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    await signInWithEmailAndPassword(auth, email, password);
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
