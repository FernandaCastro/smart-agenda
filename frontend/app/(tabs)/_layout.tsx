import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";


export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#43ccbc',
                headerStyle: {
                    backgroundColor: '#25292e',
                },
                headerShadowVisible: false,
                headerTintColor: '#43ccbc',
                tabBarStyle: {
                    backgroundColor: '#25292e',
                },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
                    )
                }} />
                            <Tabs.Screen
                name="result"
                options={{
                    title: 'Results',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "list" : 'list-outline'} color={color} size={24} />
                    )
                }} />

        </Tabs>
    )
}