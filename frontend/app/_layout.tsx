import { Slot } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AlertOverlay } from "@/components/AlertOverlay";

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaView style={styles.safeArea}>
        <Slot />
        <AlertOverlay />
      </SafeAreaView>
    </AuthProvider>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
})