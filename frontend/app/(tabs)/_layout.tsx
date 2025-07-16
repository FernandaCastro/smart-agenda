import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";


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
                    title: 'Chat',
                    headerTitle: ({ tintColor }) => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name='chatbubble-outline' color={tintColor} size={24} />
                            <Text style={{ paddingLeft: 5, fontSize: 16, fontWeight: 'bold', color: tintColor }}>
                                Smart Agenda
                            </Text>
                        </View>
                    ),
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'chatbubble-sharp' : 'chatbubble-outline'} color={color} size={24} />
                    )
                }} />
            <Tabs.Screen
                name="about"
                options={{
                    title: 'About',
                    headerTitle: ({ tintColor }) => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name='chatbubble-outline' color={tintColor} size={24} />
                            <Text style={{ paddingLeft: 5, fontSize: 16, fontWeight: 'bold', color: tintColor }}>
                                Smart Agenda
                            </Text>
                        </View>
                    ),
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'information-circle-sharp' : 'information-circle-outline'} color={color} size={24} />
                    )
                }} />

        </Tabs>
    )
}