import { StyleSheet, View } from "react-native";

export default function Footer() {

    return (
        <View style={styles.container}></View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:  '#25292e',
        height: 60,
    }
});