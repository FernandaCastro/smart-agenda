import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";


export default function TabLayout() {
    const { accessToken, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );

    }

    // not logged in, redirect to login page
    if (!accessToken) return <Redirect href="/(auth)/login" />;

    // logged in, show the app
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#43ccbc',
                headerShadowVisible: false,
                tabBarStyle: {
                    backgroundColor: '#25292e',
                },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Chat',
                    header: ()=> (<Header />),
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'chatbubble-sharp' : 'chatbubble-outline'} color={color} size={24} style={{ transform: [ {rotateZ: '-90deg' }]}}/>
                    )
                }} />
            <Tabs.Screen
                name="about"
                options={{
                    title: 'About',
                    header: () => (<Header/>),
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'information-circle-sharp' : 'information-circle-outline'} color={color} size={24} />
                    )
                }} />

        </Tabs>
    )
}

