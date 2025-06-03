import { Platform } from 'react-native';
import { ClerkProvider as BaseClerkProvider } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

const tokenCache = {
  async getToken(key: string) {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      }
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
        return;
      }
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <BaseClerkProvider
      publishableKey="pk_test_Y29tcGxldGUtYW1vZWJhLTg1LmNsZXJrLmFjY291bnRzLmRldiQ"
      tokenCache={tokenCache}
      afterSignInUrl="/(tabs)"
      afterSignUpUrl="/auth/onboarding"
      signInUrl="/auth/login"
      signUpUrl="/auth/register"
    >
      {children}
    </BaseClerkProvider>
  );
}