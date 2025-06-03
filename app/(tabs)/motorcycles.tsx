import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search, Filter, MapPin, Heart } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import Input from '@/components/Input';
import FiltersModal from '@/components/FiltersModal';
import { useMotorcycles } from '@/hooks/useMotorcycles';
import type { MotorcycleFilters } from '@/types/motorcycle';

export default function MotorcyclesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<MotorcycleFilters>({});

  const { data: motorcycles, isLoading, error } = useMotorcycles(filters);

  const handleApplyFilters = (newFilters: MotorcycleFilters) => {
    setFilters(newFilters);
  };

  const renderMotorcycleItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.motorcycleItem}
      onPress={() => router.push(`/motorcycle/${item.id}`)}
    >
      <Image source={{ uri: item.image_urls[0] }} style={styles.motorcycleImage} />
      <View style={styles.motorcycleContent}>
        <View style={styles.motorcycleHeader}>
          <Text style={styles.motorcycleName}>{item.brand} {item.model}</Text>
          <TouchableOpacity>
            <Heart size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.motorcycleCategory}>{item.category}</Text>
        
        <View style={styles.locationRow}>
          <MapPin size={14} color={colors.textLight} />
          <Text style={styles.motorcycleLocation}>{item.location || 'São Paulo, SP'}</Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Diária</Text>
          <Text style={styles.priceValue}>R$ {item.daily_rate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {error 
          ? 'Erro ao carregar as motos. Tente novamente.'
          : 'Nenhuma moto encontrada.'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Motos Disponíveis</Text>
        <View style={styles.searchContainer}>
          <Input
            placeholder="Buscar motos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Search size={20} color={colors.textLight} />}
            rightIcon={
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={() => setShowFilters(true)}
              >
                <Filter size={20} color={colors.primary} />
              </TouchableOpacity>
            }
            containerStyle={styles.searchInputContainer}
          />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={motorcycles}
          keyExtractor={(item) => item.id}
          renderItem={renderMotorcycleItem}
          contentContainerStyle={styles.motorcycleList}
          ListEmptyComponent={renderEmptyList}
        />
      )}

      <FiltersModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
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
    paddingBottom: 10,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: colors.textDark,
    marginBottom: 16,
  },
  searchContainer: {
    marginBottom: 10,
  },
  searchInputContainer: {
    marginBottom: 0,
  },
  filterButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  motorcycleList: {
    padding: 20,
  },
  motorcycleItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  motorcycleImage: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
  },
  motorcycleContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  motorcycleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  motorcycleName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textDark,
    flex: 1,
    marginRight: 8,
  },
  motorcycleCategory: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textLight,
    marginVertical: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  motorcycleLocation: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textLight,
  },
  priceValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.primary,
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