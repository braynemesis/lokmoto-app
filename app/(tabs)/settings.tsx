import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Bell, Shield, HelpCircle as HelpCircle, LogOut, ChevronRight, MessageCircle, CreditCard, FileText } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  
  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    paymentReminders: true,
    promotionalOffers: false,
  }); 
  
  const handleToggleSwitch = (setting: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair da sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          onPress: signOut,
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Configurações</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <View style={styles.profileImageContainer}>
              <User size={32} color={colors.white} />
            </View>
            <View>
              <Text style={styles.profileName}>{user?.fullName || 'Usuário'}</Text>
              <Text style={styles.profileEmail}>{user?.email || 'email@exemplo.com'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Editar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <User size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingText}>Dados Pessoais</Text>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <CreditCard size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingText}>Métodos de Pagamento</Text>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Shield size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingText}>Segurança</Text>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificações</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Bell size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingText}>Notificações Push</Text>
            <Switch
              value={notificationSettings.pushNotifications}
              onValueChange={() => handleToggleSwitch('pushNotifications')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <MessageCircle size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingText}>Notificações por Email</Text>
            <Switch
              value={notificationSettings.emailNotifications}
              onValueChange={() => handleToggleSwitch('emailNotifications')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <CreditCard size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingText}>Lembretes de Pagamento</Text>
            <Switch
              value={notificationSettings.paymentReminders}
              onValueChange={() => handleToggleSwitch('paymentReminders')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <MessageCircle size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingText}>Ofertas Promocionais</Text>
            <Switch
              value={notificationSettings.promotionalOffers}
              onValueChange={() => handleToggleSwitch('promotionalOffers')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suporte</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <HelpCircle size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingText}>Central de Ajuda</Text>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <MessageCircle size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingText}>Fale Conosco</Text>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <FileText size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingText}>Termos de Uso</Text>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Shield size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingText}>Política de Privacidade</Text>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <LogOut size={20} color={colors.danger} />
          <Text style={styles.signOutText}>Sair da Conta</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Versão 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: colors.textDark,
  },
  scrollContent: {
    padding: 20,
  },
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textLight,
  },
  editProfileButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  editProfileText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: colors.textDark,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(83, 127, 231, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.textDark,
    flex: 1,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    marginBottom: 24,
  },
  signOutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.danger,
    marginLeft: 12,
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
  },
});