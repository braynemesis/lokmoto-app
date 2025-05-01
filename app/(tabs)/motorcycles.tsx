import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search, Filter, MapPin, Star, ChevronDown } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import Input from '@/components/Input';

const MOTORCYCLE_DATA = [
  {
    id: '1',
    name: 'Honda CB 500F',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=300&auto=format&fit=crop',
    price: 120,
    rating: 4.8,
    location: 'São Paulo, SP',
    category: 'Esportiva',
  },
  {
    id: '2',
    name: 'Yamaha MT-07',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=300&auto=format&fit=crop',
    price: 150,
    rating: 4.9,
    location: 'Rio de Janeiro, RJ',
    category: 'Naked',
  },
  {
    id: '3',
    name: 'Kawasaki Z900',
    image: 'https://images.unsplash.com/photo-1580310614729-ccd69652491d?q=80&w=300&auto=format&fit=crop',
    price: 180,
    rating: 4.7,
    location: 'Belo Horizonte, MG',
    category: 'Naked',
  },
  {
    id: '4',
    name: 'BMW G 310 R',
    image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=300&auto=format&fit=crop',
    price: 200,
    rating: 4.6,
    location: 'Curitiba, PR',
    category: 'Roadster',
  },
  {
    id: '5',
    name: 'Ducati Monster',
    image: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?q=80&w=300&auto=format&fit=crop',
    price: 250,
    rating: 4.9,
    location: 'São Paulo, SP',
    category: 'Naked',
  },
  {
    id: '6',
    name: 'Harley-Davidson Iron 883',
    image: 'https://images.unsplash.com/photo-1604357209793-fca5dca89f97?q=80&w=300&auto=format&fit=crop',
    price: 220,
    rating: 4.5,
    location: 'Rio de Janeiro, RJ',
    category: 'Custom',
  },
];

const FILTERS = [
  { id: 'category', name: 'Categoria' },
  { id: 'price', name: 'Preço' },
  { id: 'rating', name: 'Avaliação' },
  { id: 'location', name: 'Localização' },
];

export default function MotorcyclesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [motorcycles, setMotorcycles] = useState(MOTORCYCLE_DATA);
  const [activeFilter, setActiveFilter] = useState('');
  const [sortBy, setSortBy] = useState('recommended');

  const renderMotorcycleItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.motorcycleItem}
      onPress={() => router.push(`/motorcycle/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.motorcycleImage} />
      <View style={styles.motorcycleContent}>
        <View style={styles.motorcycleHeader}>
          <Text style={styles.motorcycleName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color={colors.secondary} fill={colors.secondary} />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        
        <Text style={styles.motorcycleCategory}>{item.category}</Text>
        
        <View style={styles.locationRow}>
          <MapPin size={14} color={colors.textLight} />
          <Text style={styles.motorcycleLocation}>{item.location}</Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Diária</Text>
          <Text style={styles.priceValue}>R$ {item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
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
               sortBy === 'price_desc' ? 'Maior preço' : 
               sortBy === 'rating' ? 'Melhor avaliação' : 'Recomendados'}
            </Text>
            <ChevronDown size={16} color={colors.textDark} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={motorcycles}
        keyExtractor={(item) => item.id}
        renderItem={renderMotorcycleItem}
        contentContainerStyle={styles.motorcycleList}
        showsVerticalScrollIndicator={false}
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.textDark,
    marginLeft: 4,
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
});