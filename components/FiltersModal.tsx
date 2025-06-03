import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import Button from './Button';
import PriceRangeFilter from './PriceRangeFilter';
import { useMotorcycleCategories } from '@/hooks/useMotorcycleCategories';

interface FiltersModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  currentFilters: any;
}

export default function FiltersModal({
  visible,
  onClose,
  onApply,
  currentFilters,
}: FiltersModalProps) {
  const { data: categories = [] } = useMotorcycleCategories();
  const [selectedCategory, setSelectedCategory] = React.useState(currentFilters.category || '');
  const [minPrice, setMinPrice] = React.useState(currentFilters.minPrice?.toString() || '');
  const [maxPrice, setMaxPrice] = React.useState(currentFilters.maxPrice?.toString() || '');
  const [location, setLocation] = React.useState(currentFilters.location || '');

  const handleApply = () => {
    onApply({
      category: selectedCategory,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      location,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Filtros</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={colors.textDark} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Categorias</Text>
              <View style={styles.categoriesGrid}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category && styles.categoryButtonActive
                    ]}
                    onPress={() => setSelectedCategory(
                      selectedCategory === category ? '' : category
                    )}
                  >
                    <Text style={[
                      styles.categoryButtonText,
                      selectedCategory === category && styles.categoryButtonTextActive
                    ]}>{category}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <PriceRangeFilter
                minPrice={minPrice}
                maxPrice={maxPrice}
                onMinPriceChange={setMinPrice}
                onMaxPriceChange={setMaxPrice}
              />
            </View>

            <View style={styles.section}>
              <Button
                title="Aplicar Filtros"
                onPress={handleApply}
                style={styles.applyButton}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: colors.textDark,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textDark,
  },
  categoryButtonTextActive: {
    color: colors.white,
  },
  applyButton: {
    marginTop: 16,
  },
});