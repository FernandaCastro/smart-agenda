import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { loginUser, signupUser } from "../services/auth.service";
import { User } from "@/models/userMOdel";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User) => Promise<void>;
  signup: (user: User) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
      }
      setLoading(false);
    };
    loadToken();
  }, []);

  const login = async (_user: User) => {
    try {
      const { token, loggedUser } = await loginUser(_user);
      setToken(token);
      setUser(loggedUser);
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", loggedUser);
    } catch (err: any) {
      Alert.alert("Login failed", err.message || "Something went wrong.");
    }
  };

  const signup = async (_user: User) => {
    try {
      const { token, user } = await signupUser(_user);
      setToken(token);
      setUser({ id: "1", name: "dummy", email: "dummy@user.com" });
      await AsyncStorage.setItem("token", token);
    } catch (err: any) {
      Alert.alert("Signup failed", err.message || "Something went wrong.");
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem("token");
    console.log("User logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
