import React, { createContext, useState, useEffect, useContext } from "react";
import { Alert, Platform } from "react-native";
import { getSession, loginUser, logoutUser, signupUser } from "../services/auth.service";
import { User } from "@/models/userModel.js";
import { authStorage } from "@/stores/authStore";
import { router } from "expo-router";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (user: User) => Promise<void>;
  signup: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {

      setLoading(true);
      const isMobile = Platform.OS !== 'web';

      if (isMobile) {
        const savedUser = await authStorage.getUser();
        const savedAccessToken = await authStorage.getAccessToken();
        const savedRefreshToken = await authStorage.getRefreshToken();

        if (!savedUser || !savedAccessToken || !savedRefreshToken) {
          console.warn("Error loading session on mobile platform. Redirecting to Login.");
          router.push("/(auth)/login");
          return;
        }

        setUser(savedUser);
        setAccessToken(accessToken);
      }

      try {

        if (user && accessToken) {
          router.push("/(tabs)");
          return;
        }

        if (!isMobile) {
          const _user = await getSession();
          if (!_user) router.push("/(auth)/login");

          setUser(_user);
        }

      } catch (error) {
        console.error("Error loading session:", error);
        router.push("/(auth)/login");

      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, []);

  useEffect(() => {
    registerLogoutCallback(logout);
  }, [() => logout]);

  const login = async (_user: User) => {
    try {
      const res = await loginUser(_user);

      if (Platform.OS !== 'web') {
        await authStorage.saveCredentials(res.publicUser, res.accessToken);
        await authStorage.saveRefreshToken(res.refreshToken);
        setAccessToken(accessToken);
      }

      setUser(res.publicUser);

    } catch (err: any) {
      console.error("Login error:", err);
      throw err;
    }
  };

  const signup = async (_user: User) => {
    try {
      const res = await signupUser(_user);

      if (Platform.OS !== 'web') {
        await authStorage.saveCredentials(res.publicUser, res.accessToken);
        await authStorage.saveRefreshToken(res.refreshToken);

        setAccessToken(accessToken);
      }

      setUser(res.publicUser);
      router.push("/(auth)/login");

    } catch (err: any) {
      console.error("Signup error:", err);
      Alert.alert("Signup failed", err.message || "Something went wrong.");
    }
  };

  const logout = async () => {

    try {

      if (!user) {
        console.warn("No user is currently logged in");
        return
      }

      await logoutUser(user);

      if (Platform.OS !== 'web') {
        await authStorage.clearCredentials();
        await authStorage.clearRefreshToken();
      }
      setAccessToken(null);
      setUser(null);

      console.log("User logged out successfully");

    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Logout failed", "An error occurred while logging out.");

    } finally {
      router.push("/(auth)/login");
    };
  }

  return (
    <AuthContext.Provider value={{ user, accessToken: accessToken, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

let externalLogoutCallback: (() => void) | null = null;

// Function to register a logout callback
export const registerLogoutCallback = (fn: () => void) => {
  externalLogoutCallback = fn;
};

// Function to call the registered logout callback
export const callLogoutCallback = () => {
  if (externalLogoutCallback) {
    externalLogoutCallback();
  } else {
    console.warn("No logout callback registered");
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
