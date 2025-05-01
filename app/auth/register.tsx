import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useAuth } from '@/context/AuthContext';

export default function RegisterScreen() {
  const { signUp, loading } = useAuth();
  const params = useLocalSearchParams();
  const [userType, setUserType] = useState<'renter' | 'owner'>('renter');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  useEffect(() => {
    if (params.type === 'owner' || params.type === 'renter') {
      setUserType(params.type);
    }
  }, [params]);

  const validate = () => {
    const newErrors: {
      fullName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    
    if (!fullName) newErrors.fullName = 'Nome completo é obrigatório';
    
    if (!email) newErrors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email inválido';
    
    if (!password) newErrors.password = 'Senha é obrigatória';
    else if (password.length < 6) newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    
    if (!confirmPassword) newErrors.confirmPassword = 'Confirme sua senha';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'As senhas não coincidem';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    
    try {
      await signUp(email, password, userType);
      
      // After signup, redirect to the appropriate profile completion page
      if (userType === 'renter') {
        router.push('/auth/renter-profile');
      } else {
        router.push('/auth/owner-profile');
      }
    } catch (error: any) {
      Alert.alert('Erro ao cadastrar', error.message || 'Ocorreu um erro ao criar sua conta. Tente novamente.');
    }
  };

  const toggleUserType = () => {
    setUserType(userType === 'renter' ? 'owner' : 'renter');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.textDark} />
          </TouchableOpacity>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=400&auto=format&fit=crop' }} 
            style={styles.logo}
          />
          <Text style={styles.title}>Criar uma conta</Text>
          <Text style={styles.subtitle}>Cadastre-se como {userType === 'renter' ? 'Locatário' : 'Locador'}</Text>
        </View>

        <View style={styles.userTypeToggle}>
          <TouchableOpacity
            style={[
              styles.userTypeButton,
              userType === 'renter' && styles.userTypeButtonActive
            ]}
            onPress={() => setUserType('renter')}
          >
            <Text style={[
              styles.userTypeText,
              userType === 'renter' && styles.userTypeTextActive
            ]}>Locatário</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.userTypeButton,
              userType === 'owner' && styles.userTypeButtonActive
            ]}
            onPress={() => setUserType('owner')}
          >
            <Text style={[
              styles.userTypeText,
              userType === 'owner' && styles.userTypeTextActive
            ]}>Locador</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Input
            label="Nome Completo"
            placeholder="Seu nome completo"
            value={fullName}
            onChangeText={setFullName}
            error={errors.fullName}
            leftIcon={<User size={20} color={colors.textLight} />}
          />
          
          <Input
            label="Email"
            placeholder="Seu email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            leftIcon={<Mail size={20} color={colors.textLight} />}
          />
          
          <Input
            label="Senha"
            placeholder="Sua senha"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            leftIcon={<Lock size={20} color={colors.textLight} />}
            isPassword
          />
          
          <Input
            label="Confirmar Senha"
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={errors.confirmPassword}
            leftIcon={<Lock size={20} color={colors.textLight} />}
            isPassword
          />
          
          <Button
            title="Cadastrar"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem uma conta?</Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text style={styles.footerLink}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 10,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: colors.textDark,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
  userTypeToggle: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: colors.inputBg,
    borderRadius: 8,
    padding: 4,
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  userTypeButtonActive: {
    backgroundColor: colors.white,
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userTypeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textLight,
  },
  userTypeTextActive: {
    color: colors.primary,
  },
  form: {
    marginBottom: 20,
  },
  registerButton: {
    marginTop: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingVertical: 20,
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textLight,
    marginRight: 5,
  },
  footerLink: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.primary,
  },
});