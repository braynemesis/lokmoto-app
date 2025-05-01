import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Calendar, Clock, ChevronRight, CheckCircle, XCircle, AlertCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

// Mock data for proposals
const MOCK_PROPOSALS = [
  {
    id: '1',
    motorcycle: {
      id: '1',
      name: 'Honda CB 500F',
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=300&auto=format&fit=crop',
    },
    startDate: new Date('2025-06-15'),
    endDate: new Date('2025-06-20'),
    totalAmount: 720,
    status: 'pending',
    createdAt: new Date('2025-06-01'),
    purpose: 'Viagem de fim de semana',
    renter: {
      id: '1',
      name: 'João Silva',
    },
    owner: {
      id: '2',
      name: 'Carlos Oliveira',
    }
  },
  {
    id: '2',
    motorcycle: {
      id: '2',
      name: 'Yamaha MT-07',
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=300&auto=format&fit=crop',
    },
    startDate: new Date('2025-07-01'),
    endDate: new Date('2025-07-05'),
    totalAmount: 825,
    status: 'approved',
    createdAt: new Date('2025-06-10'),
    purpose: 'Uso diário para trabalho',
    renter: {
      id: '1',
      name: 'João Silva',
    },
    owner: {
      id: '3',
      name: 'Mariana Costa',
    }
  },
  {
    id: '3',
    motorcycle: {
      id: '3',
      name: 'Kawasaki Z900',
      image: 'https://images.unsplash.com/photo-1580310614729-ccd69652491d?q=80&w=300&auto=format&fit=crop',
    },
    startDate: new Date('2025-06-25'),
    endDate: new Date('2025-06-30'),
    totalAmount: 990,
    status: 'rejected',
    createdAt: new Date('2025-06-05'),
    purpose: 'Passeio de fim de semana',
    renter: {
      id: '1',
      name: 'João Silva',
    },
    owner: {
      id: '4',
      name: 'Roberto Almeida',
    }
  },
];

// Mock data for owner proposals
const MOCK_OWNER_PROPOSALS = [
  {
    id: '4',
    motorcycle: {
      id: '1',
      name: 'Honda CB 500F',
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=300&auto=format&fit=crop',
    },
    startDate: new Date('2025-06-22'),
    endDate: new Date('2025-06-25'),
    totalAmount: 396,
    status: 'pending',
    createdAt: new Date('2025-06-12'),
    purpose: 'Viagem a trabalho',
    renter: {
      id: '5',
      name: 'Ana Souza',
    },
    owner: {
      id: '2',
      name: 'Carlos Oliveira',
    }
  },
  {
    id: '5',
    motorcycle: {
      id: '1',
      name: 'Honda CB 500F',
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=300&auto=format&fit=crop',
    },
    startDate: new Date('2025-07-10'),
    endDate: new Date('2025-07-15'),
    totalAmount: 660,
    status: 'pending',
    createdAt: new Date('2025-06-14'),
    purpose: 'Passeio de férias',
    renter: {
      id: '6',
      name: 'Pedro Mendes',
    },
    owner: {
      id: '2',
      name: 'Carlos Oliveira',
    }
  },
];

export default function ProposalsScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProposals();
  }, [activeTab, user]);

  const fetchProposals = async () => {
    setLoading(true);
    
    try {
      // In a real app, fetch from Supabase
      // For now, use mock data
      if (activeTab === 'sent') {
        setProposals(MOCK_PROPOSALS);
      } else {
        setProposals(MOCK_OWNER_PROPOSALS);
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
      Alert.alert('Erro', 'Não foi possível carregar as propostas.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProposal = async (proposalId: string) => {
    try {
      // In a real app, update in Supabase
      // For now, update local state
      setProposals(prev => 
        prev.map(proposal => 
          proposal.id === proposalId 
            ? { ...proposal, status: 'approved' } 
            : proposal
        )
      );
      
      Alert.alert(
        'Proposta Aprovada',
        'A proposta foi aprovada com sucesso. O contrato será enviado para o locatário.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error approving proposal:', error);
      Alert.alert('Erro', 'Não foi possível aprovar a proposta.');
    }
  };

  const handleRejectProposal = async (proposalId: string) => {
    try {
      // In a real app, update in Supabase
      // For now, update local state
      setProposals(prev => 
        prev.map(proposal => 
          proposal.id === proposalId 
            ? { ...proposal, status: 'rejected' } 
            : proposal
        )
      );
      
      Alert.alert(
        'Proposta Recusada',
        'A proposta foi recusada com sucesso.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error rejecting proposal:', error);
      Alert.alert('Erro', 'Não foi possível recusar a proposta.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return colors.warning;
      case 'approved':
        return colors.success;
      case 'rejected':
        return colors.danger;
      default:
        return colors.textLight;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'approved':
        return 'Aprovada';
      case 'rejected':
        return 'Recusada';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle size={16} color={colors.warning} />;
      case 'approved':
        return <CheckCircle size={16} color={colors.success} />;
      case 'rejected':
        return <XCircle size={16} color={colors.danger} />;
      default:
        return null;
    }
  };

  const renderProposalItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.proposalItem}
      onPress={() => router.push(`/proposal/${item.id}`)}
    >
      <View style={styles.proposalHeader}>
        <Text style={styles.motorcycleName}>{item.motorcycle.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          {getStatusIcon(item.status)}
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>
      
      <View style={styles.proposalInfo}>
        <View style={styles.infoItem}>
          <Calendar size={16} color={colors.textLight} />
          <Text style={styles.infoText}>
            {item.startDate.toLocaleDateString()} - {item.endDate.toLocaleDateString()}
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Clock size={16} color={colors.textLight} />
          <Text style={styles.infoText}>
            Enviada em {item.createdAt.toLocaleDateString()}
          </Text>
        </View>
      </View>
      
      <View style={styles.proposalFooter}>
        <Text style={styles.priceText}>R$ {item.totalAmount.toFixed(2)}</Text>
        
        {activeTab === 'received' && item.status === 'pending' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleRejectProposal(item.id)}
            >
              <XCircle size={20} color={colors.danger} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => handleApproveProposal(item.id)}
            >
              <CheckCircle size={20} color={colors.success} />
            </TouchableOpacity>
          </View>
        )}
        
        {(activeTab === 'sent' || item.status !== 'pending') && (
          <ChevronRight size={20} color={colors.textLight} />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {activeTab === 'sent' 
          ? 'Você ainda não enviou nenhuma proposta.' 
          : 'Você ainda não recebeu nenhuma proposta.'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Propostas</Text>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'sent' && styles.activeTabButton]}
          onPress={() => setActiveTab('sent')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'sent' && styles.activeTabButtonText]}>
            Enviadas
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'received' && styles.activeTabButton]}
          onPress={() => setActiveTab('received')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'received' && styles.activeTabButtonText]}>
            Recebidas
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={proposals}
        keyExtractor={(item) => item.id}
        renderItem={renderProposalItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
        refreshing={loading}
        onRefresh={fetchProposals}
      />
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
  listContent: {
    padding: 20,
    paddingBottom: 80,
  },
  proposalItem: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  proposalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  motorcycleName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textDark,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginLeft: 4,
  },
  proposalInfo: {
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textDark,
    marginLeft: 8,
  },
  proposalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  priceText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  approveButton: {
    backgroundColor: `${colors.success}20`,
  },
  rejectButton: {
    backgroundColor: `${colors.danger}20`,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
});