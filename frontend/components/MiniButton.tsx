import { MaterialIcons } from '@expo/vector-icons';
import { Text, Pressable, StyleSheet, View, ViewStyle, StyleProp } from 'react-native';

type Props = {
    icon: keyof typeof MaterialIcons.glyphMap;
    onPress: () => void;
};

export default function MiniButton({ icon, onPress }: Props) {
    
    return (
        <View style={ styles.buttonContainer}>
            <Pressable style={styles.button} onPress={onPress}>
                <MaterialIcons style={styles.buttonIcon} name={icon} size={20}/>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        borderRadius:8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        padding: 2
    },
    buttonIcon: {
        color: '#43ccbc',
    },
});