import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "@/context/AuthContext";
import IconButton from "./IconButton";
import MiniButton from "./MiniButton";

export default function Header() {

    const { accessToken, user, logout } = useAuth();

    return (
        <View>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Ionicons name='chatbubble-outline' size={24} style={styles.logoIcon} />
                    <Text style={styles.logoText}>
                        Smart Agenda
                    </Text>
                </View>
                {accessToken &&
                    <View style={styles.userContainer} >
                        <Ionicons name='person' size={18} style={styles.userIcon} />
                        <Text style={styles.userText}>
                            {user?.name}
                        </Text>
                        <MiniButton
                            icon="logout"
                            onPress={logout} />
                    </View>
                }
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        marginTop: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#25292e',
        height: 60,
    },

    logoContainer: {
        marginLeft: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },

    userContainer: {
        flexDirection: 'row',
        marginRight: 20,
    },

    logoIcon: {
        color: '#43ccbc',
        transform: [{ rotateZ: '-90deg' }],
    },

    logoText: {
        paddingLeft: 5,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#43ccbc',
    },

    userIcon: {
        color: '#43ccbc',
        marginRight: 10,
    },

    userText: {
        color: 'white',
        marginRight: 20,
        alignSelf: 'flex-end',
    },

})