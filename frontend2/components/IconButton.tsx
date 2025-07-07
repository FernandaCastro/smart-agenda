import { MaterialIcons } from '@expo/vector-icons';
import { Text, Pressable, StyleSheet, View } from 'react-native';

type Props = {
    icon: keyof typeof MaterialIcons.glyphMap;
    label?: string;
    onPress: () => void;
};

export default function IconButton({ icon, label, onPress }: Props) {
    return (
        <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={onPress}>
                <MaterialIcons style={styles.buttonIcon} name={icon} size={24}/>
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: 120,
        height: 48,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        backgroundColor: '#25292e',
    },
    button: {
        borderRadius: 10,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: '#43ccbc',
    },
    buttonIcon: {
        paddingRight: 8,
        color: '#43ccbc',
    },
    buttonLabel: {
        color: '#43ccbc',
        fontSize: 16,
    },
});