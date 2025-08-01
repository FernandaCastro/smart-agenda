import React from 'react';
import { View, Text, StyleSheet, Animated, Platform, StatusBar } from 'react-native';
import { useAlertStore } from '../stores/useAlertStore';

export const AlertOverlay = () => {
    const alert = useAlertStore((state) => state.alert);
    const topOffset = Platform.OS === 'android' ? StatusBar.currentHeight ? StatusBar.currentHeight + 60 : 30 : 60;

    if (!alert) return null;

    return (
        <View style={[styles.container, { top: topOffset }]}>
            <Text style={styles.text}>{alert}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        minWidth: '60%',
        minHeight: 40,
        alignSelf: 'center',
        backgroundColor: '#43ccbc',
        padding: 15,
        borderRadius: 10,
        zIndex: 9999,
        elevation: 9999, // Android
        shadowColor: '#000', // iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    text: {
        color: '#25292e',
        //fontWeight: 'bold',
        textAlign: 'center',
    },
});
