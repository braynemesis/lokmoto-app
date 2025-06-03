import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Link, Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { colors } from '@/constants/colors';

export default function HomeScreen() {
  const { user } = useAuth();

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/2393821/pexels-photo-2393821.jpeg?auto=compress&cs=tinysrgb&w=1200' }} 
            style={styles.headerImage}
          />
          <View style={styles.overlay}>
            <Image 
              source={require('@/assets/images/logo.jpg')} 
              style={styles.logo}
            />
            <Text style={styles.title}>LokMoto</Text>
            <Text style={styles.subtitle}>Alugue motos com facilidade</Text>
          </View>
        </View>

        <View style={styles.authContainer}>
          <Text style={styles.welcomeText}>Bem-vindo ao LokMoto</Text>
          <Text style={styles.descriptionText}>
            A plataforma que conecta proprietários e locatários de motos de forma segura e prática.
          </Text>

          <View style={styles.authButtons}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => router.push('/auth/login')}
            >
              <Text style={styles.primaryButtonText}>Entrar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => router.push('/auth/register')}
            >
              <Text style={styles.secondaryButtonText}>Criar uma conta</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Link href="/privacy-policy" asChild>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Política de Privacidade</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/terms" asChild>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Termos de Serviço</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  header: {
    height: '50%',
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.white,
  },
  authContainer: {
    padding: 20,
    marginTop: -20,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
  },
  welcomeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: colors.textDark,
    marginBottom: 12,
    textAlign: 'center',
  },
  descriptionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  authButtons: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.white,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 20,
    backgroundColor: colors.white,
  },
  footerLink: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textLight,
  },
});