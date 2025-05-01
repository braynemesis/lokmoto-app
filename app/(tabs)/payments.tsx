import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreditCard, Wallet, Receipt, Plus, ChevronRight, ArrowDown, ArrowUp } from 'lucide-react-native';
import { colors } from '@/constants/colors';

const PAYMENT_HISTORY = [
  {
    id: '1',
    type: 'payment',
    description: 'Pagamento - Honda CB 500F',
    date: '15 Jun 2025',
    amount: 120.00,
    status: 'completed',
  },
  {
    id: '2',
    type: 'deposit',
    description: 'Recarga de carteira',
    date: '10 Jun 2025',
    amount: 500.00,
    status: 'completed',
  },
  {
    id: '3',
    type: 'payment',
    description: 'Pagamento - Yamaha MT-07',
    date: '05 Jun 2025',
    amount: 150.00,
    status: 'completed',
  },
  {
    id: '4',
    type: 'payment',
    description: 'Pagamento - Kawasaki Z900',
    date: '28 Mai 2025',
    amount: 180.00,
    status: 'completed',
  },
];

export default function PaymentsScreen() {
  const [activeTab, setActiveTab] = useState('wallet');
  const [walletBalance, setWalletBalance] = useState(250.0);

  const renderWalletTab = () => (
    <View style={styles.tabContent}>
      {/* <View style={styles.walletCard}>
        <View style={styles.walletHeader}>
          <Text style={styles.walletTitle}>Saldo disponível</Text>
          <Wallet size={24} color={colors.white} />
        </View>
        <Text style={styles.walletBalance}>R$ {walletBalance.toFixed(2)}</Text>
        <View style={styles.walletActions}>
          <TouchableOpacity style={styles.walletButton}>
            <Plus size={20} color={colors.primary} />
            <Text style={styles.walletButtonText}>Adicionar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.walletButton}>
            <ArrowUp size={20} color={colors.primary} />
            <Text style={styles.walletButtonText}>Transferir</Text>
          </TouchableOpacity>
        </View>
      </View> */}

      <View style={styles.historyContainer}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Histórico</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>Ver tudo</Text>
          </TouchableOpacity>
        </View>

        {PAYMENT_HISTORY.map((transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={styles.transactionIconContainer}>
              {transaction.type === 'payment' ? (
                <ArrowUp size={20} color={colors.danger} />
              ) : (
                <ArrowDown size={20} color={colors.success} />
              )}
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionDescription}>{transaction.description}</Text>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
            <Text style={[
              styles.transactionAmount,
              transaction.type === 'payment' ? styles.amountNegative : styles.amountPositive
            ]}>
              {transaction.type === 'payment' ? '-' : '+'} R$ {transaction.amount.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderPaymentMethodsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Métodos de Pagamento</Text>
      
      <TouchableOpacity style={styles.addPaymentButton}>
        <Plus size={20} color={colors.primary} />
        <Text style={styles.addPaymentText}>Adicionar novo método de pagamento</Text>
      </TouchableOpacity>
      
      <View style={styles.paymentMethodsContainer}>
        <TouchableOpacity style={styles.paymentMethodItem}>
          <View style={styles.paymentMethodIcon}>
            <CreditCard size={24} color={colors.primary} />
          </View>
          <View style={styles.paymentMethodInfo}>
            <Text style={styles.paymentMethodTitle}>Cartão de Crédito</Text>
            <Text style={styles.paymentMethodSubtitle}>**** **** **** 4589</Text>
          </View>
          <ChevronRight size={20} color={colors.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.paymentMethodItem}>
          <View style={styles.paymentMethodIcon}>
            <Image 
              source={{ uri: 'https://logospng.org/download/pix/logo-pix-512.png' }} 
              style={styles.pixIcon}
            />
          </View>
          <View style={styles.paymentMethodInfo}>
            <Text style={styles.paymentMethodTitle}>Pix</Text>
            <Text style={styles.paymentMethodSubtitle}>Pagamento instantâneo</Text>
          </View>
          <ChevronRight size={20} color={colors.textLight} />
        </TouchableOpacity>
        
        {/* <TouchableOpacity style={styles.paymentMethodItem}>
          <View style={styles.paymentMethodIcon}>
            <Receipt size={24} color={colors.primary} />
          </View>
          <View style={styles.paymentMethodInfo}>
            <Text style={styles.paymentMethodTitle}>Boleto Bancário</Text>
            <Text style={styles.paymentMethodSubtitle}>Prazo de 1-3 dias úteis</Text>
          </View>
          <ChevronRight size={20} color={colors.textLight} />
        </TouchableOpacity> */}
      </View>
    </View>
  );

  const renderInvoicesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Faturas</Text>
      
      <View style={styles.invoicesContainer}>
        <TouchableOpacity style={styles.invoiceItem}>
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceTitle}>Fatura - Honda CB 500F</Text>
            <Text style={styles.invoiceDate}>Vencimento: 20 Jun 2025</Text>
          </View>
          <View style={styles.invoiceAmount}>
            <Text style={styles.invoiceAmountText}>R$ 120,00</Text>
            <View style={[styles.invoiceStatus, styles.invoiceStatusPending]}>
              <Text style={styles.invoiceStatusText}>Pendente</Text>
            </View>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.invoiceItem}>
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceTitle}>Fatura - Yamaha MT-07</Text>
            <Text style={styles.invoiceDate}>Vencimento: 15 Jun 2025</Text>
          </View>
          <View style={styles.invoiceAmount}>
            <Text style={styles.invoiceAmountText}>R$ 150,00</Text>
            <View style={[styles.invoiceStatus, styles.invoiceStatusPaid]}>
              <Text style={styles.invoiceStatusText}>Pago</Text>
            </View>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.invoiceItem}>
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceTitle}>Fatura - Kawasaki Z900</Text>
            <Text style={styles.invoiceDate}>Vencimento: 05 Jun 2025</Text>
          </View>
          <View style={styles.invoiceAmount}>
            <Text style={styles.invoiceAmountText}>R$ 180,00</Text>
            <View style={[styles.invoiceStatus, styles.invoiceStatusPaid]}>
              <Text style={styles.invoiceStatusText}>Pago</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pagamentos</Text>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'wallet' && styles.activeTabButton]}
          onPress={() => setActiveTab('wallet')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'wallet' && styles.activeTabButtonText]}>
            Transações
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'methods' && styles.activeTabButton]}
          onPress={() => setActiveTab('methods')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'methods' && styles.activeTabButtonText]}>
            Métodos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'invoices' && styles.activeTabButton]}
          onPress={() => setActiveTab('invoices')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'invoices' && styles.activeTabButtonText]}>
            Faturas
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'wallet' && renderWalletTab()}
        {activeTab === 'methods' && renderPaymentMethodsTab()}
        {activeTab === 'invoices' && renderInvoicesTab()}
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
  scrollContent: {
    padding: 20,
  },
  tabContent: {
    flex: 1,
  },
  walletCard: {
    backgroundColor: colors.success,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  walletTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
  },
  walletBalance: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: colors.white,
    marginBottom: 16,
  },
  walletActions: {
    flexDirection: 'row',
  },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  walletButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primary,
    marginLeft: 8,
  },
  historyContainer: {
    marginBottom: 24,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: colors.textDark,
  },
  viewAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primary,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.inputBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 4,
  },
  transactionDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textLight,
  },
  transactionAmount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  amountPositive: {
    color: colors.success,
  },
  amountNegative: {
    color: colors.danger,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: colors.textDark,
    marginBottom: 16,
  },
  addPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  addPaymentText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primary,
    marginLeft: 12,
  },
  paymentMethodsContainer: {
    marginBottom: 24,
  },
  paymentMethodItem: {
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
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(83, 127, 231, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  pixIcon: {
    width: 24,
    height: 24,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 4,
  },
  paymentMethodSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textLight,
  },
  invoicesContainer: {
    marginBottom: 24,
  },
  invoiceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  invoiceInfo: {
    flex: 1,
  },
  invoiceTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 4,
  },
  invoiceDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textLight,
  },
  invoiceAmount: {
    alignItems: 'flex-end',
  },
  invoiceAmountText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 4,
  },
  invoiceStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  invoiceStatusPending: {
    backgroundColor: 'rgba(255, 159, 28, 0.2)',
  },
  invoiceStatusPaid: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  invoiceStatusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.textDark,
  },
});