import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Link, Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Bike, Store, User } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1000&auto=format&fit=crop' }} 
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

        <View style={styles.content}>
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
              <Text style={styles.secondaryButtonText}>Cadastrar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Acesso Rápido</Text>
            
            <View style={styles.quickAccessContainer}>
              <TouchableOpacity style={styles.quickAccessButton} onPress={() => router.push('/auth/register?type=renter')}>
                <View style={styles.quickAccessIconContainer}>
                  <User size={24} color={colors.primary} />
                </View>
                <Text style={styles.quickAccessText}>Locatários</Text>
                <ChevronRight size={16} color={colors.textLight} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickAccessButton} onPress={() => router.push('/auth/register?type=owner')}>
                <View style={styles.quickAccessIconContainer}>
                  <Store size={24} color={colors.primary} />
                </View>
                <Text style={styles.quickAccessText}>Locadores</Text>
                <ChevronRight size={16} color={colors.textLight} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAccessButton} onPress={() => router.push('/auth/contract')}>
                <View style={styles.quickAccessIconContainer}>
                  <Store size={24} color={colors.primary} />
                </View>
                <Text style={styles.quickAccessText}>Contratos</Text>
                <ChevronRight size={16} color={colors.textLight} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.featuredSection}>
            <Text style={styles.sectionTitle}>Motos em Destaque</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
              {[1, 2, 3].map((item) => (
                <View key={item} style={styles.featuredItem}>
                  <Image 
                    source={{ uri: `https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=300&auto=format&fit=crop` }} 
                    style={styles.featuredImage}
                  />
                  <View style={styles.featuredInfo}>
                    <Text style={styles.featuredTitle}>Honda CB 500</Text>
                    <Text style={styles.featuredPrice}>R$ 120/dia</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
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
          <Link href="/contact" asChild>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Contato</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    position: 'relative',
    height: 250,
    width: '100%',
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#fff',
  },
  content: {
    padding: 20,
  },
  authButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    marginBottom: 15,
    color: colors.textDark,
  },
  quickAccessContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    overflow: 'hidden',
  },
  quickAccessButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  quickAccessIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(83, 127, 231, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickAccessText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.textDark,
    flex: 1,
  },
  featuredSection: {
    marginBottom: 30,
  },
  featuredScroll: {
    marginLeft: -5,
  },
  featuredItem: {
    width: 200,
    marginRight: 15,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f8f8f8',
  },
  featuredImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  featuredInfo: {
    padding: 12,
  },
  featuredTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.textDark,
  },
  featuredPrice: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primary,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
    marginTop: 'auto',
  },
  footerLink: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textLight,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
});