import { View, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { colors } from '@/constants/colors';

export default function MotorcycleSkeleton() {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.image,
          { opacity: fadeAnim }
        ]} 
      />
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.title,
            { opacity: fadeAnim }
          ]} 
        />
        <Animated.View 
          style={[
            styles.location,
            { opacity: fadeAnim }
          ]} 
        />
        <View style={styles.footer}>
          <Animated.View 
            style={[
              styles.price,
              { opacity: fadeAnim }
            ]} 
          />
          <Animated.View 
            style={[
              styles.rating,
              { opacity: fadeAnim }
            ]} 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  image: {
    width: '100%',
    height: 200,
    backgroundColor: colors.border,
  },
  content: {
    padding: 16,
  },
  title: {
    height: 24,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: 8,
    width: '70%',
  },
  location: {
    height: 16,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: 16,
    width: '50%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    height: 20,
    backgroundColor: colors.border,
    borderRadius: 4,
    width: '30%',
  },
  rating: {
    height: 20,
    backgroundColor: colors.border,
    borderRadius: 4,
    width: '20%',
  },
});