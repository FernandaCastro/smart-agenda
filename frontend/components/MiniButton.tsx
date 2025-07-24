import { MaterialIcons } from '@expo/vector-icons';
import { Text, Pressable, StyleSheet, View, ViewStyle, StyleProp } from 'react-native';

type Props = {
    icon: keyof typeof MaterialIcons.glyphMap;
    onPress: () => void;
};

export default function MiniButton({ icon, onPress }: Props) {

    return (
        <View>
            <Pressable style={styles.miniButton} onPress={onPress}>
                <MaterialIcons style={styles.miniButtonIcon} name={icon} size={20} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    miniButton: {
        borderRadius: 8,
        flexDirection: 'row',
    },
    miniButtonIcon: {
        color: '#43ccbc',
    },
});