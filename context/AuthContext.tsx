import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

type UserType = 'renter' | 'owner' | null;

interface User {
  id: string;
  email: string;
  userType: UserType;
  fullName?: string;
  profileComplete?: boolean;
  verified?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userType: UserType, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              userType: profile.user_type,
              fullName: profile.full_name,
              profileComplete: profile.profile_complete,
              verified: profile.verified,
            });

            if (!profile.profile_complete) {
              router.replace(profile.user_type === 'renter' ? '/auth/renter-profile' : '/auth/owner-profile');
            } else if (!profile.verified) {
              router.replace('/auth/verification-pending');
            } else {
              router.replace('/(tabs)');
            }
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        queryClient.clear();
        router.replace('/');
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function checkUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            userType: profile.user_type,
            fullName: profile.full_name,
            profileComplete: profile.profile_complete,
            verified: profile.verified,
          });
        }
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing in:', error.message);
      Alert.alert('Error', error.message);
      throw error;
    }
  }

  async function signUp(email: string, password: string, userType: UserType, fullName: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email,
              user_type: userType,
              full_name: fullName,
              profile_complete: false,
              verified: false,
            },
          ]);

        if (profileError) throw profileError;
      }
    } catch (error: any) {
      console.error('Error signing up:', error.message);
      Alert.alert('Error', error.message);
      throw error;
    }
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      queryClient.clear();
      router.replace('/');
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      Alert.alert('Error', error.message);
    }
  }

  async function resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      Alert.alert(
        'Password Reset',
        'Check your email for password reset instructions.'
      );
    } catch (error: any) {
      console.error('Error resetting password:', error.message);
      Alert.alert('Error', error.message);
      throw error;
    }
  }

  async function updateUserProfile(data: Partial<User>) {
    try {
      if (!user) throw new Error('No user logged in');

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.fullName,
          profile_complete: data.profileComplete,
          verified: data.verified,
        })
        .eq('id', user.id);

      if (error) throw error;

      setUser({ ...user, ...data });
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
      Alert.alert('Error', error.message);
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateUserProfile,
        isAuthenticated: !!user,
        isProfileComplete: !!user?.profileComplete,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}