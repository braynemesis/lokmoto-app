import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';
import Input from '@/components/Input';

export default function OnboardingScreen() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<'renter' | 'owner'>('renter');
  const [phone, setPhone] = useState('');

  const handleComplete = async () => {
    try {
      setLoading(true);
      
      // Update user metadata with phone and type
      await user?.update({
        unsafeMetadata: {
          userType,
          phone,
        },
      });

      // Navigate to the appropriate profile completion screen
      router.replace(userType === 'renter' ? '/auth/renter-profile' : '/auth/owner-profile');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>Tell us a bit more about yourself</Text>

        <View style={styles.form}>
          <View style={styles.userTypeContainer}>
            <Text style={styles.label}>I want to:</Text>
            <View style={styles.userTypeButtons}>
              <Button
                title="Rent Motorcycles"
                onPress={() => setUserType('renter')}
                variant={userType === 'renter' ? 'primary' : 'outline'}
                style={[styles.userTypeButton, styles.userTypeButtonLeft]}
              />
              <Button
                title="List My Motorcycles"
                onPress={() => setUserType('owner')}
                variant={userType === 'owner' ? 'primary' : 'outline'}
                style={[styles.userTypeButton, styles.userTypeButtonRight]}
              />
            </View>
          </View>

          <Input
            label="Phone Number"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Button
            title="Continue"
            onPress={handleComplete}
            loading={loading}
            style={styles.continueButton}
          />
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
  content: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: colors.textDark,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  userTypeContainer: {
    marginBottom: 24,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 12,
  },
  userTypeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  userTypeButton: {
    flex: 1,
  },
  userTypeButtonLeft: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  userTypeButtonRight: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  continueButton: {
    marginTop: 'auto',
  },
});