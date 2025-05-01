import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Calendar as CalendarIcon, 
  Clock, 
  Info, 
  Shield, 
  ChevronRight, 
  ChevronLeft,
  Heart,
  Send
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import Calendar from '@/components/Calendar';
import RentalProposalForm from '@/components/RentalProposalForm';

// Mock data for motorcycle details
const MOTORCYCLE_DATA = {
  '1': {
    id: '1',
    name: 'Honda CB 500F',
    images: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558980394-4c7c9299fe96?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop'
    ],
    price: 120,
    rating: 4.8,
    location: 'São Paulo, SP',
    category: 'Esportiva',
    year: 2022,
    engine: '471cc',
    power: '47 hp',
    mileage: '12.000 km',
    features: ['ABS', 'Injeção Eletrônica', 'Painel Digital', 'Partida Elétrica'],
    description: 'A Honda CB 500F é uma naked de média cilindrada que combina estilo, desempenho e economia. Com seu motor bicilíndrico de 471cc, oferece potência suficiente para o dia a dia e para viagens, sem comprometer o consumo de combustível. Seu design moderno e agressivo chama a atenção por onde passa.',
    owner: {
      name: 'Carlos Oliveira',
      rating: 4.9,
      responseTime: '1 hora',
      verified: true
    }
  },
  '2': {
    id: '2',
    name: 'Yamaha MT-07',
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558980394-dbb977039a2e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558981359-219d6364c9c8?q=80&w=800&auto=format&fit=crop'
    ],
    price: 150,
    rating: 4.9,
    location: 'Rio de Janeiro, RJ',
    category: 'Naked',
    year: 2023,
    engine: '689cc',
    power: '74 hp',
    mileage: '5.000 km',
    features: ['ABS', 'Injeção Eletrônica', 'Painel Digital', 'Partida Elétrica', 'Controle de Tração'],
    description: 'A Yamaha MT-07 é uma naked de média cilindrada que se destaca pelo seu motor bicilíndrico CP2 de 689cc, que entrega torque em baixas e médias rotações. Com design agressivo e minimalista, é uma moto versátil, ideal tanto para o uso urbano quanto para viagens de fim de semana.',
    owner: {
      name: 'Mariana Costa',
      rating: 4.8,
      responseTime: '30 minutos',
      verified: true
    }
  },
  '3': {
    id: '3',
    name: 'Kawasaki Z900',
    images: [
      'https://images.unsplash.com/photo-1580310614729-ccd69652491d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580310614729-ccd69652491d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580310614729-ccd69652491d?q=80&w=800&auto=format&fit=crop'
    ],
    price: 180,
    rating: 4.7,
    location: 'Belo Horizonte, MG',
    category: 'Naked',
    year: 2022,
    engine: '948cc',
    power: '125 hp',
    mileage: '8.000 km',
    features: ['ABS', 'Injeção Eletrônica', 'Painel Digital', 'Partida Elétrica', 'Controle de Tração', 'Modos de Pilotagem'],
    description: 'A Kawasaki Z900 é uma naked esportiva com motor de 948cc que entrega 125 cavalos de potência. Com seu design agressivo e linhas afiadas, a Z900 é uma moto que não passa despercebida. Seu motor de quatro cilindros oferece performance excepcional, enquanto o chassi leve e ágil proporciona uma pilotagem precisa e divertida.',
    owner: {
      name: 'Roberto Almeida',
      rating: 4.7,
      responseTime: '2 horas',
      verified: true
    }
  },
  '4': {
    id: '4',
    name: 'BMW G 310 R',
    images: [
      'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=800&auto=format&fit=crop'
    ],
    price: 200,
    rating: 4.6,
    location: 'Curitiba, PR',
    category: 'Roadster',
    year: 2023,
    engine: '313cc',
    power: '34 hp',
    mileage: '3.000 km',
    features: ['ABS', 'Injeção Eletrônica', 'Painel Digital', 'Partida Elétrica'],
    description: 'A BMW G 310 R é uma roadster compacta e ágil, ideal para o uso urbano. Com seu motor monocilíndrico de 313cc, oferece uma combinação perfeita de economia e desempenho. Seu design moderno e a qualidade de acabamento BMW fazem dela uma excelente opção para quem busca uma moto premium de baixa cilindrada.',
    owner: {
      name: 'Fernanda Lima',
      rating: 4.9,
      responseTime: '15 minutos',
      verified: true
    }
  }
};

