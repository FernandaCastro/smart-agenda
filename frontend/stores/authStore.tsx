import * as Keychain from 'react-native-keychain';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const authStorage = {
  // Save email and access token securely (mobile only)
  async saveCredentials(user: any, accessToken: string) {
    if (Platform.OS === 'web') return;

    const result = await Keychain.setGenericPassword(JSON.stringify(user), accessToken, {service: ACCESS_TOKEN_KEY});
    if (!result) throw new Error('Failed to save credentials');
  },

  async getAccessToken(): Promise<string | null> {
    if (Platform.OS === 'web') return null;

    try {
      const credentials = await Keychain.getGenericPassword({ service: ACCESS_TOKEN_KEY });
      return credentials ? credentials.password : null;

    } catch (error) {
      console.error('Error accessing AccessToken Keychain:', error);
      return null;
    }
  },

  async getUser(): Promise<any | null> {
    if (Platform.OS === 'web') return null;

    try {
      const credentials = await Keychain.getGenericPassword({ service: ACCESS_TOKEN_KEY });
      return credentials ? JSON.parse(credentials.username) : null;

    } catch (error) {
      console.error('Error accessing Email Keychain:', error);
      return null;
    }

  },

  async clearCredentials() {
    if (Platform.OS === 'web') return;

    const result = await Keychain.resetGenericPassword({ service: ACCESS_TOKEN_KEY });
    if (!result) throw new Error('Failed to clear credentials');
  },

  // Refresh Token
  async saveRefreshToken(token: string) {
    if (Platform.OS === 'web') return;

    const result = await Keychain.setGenericPassword(REFRESH_TOKEN_KEY, token, {
      service: REFRESH_TOKEN_KEY,
    });
    if (!result) throw new Error('Failed to save refresh token');
  },

  async getRefreshToken(): Promise<string | null> {
    if (Platform.OS === 'web') return null;

    try {
      const credentials = await Keychain.getGenericPassword({ service: REFRESH_TOKEN_KEY });
      return credentials ? credentials.password : null;
    } catch (error) {
      console.error('Error accessing AccessToken Keychain:', error);
      return null;
    }
  },

  async clearRefreshToken() {
    if (Platform.OS === 'web') return;
    const result = await Keychain.resetGenericPassword({ service: REFRESH_TOKEN_KEY });
    if (!result) throw new Error('Failed to clear refresh token');
  },
};
