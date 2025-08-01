import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IconButton from "@/components/IconButton";
import { useAlertStore } from "@/stores/useAlertStore";

export default function LoginScreen() {
  const { user, login } = useAuth();

  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { addAlert } = useAlertStore();

  const handleLogin = async () => {
    try {
      const _user = {
        email: email,
        password: password,
      }

      await login(_user);

      console.log("User logged in!");
      addAlert("Welcome back!");
      router.push("/(tabs)");

    } catch (error: any) {
      console.log("Login error:", error);
      addAlert(error.message || "An error occurred during login.");

    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.loginContainer}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          placeholder="Email"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <IconButton icon="login" label="Login" onPress={handleLogin} />

        <Text style={styles.link} onPress={() => router.push("/(auth)/signup")}>
          Are you new here?  Sign-up
        </Text>
      </View>
      <Footer />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loginContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },

  input: {
    minWidth: "40%",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    padding: 10,
    borderRadius: 5,
  },
  link: { color: "blue", marginTop: 16, textAlign: "center" },
});
