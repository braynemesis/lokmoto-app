import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';

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
  signUp: (email: string, password: string, userType: UserType) => Promise<void>;
  signOut: () => Promise<void>;
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

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profile) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              userType: profile?.user_type || null,
              fullName: profile?.full_name,
              profileComplete: profile?.profile_complete,
              verified: profile?.verified,
            });

            // Redirecionar baseado no status do perfil
            if (!profile?.profile_complete) {
              router.replace(profile?.user_type === 'renter' ? '/auth/renter-profile' : '/auth/owner-profile');
            } else if (!profile?.verified) {
              router.replace('/auth/verification-pending');
            } else {
              router.replace('/(tabs)');
            }
          } else {
            setUser(null);
            router.replace('/');
          }
        } else {
          setUser(null);
          queryClient.clear(); // Limpar cache do React Query
          router.replace('/');
        }
        setLoading(false);
      }
    );

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
          .maybeSingle();

        if (profile) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            userType: profile?.user_type || null,
            fullName: profile?.full_name,
            profileComplete: profile?.profile_complete,
            verified: profile?.verified,
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
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing in:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function signUp(email: string, password: string, userType: UserType) {
    try {
      setLoading(true);
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
              profile_complete: false,
              verified: false,
            },
          ]);

        if (profileError) throw profileError;
      }
    } catch (error: any) {
      console.error('Error signing up:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      queryClient.clear(); // Limpar cache do React Query
      router.replace('/');
    } catch (error: any) {
      console.error('Error signing out:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateUserProfile(data: Partial<User>) {
    try {
      if (!user) throw new Error('No user logged in');

      setLoading(true);
      
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
      throw error;
    } finally {
      setLoading(false);
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