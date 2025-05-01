import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  FileText,
  Send
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

// Mock data for proposals
const MOCK_PROPOSALS = {
  '1': {
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
    additionalInfo: 'Preciso da moto para uma viagem com amigos para o litoral. Tenho experiência com motos de alta cilindrada.',
    renter: {
      id: '1',
      name: 'João Silva',
      phone: '(11) 98765-4321',
      email: 'joao.silva@email.com',
    },
    owner: {
      id: '2',
      name: 'Carlos Oliveira',
      phone: '(11) 91234-5678',
      email: 'carlos.oliveira@email.com',
    }
  },
  '2': {
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
    additionalInfo: 'Preciso da moto para me deslocar ao trabalho durante uma semana enquanto meu veículo está na oficina.',
    renter: {
      id: '1',
      name: 'João Silva',
      phone: '(11) 98765-4321',
      email: 'joao.silva@email.com',
    },
    owner: {
      id: '3',
      name: 'Mariana Costa',
      phone: '(11) 97654-3210',
      email: 'mariana.costa@email.com',
    },
    contractSent: true,
    contractSigned: false
  },
  '3': {
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
    additionalInfo: 'Gostaria de alugar a moto para um passeio no fim de semana com meu grupo de motociclistas.',
    rejectionReason: 'Moto já está reservada para este período.',
    renter: {
      id: '1',
      name: 'João Silva',
      phone: '(11) 98765-4321',
      email: 'joao.silva@email.com',
    },
    owner: {
      id: '4',
      name: 'Roberto Almeida',
      phone: '(11) 98877-6655',
      email: 'roberto.almeida@email.com',
    }
  },
  '4': {
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
    additionalInfo: 'Preciso da moto para uma viagem de trabalho de 3 dias.',
    renter: {
      id: '5',
      name: 'Ana Souza',
      phone: '(11) 91122-3344',
      email: 'ana.souza@email.com',
    },
    owner: {
      id: '2',
      name: 'Carlos Oliveira',
      phone: '(11) 91234-5678',
      email: 'carlos.oliveira@email.com',
    }
  },
  '5': {
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
    additionalInfo: 'Gostaria de alugar a moto para um passeio durante minhas férias.',
    renter: {
      id: '6',
      name: 'Pedro Mendes',
      phone: '(11) 95566-7788',
      email: 'pedro.mendes@email.com',
    },
    owner: {
      id: '2',
      name: 'Carlos Oliveira',
      phone: '(11) 91234-5678',
      email: 'carlos.oliveira@email.com',
    }
  },
};

