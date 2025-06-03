import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search, Filter, MapPin, Heart, ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/Input';
import MotorcycleSkeleton from '@/components/MotorcycleSkeleton';
import { useMotorcycles, useFeaturedMotorcycles, useNearbyMotorcycles } from '@/hooks/useMotorcycles';
import type { MotorcycleFilters } from '@/types/motorcycle';

const CATEGORIES = [
  { id: '1', name: 'Sport', icon: '🏍️' },
  { id: '2', name: 'Urban', icon: '🛵' },
  { id: '3', name: 'Trail', icon: '🏔️' },
  { id: '4', name: 'Custom', icon: '🔧' },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<MotorcycleFilters>({});
  
  const { 
    data: featuredMotorcycles,
    isLoading: isFeaturedLoading 
  } = useFeaturedMotorcycles();
  
  const {
    data: nearbyMotorcycles,
    isLoading: isNearbyLoading
  } = useNearbyMotorcycles(-23.5505, -46.6333); // São Paulo coordinates

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.fullName || 'Guest'}</Text>
            <View style={styles.locationContainer}>
              <MapPin size={16} color={colors.primary} />
              <Text style={styles.location}>São Paulo, SP</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg?auto=compress&cs=tinysrgb&w=100' }} 
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Input
            placeholder="Search motorcycles..."
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

        <View style={styles.categoriesContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity 
                key={category.id} 
                style={styles.categoryItem}
                onPress={() => setFilters(prev => ({ ...prev, category: category.name }))}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.featuredContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Motorcycles</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/motorcycles')}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          
          {isFeaturedLoading ? (
            <View style={styles.motorcycleList}>
              {[1, 2, 3].map((key) => (
                <MotorcycleSkeleton key={key} />
              ))}
            </View>
          ) : (
            <FlatList
              data={featuredMotorcycles}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.motorcycleCard} 
                  onPress={() => router.push(`/motorcycle/${item.id}`)}
                >
                  <Image source={{ uri: item.image_urls[0] }} style={styles.motorcycleImage} />
                  <View style={styles.motorcycleInfo}>
                    <Text style={styles.motorcycleName}>{item.brand} {item.model}</Text>
                    <View style={styles.motorcycleDetails}>
                      <Text style={styles.motorcyclePrice}>R$ {item.daily_rate}/day</Text>
                      <TouchableOpacity>
                        <Heart size={20} color={colors.textLight} />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.locationRow}>
                      <MapPin size={14} color={colors.textLight} />
                      <Text style={styles.motorcycleLocation}>{item.location}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              style={styles.motorcycleList}
            />
          )}
        </View>

        <View style={styles.nearbyContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Near You</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          
          {isNearbyLoading ? (
            <View>
              {[1, 2].map((key) => (
                <MotorcycleSkeleton key={key} />
              ))}
            </View>
          ) : (
            nearbyMotorcycles?.map((motorcycle) => (
              <TouchableOpacity 
                key={motorcycle.id} 
                style={styles.nearbyItem}
                onPress={() => router.push(`/motorcycle/${motorcycle.id}`)}
              >
                <Image source={{ uri: motorcycle.image_urls[0] }} style={styles.nearbyImage} />
                <View style={styles.nearbyInfo}>
                  <Text style={styles.nearbyName}>{motorcycle.brand} {motorcycle.model}</Text>
                  <View style={styles.nearbyDetails}>
                    <Text style={styles.nearbyPrice}>R$ {motorcycle.daily_rate}/day</Text>
                    <TouchableOpacity>
                      <Heart size={20} color={colors.textLight} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.locationRow}>
                    <MapPin size={14} color={colors.textLight} />
                    <Text style={styles.motorcycleLocation}>{motorcycle.location}</Text>
                  </View>
                </View>
                <ChevronRight size={20} color={colors.textLight} />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: colors.textDark,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  location: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    marginBottom: 24,
  },
  searchInputContainer: {
    marginBottom: 0,
  },
  filterButton: {
    padding: 4,
  },
  categoriesContainer: {
    marginBottom: 24,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: colors.textDark,
  },
  seeAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primary,
  },
  categoriesScroll: {
    marginLeft: -8,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 80,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textDark,
    textAlign: 'center',
  },
  featuredContainer: {
    marginBottom: 24,
  },
  motorcycleList: {
    marginLeft: -8,
  },
  motorcycleCard: {
    width: 220,
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 8,
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  motorcycleImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  motorcycleInfo: {
    padding: 12,
  },
  motorcycleName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 8,
  },
  motorcycleDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  motorcyclePrice: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.primary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  motorcycleLocation: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 4,
  },
  nearbyContainer: {
    marginBottom: 24,
  },
  nearbyItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  nearbyImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
  },
  nearbyInfo: {
    flex: 1,
    padding: 12,
  },
  nearbyName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 4,
  },
  nearbyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nearbyPrice: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.primary,
  },
});