import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Info, Clock, ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';

const NOTIFICATIONS = [
  {
    id: '1',
    type: 'alert',
    title: 'Pagamento Pendente',
    message: 'Você tem um pagamento pendente para a Honda CB 500F. Vencimento em 3 dias.',
    date: '15 Jun 2025',
    read: false,
  },
  {
    id: '2',
    type: 'success',
    title: 'Locação Aprovada',
    message: 'Sua solicitação de locação para a Yamaha MT-07 foi aprovada. Você já pode retirar a moto.',
    date: '10 Jun 2025',
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'Manutenção Programada',
    message: 'A moto Honda CB 500F tem uma manutenção programada para o dia 20/06. Entre em contato para agendar.',
    date: '08 Jun 2025',
    read: true,
  },
  {
    id: '4',
    type: 'warning',
    title: 'Documentação Pendente',
    message: 'Precisamos que você atualize sua CNH. Por favor, envie uma cópia atualizada.',
    date: '05 Jun 2025',
    read: true,
  },
  {
    id: '5',
    type: 'info',
    title: 'Promoção Especial',
    message: 'Aproveite nossa promoção de inverno! 20% de desconto em todas as locações acima de 7 dias.',
    date: '01 Jun 2025',
    read: true,
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : activeTab === 'unread' 
      ? notifications.filter(n => !n.read) 
      : notifications.filter(n => n.read);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle size={24} color={colors.danger} />;
      case 'success':
        return <CheckCircle size={24} color={colors.success} />;
      case 'info':
        return <Info size={24} color={colors.info} />;
      case 'warning':
        return <AlertTriangle size={24} color={colors.warning} />;
      default:
        return <Bell size={24} color={colors.primary} />;
    }
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.notificationItem, !item.read && styles.unreadNotification]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.notificationIconContainer}>
        {getNotificationIcon(item.type)}
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationDate}>{item.date}</Text>
        </View>
        <Text style={styles.notificationMessage}>{item.message}</Text>
      </View>
      <ChevronRight size={20} color={colors.textLight} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notificações</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAllReadText}>Marcar todas como lidas</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'all' && styles.activeTabButton]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'all' && styles.activeTabButtonText]}>
            Todas
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'unread' && styles.activeTabButton]}
          onPress={() => setActiveTab('unread')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'unread' && styles.activeTabButtonText]}>
            Não lidas {unreadCount > 0 && `(${unreadCount})`}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'read' && styles.activeTabButton]}
          onPress={() => setActiveTab('read')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'read' && styles.activeTabButtonText]}>
            Lidas
          </Text>
        </TouchableOpacity>
      </View>

      {filteredNotifications.length > 0 ? (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotificationItem}
          contentContainerStyle={styles.notificationsList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Bell size={48} color={colors.textLight} />
          <Text style={styles.emptyText}>Nenhuma notificação encontrada</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: colors.textDark,
  },
  markAllReadText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primary,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textLight,
  },
  activeTabButtonText: {
    color: colors.primary,
  },
  notificationsList: {
    padding: 20,
  },
  notificationItem: {
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
  unreadNotification: {
    backgroundColor: 'rgba(83, 127, 231, 0.05)',
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.inputBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
    marginRight: 8,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textDark,
  },
  notificationDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textLight,
  },
  notificationMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textDark,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.textLight,
    marginTop: 16,
  },
});