import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Platform } from "react-native";
import { getSession, loginUser, signupUser } from "../services/auth.service";
import { User } from "@/models/userModel.js";
import Keychain from "react-native-keychain";
import { authStorage } from "@/stores/authStore";

interface AuthContextType {
  user: User | null;
  userEmail: string | null;
  token: string | null;
  login: (user: User) => Promise<void>;
  signup: (user: User) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      if (Platform.OS === 'web') {
        const _user = await getSession();
        setUser(_user);
        setLoading(false);
        return;
      }
      const savedToken = await authStorage.getAccessToken();
      const savedEmail = await authStorage.getEmail();
      if (savedToken) setAccessToken(savedToken);
      if (savedEmail) setUserEmail(savedEmail);
      setLoading(false);
    };
    loadSession();
  }, []);

  const login = async (_user: User) => {
    try {
      const res = await loginUser(_user);

      if (Platform.OS !== 'web') {
        await authStorage.saveCredentials(res.publicUser.email, res.accessToken);
        await authStorage.saveRefreshToken(res.refreshToken);
        setAccessToken(accessToken);
      }

      setUser(res.publicUser);
      setUserEmail(res.publicUser.email);

    } catch (err: any) {
      console.error("Login error:", err);
      throw err;
    }
  };

  const signup = async (_user: User) => {
    try {
      const res = await signupUser(_user);

      if (Platform.OS !== 'web') {
        await authStorage.saveCredentials(res.publicUser.email, res.accessToken);
        await authStorage.saveRefreshToken(res.refreshToken);

        setAccessToken(accessToken);
      }

      setUser(res.publicUser);
      setUserEmail(res.publicUser.email);

    } catch (err: any) {
      console.error("Signup error:", err);
      Alert.alert("Signup failed", err.message || "Something went wrong.");
    }
  };

  const logout = async () => {

    if (Platform.OS !== 'web') {
      await authStorage.clearCredentials();
      await authStorage.clearRefreshToken();
    }
    setAccessToken(null);
    setUser(null);
    setUserEmail(null);

    console.log("User logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, userEmail, token: accessToken, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
