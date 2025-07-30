import * as Keychain from 'react-native-keychain';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const EMAIL_KEY = 'email';

export const authStorage = {
  // Save email and access token securely (mobile only)
  async saveCredentials(email: string, token: string) {
    if (Platform.OS === 'web') return;

    const result = await Keychain.setGenericPassword(email, token, {service: ACCESS_TOKEN_KEY});
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

  async getEmail(): Promise<string | null> {
    if (Platform.OS === 'web') return null;

    try {
      const credentials = await Keychain.getGenericPassword({ service: ACCESS_TOKEN_KEY });
      return credentials ? credentials.username : null;

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

  // Save email separately (optional, e.g. for pre-filling forms)
  async saveEmail(email: string) {
    if (Platform.OS === 'web') return;
    const result = await Keychain.setGenericPassword(EMAIL_KEY, email, {
      service: EMAIL_KEY,
    });
    if (!result) throw new Error('Failed to save email credential');
  },

  async loadEmail(): Promise<string | null> {
    if (Platform.OS === 'web') return null;
    const credentials = await Keychain.getGenericPassword({ service: EMAIL_KEY });
    return credentials ? credentials.password : null;
  },

  async clearEmail() {
    if (Platform.OS === 'web') return;
    const result = await Keychain.resetGenericPassword({ service: EMAIL_KEY });
    if (!result) throw new Error('Failed to clear email credential');
  },
};
