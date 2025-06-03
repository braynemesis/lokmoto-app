import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search, Filter, MapPin, Heart, ChevronDown } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import Input from '@/components/Input';
import { useMotorcycles } from '@/hooks/useMotorcycles';
import type { MotorcycleFilters } from '@/types/motorcycle';

const FILTERS = [
  { id: 'category', name: 'Categoria' },
  { id: 'price', name: 'Preço' },
  { id: 'location', name: 'Localização' },
];

export default function MotorcyclesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<MotorcycleFilters>({});
  const [activeFilter, setActiveFilter] = useState('');
  const [sortBy, setSortBy] = useState('recommended');

  const { data: motorcycles, isLoading, error } = useMotorcycles(filters);

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
              <TouchableOpacity style={styles.filterButton}>
                <Filter size={20} color={colors.primary} />
              </TouchableOpacity>
            }
            containerStyle={styles.searchInputContainer}
          />
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {FILTERS.map((filter) => (
            <TouchableOpacity 
              key={filter.id} 
              style={[
                styles.filterChip,
                activeFilter === filter.id && styles.filterChipActive
              ]}
              onPress={() => setActiveFilter(activeFilter === filter.id ? '' : filter.id)}
            >
              <Text style={[
                styles.filterChipText,
                activeFilter === filter.id && styles.filterChipTextActive
              ]}>{filter.name}</Text>
              <ChevronDown size={16} color={activeFilter === filter.id ? colors.white : colors.textDark} />
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Ordenar por:</Text>
          <TouchableOpacity style={styles.sortButton}>
            <Text style={styles.sortButtonText}>
              {sortBy === 'recommended' ? 'Recomendados' : 
               sortBy === 'price_asc' ? 'Menor preço' : 
               sortBy === 'price_desc' ? 'Maior preço' : 'Recomendados'}
            </Text>
            <ChevronDown size={16} color={colors.textDark} />
          </TouchableOpacity>
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
  filtersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textDark,
    marginRight: 4,
  },
  filterChipTextActive: {
    color: colors.white,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  sortLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textLight,
    marginRight: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textDark,
    marginRight: 4,
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