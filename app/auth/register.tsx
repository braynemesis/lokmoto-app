import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { colors } from '@/constants/colors';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function RegisterScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSignUp = async () => {
    if (!isLoaded) return;

    try {
      setLoading(true);
      setError('');

      const result = await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      });

      await setActive({ session: result.createdSessionId });
      router.replace('/auth/onboarding');
    } catch (err: any) {
      console.error('Error:', err.errors[0].message);
      setError('Ocorreu um erro ao criar sua conta. Por favor, verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
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
            source={{ uri: 'https://images.pexels.com/photos/2393821/pexels-photo-2393821.jpeg?auto=compress&cs=tinysrgb&w=1200' }} 
            style={styles.logo}
          />
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Cadastre-se para começar</Text>
        </View>

        <View style={styles.form}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          
          <Input
            label="Nome"
            placeholder="Digite seu nome"
            value={firstName}
            onChangeText={setFirstName}
          />
          
          <Input
            label="Sobrenome"
            placeholder="Digite seu sobrenome"
            value={lastName}
            onChangeText={setLastName}
          />
          
          <Input
            label="Email"
            placeholder="Digite seu email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <Input
            label="Senha"
            placeholder="Crie uma senha"
            value={password}
            onChangeText={setPassword}
            isPassword
          />
          
          <Button
            title="Cadastrar"
            onPress={handleSignUp}
            loading={loading}
            style={styles.signUpButton}
          />
          
          <Text style={styles.termsText}>
            Ao se cadastrar, você concorda com nossos Termos de Serviço e Política de Privacidade
          </Text>
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
    marginBottom: 40,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 10,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
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
  form: {
    marginBottom: 30,
  },
  errorContainer: {
    backgroundColor: `${colors.danger}15`,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.danger,
    textAlign: 'center',
  },
  signUpButton: {
    marginTop: 10,
    marginBottom: 16,
  },
  termsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
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