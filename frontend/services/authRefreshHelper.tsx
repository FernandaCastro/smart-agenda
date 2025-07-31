import axios from 'axios';
import Constants from 'expo-constants';
import { authStorage } from '@/stores/authStore';
import { Platform } from 'react-native';
import { callLogoutCallback } from '@/context/AuthContext';

const isWeb = Platform.OS === 'web';

// Handles access token refresh using the refresh token
export async function refreshAccessToken(): Promise<string | null> {

    const refreshToken = await authStorage.getRefreshToken();

    try {
        if (!isWeb && !refreshToken) {
            console.error('Unable to refreshToken. No refresh token found. User needs to log in again.');
            throw new Error('Missing refresh token');
        }

        const response = await axios.post(
            `${Constants.expoConfig?.extra?.API_URL}/auth/refresh`,
            { refreshToken },
            { withCredentials: isWeb }
        );

        const { newAccessToken, newRefreshToken } = response.data;

        if (!isWeb) {

            const email = await authStorage.getEmail();

            if (email) {
                await authStorage.saveCredentials(email, newAccessToken);
                await authStorage.saveRefreshToken(newRefreshToken);
            }
        }

        return newAccessToken;

    } catch (error) {

        console.error('Logging out. Error refreshing access token.:', error);
        callLogoutCallback();
    }
    return null;
}