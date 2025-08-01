import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IconButton from "@/components/IconButton";
import { useAlertStore } from "@/stores/useAlertStore";

export default function SignupScreen() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { user, signup } = useAuth();
    const router = useRouter();
    const { addAlert } = useAlertStore();

    const handleSignup = async () => {
        try {
            const user = {
                name: name,
                email: email,
                password: password,
            }
            await signup(user);

            console.log("New user created!");
            addAlert(`${user.name}, your account has been created successfully! Please log in.`);

            router.replace("/(auth)/login");

        } catch (error: any) {
            console.error("Error during signup:", error);
            addAlert( error.message || "An error occurred during signup.");
        }
    };

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.signupContainer}>
                <Text style={styles.title}>New Account</Text>
                <TextInput
                    placeholder="Name"
                    style={styles.input}
                    autoCapitalize="none"
                    value={name}
                    onChangeText={setName}
                />

                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                <TextInput
                    placeholder="Senha"
                    style={styles.input}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <IconButton icon="save-alt" label="Sign up" onPress={handleSignup} />

                <Text style={styles.link} onPress={() => router.push("/(auth)/login")}>
                    Already have an account? Log in.
                </Text>
            </View>
            <Footer />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    signupContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#fff",
        alignItems: "center",
    },
    title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
    input: {
        minWidth: "50%",
        borderWidth: 1,
        borderColor: "#ccc",
        marginBottom: 12,
        padding: 10,
        borderRadius: 5,
    },
    link: { color: "blue", marginTop: 16, textAlign: "center" },
});