export default function ProposalDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchProposal();
  }, [id]);

  const fetchProposal = async () => {
    setLoading(true);
    
    try {
      // In a real app, fetch from Supabase
      // For now, use mock data
      if (id && typeof id === 'string' && MOCK_PROPOSALS[id]) {
        setProposal(MOCK_PROPOSALS[id]);
      } else {
        Alert.alert('Erro', 'Proposta não encontrada.');
        router.back();
      }
    } catch (error) {
      console.error('Error fetching proposal:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes da proposta.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProposal = async () => {
    setActionLoading(true);
    
    try {
      // In a real app, update in Supabase
      // For now, update local state
      setProposal(prev => ({ ...prev, status: 'approved' }));
      
      Alert.alert(
        'Proposta Aprovada',
        'A proposta foi aprovada com sucesso. O contrato será enviado para o locatário.',
        [{ text: 'OK', onPress: () => router.push('/contract/send/' + id) }]
      );
    } catch (error) {
      console.error('Error approving proposal:', error);
      Alert.alert('Erro', 'Não foi possível aprovar a proposta.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectProposal = async () => {
    setActionLoading(true);
    
    try {
      // In a real app, update in Supabase
      // For now, update local state
      setProposal(prev => ({ 
        ...prev, 
        status: 'rejected',
        rejectionReason: 'Moto indisponível para o período solicitado.'
      }));
      
      Alert.alert(
        'Proposta Recusada',
        'A proposta foi recusada com sucesso.',
        [{ text: 'OK', onPress: () => router.push('/(tabs)/proposals') }]
      );
    } catch (error) {
      console.error('Error rejecting proposal:', error);
      Alert.alert('Erro', 'Não foi possível recusar a proposta.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendContract = async () => {
    router.push('/auth/contract');
  };

  const handleViewContract = async () => {
    router.push('/auth/contract');
  };

  const handleSignContract = async () => {
    router.push('/auth/contract');
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
        return <AlertCircle size={20} color={colors.warning} />;
      case 'approved':
        return <CheckCircle size={20} color={colors.success} />;
      case 'rejected':
        return <XCircle size={20} color={colors.danger} />;
      default:
        return null;
    }
  };

  const isOwner = () => {
    return user?.id === proposal?.owner.id;
  };

  const isRenter = () => {
    return user?.id === proposal?.renter.id;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!proposal) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Proposta não encontrada.</Text>
        <Button
          title="Voltar"
          onPress={() => router.back()}
          style={styles.backButtonError}
        />
      </SafeAreaView>
    );
  }

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
          <Text style={styles.title}>Detalhes da Proposta</Text>
        </View>

        <View style={styles.statusContainer}>
          {getStatusIcon(proposal.status)}
          <Text style={[styles.statusText, { color: getStatusColor(proposal.status) }]}>
            {getStatusText(proposal.status)}
          </Text>
        </View>

        <View style={styles.motorcycleContainer}>
          <Image 
            source={{ uri: proposal.motorcycle.image }} 
            style={styles.motorcycleImage}
          />
          <View style={styles.motorcycleInfo}>
            <Text style={styles.motorcycleName}>{proposal.motorcycle.name}</Text>
            <TouchableOpacity 
              style={styles.viewMotorcycleButton}
              onPress={() => router.push(`/motorcycle/${proposal.motorcycle.id}`)}
            >
              <Text style={styles.viewMotorcycleText}>Ver detalhes</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Período de Locação</Text>
          <View style={styles.infoItem}>
            <Calendar size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              {proposal.startDate.toLocaleDateString()} - {proposal.endDate.toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Clock size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              Proposta enviada em {proposal.createdAt.toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalhes da Proposta</Text>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Finalidade da Locação</Text>
            <Text style={styles.detailValue}>{proposal.purpose}</Text>
          </View>
          {proposal.additionalInfo && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Informações Adicionais</Text>
              <Text style={styles.detailValue}>{proposal.additionalInfo}</Text>
            </View>
          )}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Valor Total</Text>
            <Text style={styles.priceValue}>R$ {proposal.totalAmount.toFixed(2)}</Text>
          </View>
        </View>

        {proposal.status === 'rejected' && proposal.rejectionReason && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Motivo da Recusa</Text>
            <View style={styles.rejectionContainer}>
              <XCircle size={20} color={colors.danger} />
              <Text style={styles.rejectionText}>{proposal.rejectionReason}</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isOwner() ? 'Dados do Locatário' : 'Dados do Locador'}
          </Text>
          <View style={styles.userContainer}>
            <View style={styles.userAvatar}>
              <User size={24} color={colors.white} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {isOwner() ? proposal.renter.name : proposal.owner.name}
              </Text>
              <Text style={styles.userContact}>
                {isOwner() ? proposal.renter.email : proposal.owner.email}
              </Text>
              <Text style={styles.userContact}>
                {isOwner() ? proposal.renter.phone : proposal.owner.phone}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.contactButton}>
            <MessageSquare size={20} color={colors.white} />
            <Text style={styles.contactButtonText}>Enviar Mensagem</Text>
          </TouchableOpacity>
        </View>

        {proposal.status === 'approved' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contrato</Text>
            {proposal.contractSent ? (
              <View>
                <View style={styles.contractStatus}>
                  <FileText size={20} color={colors.success} />
                  <Text style={styles.contractStatusText}>
                    {proposal.contractSigned 
                      ? 'Contrato assinado' 
                      : 'Contrato enviado, aguardando assinatura'}
                  </Text>
                </View>
                <Button
                  title={isRenter() && !proposal.contractSigned ? "Assinar Contrato" : "Visualizar Contrato"}
                  onPress={isRenter() && !proposal.contractSigned ? handleSignContract : handleViewContract}
                  style={styles.contractButton}
                  icon={<FileText size={20} color={colors.white} />}
                />
              </View>
            ) : (
              isOwner() && (
                <Button
                  title="Enviar Contrato"
                  onPress={handleSendContract}
                  style={styles.contractButton}
                  icon={<Send size={20} color={colors.white} />}
                />
              )
            )}
          </View>
        )}

        {isOwner() && proposal.status === 'pending' && (
          <View style={styles.actionButtons}>
            <Button
              title="Recusar"
              onPress={handleRejectProposal}
              loading={actionLoading}
              variant="outline"
              style={styles.rejectButton}
              textStyle={{ color: colors.danger }}
              icon={<XCircle size={20} color={colors.danger} />}
            />
            <Button
              title="Aprovar"
              onPress={handleApproveProposal}
              loading={actionLoading}
              style={styles.approveButton}
              icon={<CheckCircle size={20} color={colors.white} />}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 20,
  },
  backButtonError: {
    width: 200,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: colors.textDark,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginLeft: 12,
  },
  motorcycleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  motorcycleImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  motorcycleInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  motorcycleName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 8,
  },
  viewMotorcycleButton: {
    alignSelf: 'flex-start',
  },
  viewMotorcycleText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primary,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textDark,
    marginLeft: 12,
  },
  detailItem: {
    marginBottom: 12,
  },
  detailLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.textDark,
  },
  priceValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.primary,
  },
  rejectionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: `${colors.danger}10`,
    borderRadius: 8,
    padding: 12,
  },
  rejectionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textDark,
    marginLeft: 12,
    flex: 1,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 4,
  },
  userContact: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textLight,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
  },
  contactButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.white,
    marginLeft: 8,
  },
  contractStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contractStatusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textDark,
    marginLeft: 12,
  },
  contractButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rejectButton: {
    flex: 1,
    marginRight: 8,
    borderColor: colors.danger,
  },
  approveButton: {
    flex: 1,
    marginLeft: 8,
  },
});