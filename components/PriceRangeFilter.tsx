import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import Input from './Input';

interface PriceRangeFilterProps {
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
}

export default function PriceRangeFilter({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
}: PriceRangeFilterProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Faixa de Preço</Text>
      <View style={styles.inputsContainer}>
        <View style={styles.inputWrapper}>
          <Input
            label="Mínimo"
            placeholder="R$ 0"
            value={minPrice}
            onChangeText={onMinPriceChange}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.separator}>
          <Text style={styles.separatorText}>até</Text>
        </View>
        <View style={styles.inputWrapper}>
          <Input
            label="Máximo"
            placeholder="R$ 1000"
            value={maxPrice}
            onChangeText={onMaxPriceChange}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 16,
  },
  inputsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
  },
  separator: {
    paddingHorizontal: 12,
    alignSelf: 'flex-end',
    paddingBottom: 16,
  },
  separatorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textLight,
  },
});