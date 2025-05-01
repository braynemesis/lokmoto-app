import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Custom storage implementation for web
class WebStorage {
  async getItem(key: string) {
    return localStorage.getItem(key);
  }

  async setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  async removeItem(key: string) {
    localStorage.removeItem(key);
  }
}

// SecureStore adapter for Supabase - only used on native platforms
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

// Choose the appropriate storage mechanism based on platform
const storage = Platform.OS === 'web' ? new WebStorage() : ExpoSecureStoreAdapter;

// Initialize Supabase
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hxaabjrkhblzlthtcgkh.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4YWFianJraGJsemx0aHRjZ2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMDgzNzIsImV4cCI6MjA1NjY4NDM3Mn0.ec4HKSWE8I-XAZ45OU2M9n3bCkJmOxNwg1epl-1MLPc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});