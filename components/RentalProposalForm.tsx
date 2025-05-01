import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { X, Calendar, DollarSign, MessageSquare, Send } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';

interface RentalProposalFormProps {
  motorcycle: any;
  startDate: Date | null;
  endDate: Date | null;
  totalPrice: number;
  onClose: () => void;
  onSubmit: (purpose: string, additionalInfo: string) => void;
  loading: boolean;
}

export default function RentalProposalForm({
  motorcycle,
  startDate,
  endDate,
  totalPrice,
  onClose,
  onSubmit,
  loading
}: RentalProposalFormProps) {
  const [purpose, setPurpose] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [errors, setErrors] = useState<{purpose?: string; additionalInfo?: string}>({});

  const validate = () => {
    const newErrors: {purpose?: string; additionalInfo?: string} = {};
    
    if (!purpose.trim()) {
      newErrors.purpose = 'Informe a finalidade da locação';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(purpose, additionalInfo);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Enviar Proposta</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={colors.textDark} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContent}>
          <View style={styles.motorcycleInfo}>
            <Text style={styles.motorcycleName}>{motorcycle.name}</Text>
            <Text style={styles.motorcycleLocation}>{motorcycle.location}</Text>
          </View>

          <View style={styles.infoItem}>
            <Calendar size={20} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Período</Text>
              <Text style={styles.infoValue}>
                {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <DollarSign size={20} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Valor Total</Text>
              <Text style={styles.infoValue}>R$ {totalPrice.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Finalidade da Locação *</Text>
            <TextInput
              style={[styles.input, errors.purpose && styles.inputError]}
              placeholder="Ex: Trabalho, lazer, viagem, etc."
              value={purpose}
              onChangeText={setPurpose}
              multiline={false}
            />
            {errors.purpose && <Text style={styles.errorText}>{errors.purpose}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Informações Adicionais</Text>
            <TextInput
              style={[styles.textArea, errors.additionalInfo && styles.inputError]}
              placeholder="Compartilhe informações adicionais que possam ser relevantes para o locador..."
              value={additionalInfo}
              onChangeText={setAdditionalInfo}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
            {errors.additionalInfo && <Text style={styles.errorText}>{errors.additionalInfo}</Text>}
          </View>

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              Ao enviar esta proposta, você concorda com os termos de serviço e política de cancelamento. O locador irá analisar sua proposta e você receberá uma notificação com a resposta.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Enviar Proposta"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
            icon={<Send size={20} color={colors.white} />}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
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
    paddingTop: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: colors.textDark,
  },
  closeButton: {
    padding: 5,
  },
  scrollContent: {
    padding: 20,
  },
  motorcycleInfo: {
    marginBottom: 20,
  },
  motorcycleName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: colors.textDark,
    marginBottom: 4,
  },
  motorcycleLocation: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textLight,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textLight,
  },
  infoValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textDark,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textDark,
  },
  textArea: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textDark,
    height: 100,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.danger,
    marginTop: 4,
  },
  termsContainer: {
    marginBottom: 20,
  },
  termsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 18,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});