export default function MotorcycleDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [motorcycle, setMotorcycle] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalSent, setProposalSent] = useState(false);

  useEffect(() => {
    // In a real app, fetch motorcycle data from Supabase
    // For now, use mock data
    if (id && typeof id === 'string') {
      setMotorcycle(MOTORCYCLE_DATA[id]);
    }
  }, [id]);

  useEffect(() => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTotalDays(diffDays);
      setTotalPrice(diffDays * (motorcycle?.price || 0));
    } else {
      setTotalDays(0);
      setTotalPrice(0);
    }
  }, [startDate, endDate, motorcycle]);

  const handleNextImage = () => {
    if (motorcycle && currentImageIndex < motorcycle.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleDateSelect = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else {
      if (date < startDate) {
        setStartDate(date);
        setEndDate(null);
      } else {
        setEndDate(date);
        setShowCalendar(false);
      }
    }
  };

  const handleSendProposal = async () => {
    if (!user) {
      Alert.alert(
        'Autenticação Necessária',
        'Você precisa estar logado para enviar uma proposta.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Entrar', onPress: () => router.push('/auth/login') }
        ]
      );
      return;
    }

    if (!startDate || !endDate) {
      Alert.alert('Selecione as Datas', 'Por favor, selecione as datas de início e fim do aluguel.');
      return;
    }

    setShowProposalForm(true);
  };

  const handleSubmitProposal = async (purpose: string, additionalInfo: string) => {
    setLoading(true);

    try {
      // In a real app, create a rental proposal in Supabase
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create a mock proposal
      const proposal = {
        id: Math.random().toString(36).substring(7),
        motorcycle_id: motorcycle?.id,
        renter_id: user?.id,
        start_date: startDate,
        end_date: endDate,
        total_amount: totalPrice + Math.round(totalPrice * 0.1),
        status: 'pending',
        purpose,
        additional_info: additionalInfo,
        created_at: new Date()
      };

      // In a real app, save this to Supabase
      console.log('Proposal created:', proposal);

      setProposalSent(true);
      setShowProposalForm(false);

      Alert.alert(
        'Proposta Enviada',
        'Sua proposta foi enviada com sucesso! O locador irá analisá-la e você receberá uma notificação em breve.',
        [
          { text: 'OK', onPress: () => router.push('/(tabs)') }
        ]
      );
    } catch (error) {
      console.error('Error sending proposal:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao enviar sua proposta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!motorcycle) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Heart 
              size={24} 
              color={colors.white} 
              fill={isFavorite ? colors.secondary : 'transparent'} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: motorcycle.images[currentImageIndex] }} 
            style={styles.motorcycleImage}
          />
          
          {motorcycle.images.length > 1 && (
            <>
              <TouchableOpacity 
                style={[styles.imageNavButton, styles.prevButton]}
                onPress={handlePrevImage}
                disabled={currentImageIndex === 0}
              >
                <ChevronLeft size={24} color={colors.white} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.imageNavButton, styles.nextButton]}
                onPress={handleNextImage}
                disabled={currentImageIndex === motorcycle.images.length - 1}
              >
                <ChevronRight size={24} color={colors.white} />
              </TouchableOpacity>
              
              <View style={styles.imagePagination}>
                {motorcycle.images.map((_, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.paginationDot,
                      index === currentImageIndex && styles.paginationDotActive
                    ]} 
                  />
                ))}
              </View>
            </>
          )}
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.motorcycleName}>{motorcycle.name}</Text>
            <View style={styles.ratingContainer}>
              <Star size={16} color={colors.secondary} fill={colors.secondary} />
              <Text style={styles.ratingText}>{motorcycle.rating}</Text>
            </View>
          </View>
          
          <View style={styles.locationContainer}>
            <MapPin size={16} color={colors.textLight} />
            <Text style={styles.locationText}>{motorcycle.location}</Text>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Diária</Text>
            <Text style={styles.priceValue}>R$ {motorcycle.price}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.specificationContainer}>
            <Text style={styles.sectionTitle}>Especificações</Text>
            
            <View style={styles.specificationGrid}>
              <View style={styles.specificationItem}>
                <Text style={styles.specificationLabel}>Categoria</Text>
                <Text style={styles.specificationValue}>{motorcycle.category}</Text>
              </View>
              
              <View style={styles.specificationItem}>
                <Text style={styles.specificationLabel}>Ano</Text>
                <Text style={styles.specificationValue}>{motorcycle.year}</Text>
              </View>
              
              <View style={styles.specificationItem}>
                <Text style={styles.specificationLabel}>Motor</Text>
                <Text style={styles.specificationValue}>{motorcycle.engine}</Text>
              </View>
              
              <View style={styles.specificationItem}>
                <Text style={styles.specificationLabel}>Potência</Text>
                <Text style={styles.specificationValue}>{motorcycle.power}</Text>
              </View>
              
              <View style={styles.specificationItem}>
                <Text style={styles.specificationLabel}>Quilometragem</Text>
                <Text style={styles.specificationValue}>{motorcycle.mileage}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.featuresContainer}>
            <Text style={styles.sectionTitle}>Características</Text>
            
            <View style={styles.featuresList}>
              {motorcycle.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.featureDot} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.descriptionText}>{motorcycle.description}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.ownerContainer}>
            <Text style={styles.sectionTitle}>Sobre o Locador</Text>
            
            <View style={styles.ownerInfo}>
              <View style={styles.ownerProfile}>
                <View style={styles.ownerAvatar}>
                  <Text style={styles.ownerInitials}>{motorcycle.owner.name.charAt(0)}</Text>
                </View>
                <View style={styles.ownerDetails}>
                  <Text style={styles.ownerName}>{motorcycle.owner.name}</Text>
                  <View style={styles.ownerRating}>
                    <Star size={14} color={colors.secondary} fill={colors.secondary} />
                    <Text style={styles.ownerRatingText}>{motorcycle.owner.rating}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.ownerStats}>
                <View style={styles.ownerStatItem}>
                  <Clock size={16} color={colors.textLight} />
                  <Text style={styles.ownerStatText}>Responde em {motorcycle.owner.responseTime}</Text>
                </View>
                
                {motorcycle.owner.verified && (
                  <View style={styles.ownerStatItem}>
                    <Shield size={16} color={colors.success} />
                    <Text style={styles.ownerStatText}>Verificado</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.rentalContainer}>
            <Text style={styles.sectionTitle}>Período de Locação</Text>
            
            <TouchableOpacity 
              style={styles.dateSelector}
              onPress={() => setShowCalendar(!showCalendar)}
            >
              <CalendarIcon size={20} color={colors.primary} />
              <Text style={styles.dateSelectorText}>
                {startDate && endDate 
                  ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
                  : startDate 
                    ? `${startDate.toLocaleDateString()} - Selecione a data final`
                    : 'Selecione as datas de locação'}
              </Text>
              <ChevronRight size={20} color={colors.textLight} />
            </TouchableOpacity>
            
            {showCalendar && (
              <Calendar 
                onSelectDate={handleDateSelect}
                startDate={startDate}
                endDate={endDate}
              />
            )}
            
            {startDate && endDate && (
              <View style={styles.rentalSummary}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Período</Text>
                  <Text style={styles.summaryValue}>{totalDays} {totalDays === 1 ? 'dia' : 'dias'}</Text>
                </View>
                
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Valor da diária</Text>
                  <Text style={styles.summaryValue}>R$ {motorcycle.price}</Text>
                </View>
                
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Taxa de serviço</Text>
                  <Text style={styles.summaryValue}>R$ {Math.round(totalPrice * 0.1)}</Text>
                </View>
                
                <View style={styles.summaryTotal}>
                  <Text style={styles.summaryTotalLabel}>Total</Text>
                  <Text style={styles.summaryTotalValue}>R$ {totalPrice + Math.round(totalPrice * 0.1)}</Text>
                </View>
              </View>
            )}
            
            <Button
              title={loading ? "Processando..." : proposalSent ? "Proposta Enviada" : "Enviar Proposta"}
              onPress={handleSendProposal}
              loading={loading}
              disabled={!startDate || !endDate || loading || proposalSent}
              style={styles.rentButton}
              icon={proposalSent ? <Send size={20} color={colors.white} /> : undefined}
            />
            
            <View style={styles.infoContainer}>
              <Info size={16} color={colors.textLight} />
              <Text style={styles.infoText}>
                Ao enviar uma proposta, você concorda com os termos de serviço e política de cancelamento.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showProposalForm}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowProposalForm(false)}
      >
        <RentalProposalForm
          motorcycle={motorcycle}
          startDate={startDate}
          endDate={endDate}
          totalPrice={totalPrice + Math.round(totalPrice * 0.1)}
          onClose={() => setShowProposalForm(false)}
          onSubmit={handleSubmitProposal}
          loading={loading}
        />
      </Modal>
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
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    height: 300,
    width: '100%',
  },
  motorcycleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageNavButton: {
    position: 'absolute',
    top: '50%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
  },
  prevButton: {
    left: 20,
  },
  nextButton: {
    right: 20,
  },
  imagePagination: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: colors.white,
  },
  contentContainer: {
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  motorcycleName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: colors.textDark,
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.textDark,
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(83, 127, 231, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  priceLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textDark,
  },
  priceValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 20,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: colors.textDark,
    marginBottom: 16,
  },
  specificationContainer: {
    marginBottom: 20,
  },
  specificationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  specificationItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  specificationLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  specificationValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textDark,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 12,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  featureText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textDark,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 22,
  },
  ownerContainer: {
    marginBottom: 20,
  },
  ownerInfo: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ownerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ownerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ownerInitials: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: colors.white,
  },
  ownerDetails: {
    flex: 1,
  },
  ownerName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 4,
  },
  ownerRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerRatingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textDark,
    marginLeft: 4,
  },
  ownerStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ownerStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  ownerStatText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textDark,
    marginLeft: 4,
  },
  rentalContainer: {
    marginBottom: 20,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateSelectorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textDark,
    flex: 1,
    marginLeft: 12,
  },
  rentalSummary: {
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
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textLight,
  },
  summaryValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textDark,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    marginTop: 4,
  },
  summaryTotalLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textDark,
  },
  summaryTotalValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: colors.primary,
  },
  rentButton: {
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 8,
    flex: 1,
  },
});